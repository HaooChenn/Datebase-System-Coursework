const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const db = require('../config/database');

/**
 * 获取所有员工信息
 * GET /api/admin/staff
 */
router.get('/staff', auth, checkRole(['admin']), async (req, res) => {
    try {
        const [staff] = await db.execute('SELECT * FROM admin_staff_view');
        
        res.json({
            success: true,
            data: staff.map(s => ({
                id: s.staff_id,
                type: s.staff_type,
                name: `${s.fName} ${s.lName}`,
                phone: s.telNo,
                department: s.department,
                workHours: {
                    start: s.start_time,
                    end: s.end_time
                }
            }))
        });
    } catch (error) {
        console.error('Error getting staff list:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 获取排班表
 * GET /api/admin/schedule
 */
router.get('/schedule', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT s.*, CONCAT(asv.fName, " ", asv.lName) as staff_name FROM staff_schedule s ' +
                   'JOIN admin_staff_view asv ON s.staff_id = asv.staff_id';
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE work_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY work_date, shift_start';

        const [schedules] = await db.execute(query, params);
        
        res.json({
            success: true,
            data: schedules.map(s => ({
                id: s.scheduleID,
                staffId: s.staff_id,
                staffName: s.staff_name,
                staffType: s.staff_type,
                date: s.work_date,
                shift: {
                    start: s.shift_start,
                    end: s.shift_end
                }
            }))
        });
    } catch (error) {
        console.error('Error getting schedule:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 添加排班
 * POST /api/admin/schedule
 */
router.post('/schedule', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { staffId, staffType, workDate, shiftStart, shiftEnd } = req.body;

        if (!staffId || !staffType || !workDate || !shiftStart || !shiftEnd) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        // 检查员工是否存在
        const [staff] = await db.execute(
            'SELECT * FROM admin_staff_view WHERE staff_id = ? AND staff_type = ?',
            [staffId, staffType]
        );

        if (staff.length === 0) {
            return res.status(404).json({ success: false, error: 'Staff not found' });
        }

        await db.execute(
            'INSERT INTO staff_schedule (staff_id, staff_type, work_date, shift_start, shift_end) VALUES (?, ?, ?, ?, ?)',
            [staffId, staffType, workDate, shiftStart, shiftEnd]
        );

        res.json({
            success: true,
            message: '排班添加成功'
        });
    } catch (error) {
        console.error('Error adding schedule:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 修改排班
 * PUT /api/admin/schedule/:scheduleId
 */
router.put('/schedule/:scheduleId', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { shiftStart, shiftEnd } = req.body;

        if (!shiftStart || !shiftEnd) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        await db.execute(
            'UPDATE staff_schedule SET shift_start = ?, shift_end = ? WHERE scheduleID = ?',
            [shiftStart, shiftEnd, req.params.scheduleId]
        );

        res.json({
            success: true,
            message: '排班修改成功'
        });
    } catch (error) {
        console.error('Error updating schedule:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 删除排班
 * DELETE /api/admin/schedule/:scheduleId
 */
router.delete('/schedule/:scheduleId', auth, checkRole(['admin']), async (req, res) => {
    try {
        await db.execute('DELETE FROM staff_schedule WHERE scheduleID = ?', [req.params.scheduleId]);
        
        res.json({
            success: true,
            message: '排班删除成功'
        });
    } catch (error) {
        console.error('Error deleting schedule:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 获取工作统计
 * GET /api/admin/stats
 */
router.get('/stats', auth, checkRole(['admin']), async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = 'SELECT * FROM admin_work_stats_view';
        const params = [];

        if (startDate && endDate) {
            query += ' WHERE work_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY work_date';

        const [stats] = await db.execute(query, params);
        
        // 按日期分组统计数据
        const statsMap = stats.reduce((acc, curr) => {
            const date = curr.work_date;
            if (!acc[date]) {
                acc[date] = {
                    date,
                    activeNurses: 0,
                    activeCaregivers: 0,
                    treatmentCount: 0,
                    careCount: 0
                };
            }
            
            if (curr.record_type === 'treatment') {
                acc[date].activeNurses = curr.active_nurses;
                acc[date].treatmentCount = curr.treatment_count;
            } else {
                acc[date].activeCaregivers = curr.active_caregivers;
                acc[date].careCount = curr.care_count;
            }
            
            return acc;
        }, {});

        res.json({
            success: true,
            data: Object.values(statsMap)
        });
    } catch (error) {
        console.error('Error getting stats:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

/**
 * 获取病人基本信息
 * GET /api/admin/clients
 */
router.get('/clients', auth, checkRole(['admin']), async (req, res) => {
    try {
        const [clients] = await db.execute('SELECT * FROM admin_client_view');
        
        res.json({
            success: true,
            data: clients.map(c => ({
                id: c.clientID,
                name: `${c.fName} ${c.lName}`,
                room: c.room,
                gender: c.gender,
                age: c.age,
                city: c.city
            }))
        });
    } catch (error) {
        console.error('Error getting client list:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router; 