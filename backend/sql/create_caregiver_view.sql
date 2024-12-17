-- 创建护工可见的病人基本信息视图
DROP VIEW IF EXISTS caregiver_patient_view;
CREATE VIEW caregiver_patient_view AS
SELECT 
    c.clientID,
    c.fName,
    c.lName,
    c.gender,
    c.birth,
    c.room,
    c.nursingRequirements as careReq,
    c.allergies,
    c.healthNotes as specialNotes,
    cca.caregiverID
FROM client c
INNER JOIN client_caregiver_assignment cca ON c.clientID = cca.clientID;

-- 创建护工的护理记录视图
DROP VIEW IF EXISTS caregiver_care_records_view;
CREATE VIEW caregiver_care_records_view AS
SELECT 
    cr.recordID,
    cr.clientID,
    cr.caregiverID,
    cr.date,
    cr.time,
    cr.detail as content,
    cr.type,
    cr.status,
    CONCAT(cg.fName, ' ', cg.lName) as operator
FROM careRecords cr
JOIN caregiver cg ON cr.caregiverID = cg.caregiverID; 