const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const db = require('../config/database');

/**
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date
 */
const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    return d.toISOString().split('T')[0];
};

/**
 * Format time to HH:mm:ss
 * @param {string} time - Time to format
 * @returns {string} - Formatted time
 */
const formatTime = (time) => {
    if (!time) return null;
    return time.toString().split('.')[0];
};

/**
 * Calculate age from birth date
 * @param {Date} birthDate - birth date
 * @returns {Number} - age
 */
const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
};

/**
 * Format patient data for response
 * @param {Object} patient - Raw patient data from database
 * @returns {Object} - Formatted patient data
 */
const formatPatientData = (patient) => ({
    id: patient.clientID,
    name: `${patient.fName} ${patient.lName}`,
    gender: patient.gender,
    age: calculateAge(patient.birth),
    room: patient.room || 'Not Assigned',
    careReq: patient.careReq || 'None'
});

/**
 * Get assigned patients list
 * GET /api/caregiver/patients
 */
router.get('/patients', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;
        console.log('Found caregiverId:', caregiverId);

        const [patients] = await db.execute(
            'SELECT * FROM caregiver_patient_view WHERE caregiverID = ?',
            [caregiverId]
        );

        console.log('Found patients:', patients);

        res.json({
            success: true,
            data: patients.map(formatPatientData)
        });
    } catch (error) {
        console.error('Error getting patients list:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Get patient details
 * GET /api/caregiver/patients/:patientId
 */
router.get('/patients/:patientId', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;

        const [patients] = await db.execute(
            'SELECT * FROM caregiver_patient_view WHERE clientID = ? AND caregiverID = ?',
            [req.params.patientId, caregiverId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ success: false, error: 'Patient not found or not assigned' });
        }

        const patient = patients[0];
        res.json({
            success: true,
            data: {
                ...formatPatientData(patient),
                allergies: patient.allergies ? patient.allergies.split(',') : [],
                specialNotes: patient.specialNotes || 'None'
            }
        });
    } catch (error) {
        console.error('Error getting patient details:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Get care records
 * GET /api/caregiver/patients/:patientId/care-records
 */
router.get('/patients/:patientId/care-records', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;
        console.log('Using caregiverId:', caregiverId);

        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM caregiver_care_records_view WHERE clientID = ? AND caregiverID = ?';
        const params = [req.params.patientId, caregiverId];

        if (startDate) {
            query += ' AND date >= ?';
            params.push(startDate);
        }
        if (endDate) {
            query += ' AND date <= ?';
            params.push(endDate);
        }

        query += ' ORDER BY date DESC, time DESC';
        console.log('Executing query:', query, 'with params:', params);

        const [records] = await db.execute(query, params);
        console.log('Found records:', records);

        res.json({
            success: true,
            data: records.map(record => ({
                id: record.recordID,
                date: formatDate(record.date),
                time: formatTime(record.time),
                type: record.type,
                content: record.content,
                operator: record.operator,
                status: record.status
            }))
        });
    } catch (error) {
        console.error('Error getting care records:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Add care record
 * POST /api/caregiver/patients/:patientId/care-records
 */
router.post('/patients/:patientId/care-records', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        const { type, content, status } = req.body;
        console.log('Adding care record:', { type, content, status });
        
        if (!type || !content || !status) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );
        console.log('Found caregivers:', caregivers);

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;
        console.log('Using caregiverId:', caregiverId);

        // Verify patient assignment
        const [assignments] = await db.execute(
            'SELECT * FROM client_caregiver_assignment WHERE clientID = ? AND caregiverID = ?',
            [req.params.patientId, caregiverId]
        );
        console.log('Found assignments:', assignments);

        if (assignments.length === 0) {
            return res.status(403).json({ success: false, error: 'Patient not assigned to this caregiver' });
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0];

        console.log('Inserting care record with:', {
            patientId: req.params.patientId,
            caregiverId,
            currentDate,
            currentTime,
            content,
            type,
            status
        });

        const [result] = await db.execute(
            'INSERT INTO careRecords (clientID, caregiverID, date, time, detail, type, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.params.patientId, caregiverId, currentDate, currentTime, content, type, status]
        );
        console.log('Insert result:', result);

        // Get operator name
        const [caregiverInfo] = await db.execute(
            'SELECT CONCAT(fName, " ", cg.lName) as operator FROM caregiver cg WHERE caregiverID = ?',
            [caregiverId]
        );
        console.log('Found caregiver info:', caregiverInfo);

        res.json({
            success: true,
            data: {
                id: result.insertId,
                date: currentDate,
                time: currentTime,
                type,
                content,
                operator: caregiverInfo[0].operator,
                status
            }
        });
    } catch (error) {
        console.error('Error adding care record:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Update care record
 * PUT /api/caregiver/patients/:patientId/care-records/:recordId
 */
router.put('/patients/:patientId/care-records/:recordId', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        const { type, content, status } = req.body;
        console.log('Updating care record:', { recordId: req.params.recordId, type, content, status });
        
        if (!type || !content || !status) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;
        console.log('Using caregiverId:', caregiverId);

        // Verify record ownership
        const [records] = await db.execute(
            'SELECT * FROM careRecords WHERE recordID = ? AND clientID = ? AND caregiverID = ?',
            [req.params.recordId, req.params.patientId, caregiverId]
        );
        console.log('Found records:', records);

        if (records.length === 0) {
            return res.status(403).json({ success: false, error: 'Record not found or not authorized' });
        }

        await db.execute(
            'UPDATE careRecords SET type = ?, detail = ?, status = ? WHERE recordID = ?',
            [type, content, status, req.params.recordId]
        );

        // Get updated record
        const [updatedRecords] = await db.execute(
            'SELECT * FROM caregiver_care_records_view WHERE recordID = ?',
            [req.params.recordId]
        );
        console.log('Updated record:', updatedRecords[0]);

        const record = updatedRecords[0];
        res.json({
            success: true,
            data: {
                id: record.recordID,
                date: formatDate(record.date),
                time: formatTime(record.time),
                type: record.type,
                content: record.content,
                operator: record.operator,
                status: record.status
            }
        });
    } catch (error) {
        console.error('Error updating care record:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Delete care record
 * DELETE /api/caregiver/patients/:patientId/care-records/:recordId
 */
router.delete('/patients/:patientId/care-records/:recordId', auth, checkRole(['caregiver']), async (req, res) => {
    try {
        // 首先获取caregiverID
        const [caregivers] = await db.execute(
            'SELECT staff_id as caregiverID FROM user_auth WHERE username = ? AND role = "caregiver"',
            [req.user.id]
        );

        if (caregivers.length === 0) {
            return res.status(404).json({ success: false, error: 'Caregiver not found' });
        }

        const caregiverId = caregivers[0].caregiverID;
        console.log('Using caregiverId:', caregiverId);

        // Verify record ownership
        const [records] = await db.execute(
            'SELECT * FROM careRecords WHERE recordID = ? AND clientID = ? AND caregiverID = ?',
            [req.params.recordId, req.params.patientId, caregiverId]
        );
        console.log('Found records:', records);

        if (records.length === 0) {
            return res.status(403).json({ success: false, error: 'Record not found or not authorized' });
        }

        await db.execute(
            'DELETE FROM careRecords WHERE recordID = ?',
            [req.params.recordId]
        );
        console.log('Record deleted successfully');

        res.json({
            success: true,
            message: '记录已成功删除'
        });
    } catch (error) {
        console.error('Error deleting care record:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router; 