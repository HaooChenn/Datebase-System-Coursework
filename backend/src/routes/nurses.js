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
    firstName: patient.fName,
    lastName: patient.lName,
    fullName: `${patient.fName} ${patient.lName}`,
    gender: patient.gender,
    age: calculateAge(patient.birth),
    room: patient.room || 'Not Assigned',
    treatmentRequirements: patient.nursingRequirements || 'None',
    allergies: patient.allergies || 'None',
    healthNotes: patient.healthNotes || 'None',
    birthDate: formatDate(patient.birth)
});

/**
 * Get all patients list
 * GET /api/nurse/patients
 */
router.get('/patients', auth, checkRole(['nurse']), async (req, res) => {
    try {
        console.log('Getting all patients list');
        const [patients] = await db.execute(
            'SELECT * FROM nurse_patient_view'
        );

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
 * Get patient basic information
 * GET /api/nurse/patients/:patientId
 */
router.get('/patients/:patientId', auth, checkRole(['nurse']), async (req, res) => {
    try {
        console.log('Getting patient info:', req.params.patientId);
        const [patients] = await db.execute(
            'SELECT * FROM nurse_patient_view WHERE clientID = ?',
            [req.params.patientId]
        );

        if (patients.length === 0) {
            return res.status(404).json({ success: false, error: 'Patient not found' });
        }

        res.json({
            success: true,
            data: formatPatientData(patients[0])
        });
    } catch (error) {
        console.error('Error getting patient info:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Get patient tasks
 * GET /api/nurse/patients/:patientId/tasks
 */
router.get('/patients/:patientId/tasks', auth, checkRole(['nurse']), async (req, res) => {
    try {
        console.log('Getting tasks:', { patientId: req.params.patientId, nurseId: req.user.id });
        const [tasks] = await db.execute(
            'SELECT * FROM treatmentRecords WHERE clientID = ? ORDER BY date DESC, time DESC',
            [req.params.patientId]
        );

        res.json({
            success: true,
            data: tasks.map(task => ({
                id: `${task.clientID}-${task.date}-${task.time}`,
                patientId: task.clientID,
                date: formatDate(task.date),
                time: formatTime(task.time),
                detail: task.detail
            }))
        });
    } catch (error) {
        console.error('Error getting tasks:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Add new task
 * POST /api/nurse/patients/:patientId/tasks
 */
router.post('/patients/:patientId/tasks', auth, checkRole(['nurse']), async (req, res) => {
    try {
        const { date, time, detail } = req.body;
        console.log('Adding task:', { patientId: req.params.patientId, date, time, detail });

        // Input validation
        if (!date || !time || !detail) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        // Get nurse ID
        const [nurses] = await db.execute(
            'SELECT nurseID FROM nurse WHERE nurseID = ?',
            [req.user.id]
        );

        if (nurses.length === 0) {
            return res.status(404).json({ success: false, error: 'Nurse not found' });
        }

        const nurseId = nurses[0].nurseID;

        await db.execute(
            'INSERT INTO treatmentRecords (clientID, nurseID, date, time, detail) VALUES (?, ?, ?, ?, ?)',
            [req.params.patientId, nurseId, date, time, detail]
        );

        res.json({
            success: true,
            data: {
                id: `${req.params.patientId}-${date}-${time}`,
                patientId: req.params.patientId,
                date,
                time,
                detail
            }
        });
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Get treatment records
 * GET /api/nurse/patients/:patientId/records
 */
router.get('/patients/:patientId/records', auth, checkRole(['nurse']), async (req, res) => {
    try {
        console.log('Getting treatment records:', req.params.patientId);
        const [records] = await db.execute(`
            SELECT 
                tr.clientID as patientId,
                tr.date,
                tr.time,
                tr.detail as content,
                CONCAT(n.fName, ' ', n.lName) as operator,
                n.nurseID as operatorId
            FROM treatmentRecords tr
            JOIN nurse n ON tr.nurseID = n.nurseID
            WHERE tr.clientID = ?
            ORDER BY tr.date DESC, tr.time DESC
        `, [req.params.patientId]);

        res.json({
            success: true,
            data: records.map(record => ({
                ...record,
                date: formatDate(record.date),
                time: formatTime(record.time)
            }))
        });
    } catch (error) {
        console.error('Error getting treatment records:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * Add treatment record
 * POST /api/nurse/patients/:patientId/records
 */
router.post('/patients/:patientId/records', auth, checkRole(['nurse']), async (req, res) => {
    try {
        const { content } = req.body;
        console.log('Adding treatment record:', { patientId: req.params.patientId, content });

        // Input validation
        if (!content) {
            return res.status(400).json({ success: false, error: 'Missing required parameters' });
        }

        const currentDate = new Date().toISOString().split('T')[0];
        const currentTime = new Date().toTimeString().split(' ')[0];

        // Get nurse info
        const [nurses] = await db.execute(
            'SELECT nurseID, fName, lName FROM nurse WHERE nurseID = ?',
            ['NURSE001'] // Temporarily hardcoded nurse ID
        );

        if (nurses.length === 0) {
            return res.status(404).json({ success: false, error: 'Nurse not found' });
        }

        const nurse = nurses[0];
        const operator = `${nurse.fName} ${nurse.lName}`;

        // Insert record
        await db.execute(
            'INSERT INTO treatmentRecords (clientID, nurseID, date, time, detail) VALUES (?, ?, ?, ?, ?)',
            [req.params.patientId, nurse.nurseID, currentDate, currentTime, content]
        );

        res.json({
            success: true,
            data: {
                patientId: req.params.patientId,
                date: currentDate,
                time: currentTime,
                content,
                operator,
                operatorId: nurse.nurseID
            }
        });
    } catch (error) {
        console.error('Error adding treatment record:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router; 