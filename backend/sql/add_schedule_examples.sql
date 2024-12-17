-- 清除现有排班数据
DELETE FROM staff_schedule;

-- 添加护士排班示例
INSERT INTO staff_schedule (staff_id, staff_type, work_date, shift_start, shift_end) VALUES
-- 护士排班
('NURSE001', 'nurse', CURDATE(), '08:00:00', '16:00:00'),
('NURSE002', 'nurse', CURDATE(), '16:00:00', '00:00:00'),
('NURSE003', 'nurse', CURDATE(), '00:00:00', '08:00:00'),

('NURSE001', 'nurse', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:00:00', '00:00:00'),
('NURSE002', 'nurse', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '00:00:00', '08:00:00'),
('NURSE003', 'nurse', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '16:00:00'),

-- 护工排班
('CARE001', 'caregiver', CURDATE(), '08:00:00', '16:00:00'),
('CARE002', 'caregiver', CURDATE(), '16:00:00', '00:00:00'),
('CARE003', 'caregiver', CURDATE(), '00:00:00', '08:00:00'),

('CARE001', 'caregiver', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '16:00:00', '00:00:00'),
('CARE002', 'caregiver', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '00:00:00', '08:00:00'),
('CARE003', 'caregiver', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '08:00:00', '16:00:00');

-- 添加更多员工数据（如果不存在）
INSERT IGNORE INTO nurse (nurseID, fName, lName, telNo, sTime, fTime, departmentID) VALUES
('NURSE002', 'Emma', 'Davis', '13711111111', '08:00:00', '17:00:00', 'DEPT001'),
('NURSE003', 'Michael', 'Wilson', '13722222222', '09:00:00', '18:00:00', 'DEPT001');

INSERT IGNORE INTO caregiver (caregiverID, fName, lName, telNo, sTime, fTime, departmentID) VALUES
('CARE002', 'James', 'Brown', '13733333333', '07:00:00', '16:00:00', 'DEPT001'),
('CARE003', 'Linda', 'Taylor', '13744444444', '10:00:00', '19:00:00', 'DEPT001');

-- 添加用户认证（如果不存在）
INSERT IGNORE INTO user_auth (username, password_hash, role, staff_id, is_active) VALUES
('nurse2', SHA2('nurse123', 256), 'nurse', 'NURSE002', true),
('nurse3', SHA2('nurse123', 256), 'nurse', 'NURSE003', true),
('care2', SHA2('care123', 256), 'caregiver', 'CARE002', true),
('care3', SHA2('care123', 256), 'caregiver', 'CARE003', true);

-- 添加病人分配（如果不存在）
INSERT IGNORE INTO client_caregiver_assignment (clientID, caregiverID, assignDate) VALUES
('CLIENT001', 'CARE002', CURDATE()),
('CLIENT002', 'CARE002', CURDATE()),
('CLIENT001', 'CARE003', CURDATE()),
('CLIENT002', 'CARE003', CURDATE()); 