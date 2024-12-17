-- 更新护士可见的病人基本信息视图
DROP VIEW IF EXISTS nurse_patient_view;
CREATE VIEW nurse_patient_view AS
SELECT 
    c.clientID,
    c.fName,
    c.lName,
    c.gender,
    c.birth,
    c.room,
    c.nursingRequirements,
    c.allergies,
    c.healthNotes
FROM client c; 