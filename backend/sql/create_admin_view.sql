-- 创建管理员可见的员工基本信息视图
DROP VIEW IF EXISTS admin_staff_view;
CREATE VIEW admin_staff_view AS
SELECT 
    'nurse' as staff_type,
    n.nurseID as staff_id,
    n.fName,
    n.lName,
    n.telNo,
    n.sTime as start_time,
    n.fTime as end_time,
    d.name as department
FROM nurse n
JOIN department d ON n.departmentID = d.departmentID
UNION ALL
SELECT 
    'caregiver' as staff_type,
    c.caregiverID as staff_id,
    c.fName,
    c.lName,
    c.telNo,
    c.sTime as start_time,
    c.fTime as end_time,
    d.name as department
FROM caregiver c
JOIN department d ON c.departmentID = d.departmentID;

-- 创建管理员可见的病人基本信息视图
DROP VIEW IF EXISTS admin_client_view;
CREATE VIEW admin_client_view AS
SELECT 
    c.clientID,
    c.fName,
    c.lName,
    c.room,
    c.gender,
    TIMESTAMPDIFF(YEAR, c.birth, CURDATE()) as age,
    pcm.name as city
FROM client c
JOIN PostCodeCityMapping pcm ON c.cityID = pcm.cityID;

-- 创建排班表
CREATE TABLE IF NOT EXISTS staff_schedule (
    scheduleID INT AUTO_INCREMENT PRIMARY KEY,
    staff_id VARCHAR(20) NOT NULL,
    staff_type ENUM('nurse', 'caregiver') NOT NULL,
    work_date DATE NOT NULL,
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_schedule (staff_id, work_date)
);

-- 创建工作统计视图
DROP VIEW IF EXISTS admin_work_stats_view;
CREATE VIEW admin_work_stats_view AS
SELECT 
    DATE(tr.date) as work_date,
    COUNT(DISTINCT tr.nurseID) as active_nurses,
    COUNT(tr.clientID) as treatment_count,
    'treatment' as record_type
FROM treatmentRecords tr
GROUP BY DATE(tr.date)
UNION ALL
SELECT 
    DATE(cr.date) as work_date,
    COUNT(DISTINCT cr.caregiverID) as active_caregivers,
    COUNT(cr.clientID) as care_count,
    'care' as record_type
FROM careRecords cr
GROUP BY DATE(cr.date); 