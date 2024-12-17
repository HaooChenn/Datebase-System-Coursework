-- 添加第二个病人数据
INSERT INTO client (
    clientID, fName, lName, cityID, address, 
    phoneNumber, birth, gender, allergies, 
    healthNotes, nursingRequirements, room, staffID
) VALUES (
    'CLIENT002', 'Emma', 'Thompson', 'CITY001', 'Chaoyang District',
    '13811138111', '1945-05-15', 'Female', 'Penicillin allergy',
    'Diabetes Type 2', 'Regular blood sugar monitoring', 'A102', 'ADMIN001'
);

-- 添加监护人数据
INSERT INTO guardian (
    guardianID, fName, lName, cityID, address,
    telNo, wechatNo, relation, owedAmount, clientID
) VALUES (
    'GUARD002', 'James', 'Thompson', 'CITY001', 'Chaoyang District',
    '13922239222', 'wx789012', 'Son', 0, 'CLIENT002'
);

-- 添加治疗记录
INSERT INTO treatmentRecords (
    clientID, nurseID, date, time, detail
) VALUES 
('CLIENT002', 'NURSE001', CURDATE(), '09:00:00', 'Blood sugar level check: 6.2 mmol/L'),
('CLIENT002', 'NURSE001', CURDATE(), '12:00:00', 'Insulin injection administered');

-- 添加护理记录
INSERT INTO careRecords (
    clientID, caregiverID, date, time, detail
) VALUES 
('CLIENT002', 'CARE001', CURDATE(), '07:30:00', 'Morning care and medication assistance');

-- 添加日程安排
INSERT INTO schedule (
    clientID, date, activity, visits
) VALUES 
('CLIENT002', CURDATE(), 'Diabetes management class', 'Family visit scheduled'); 