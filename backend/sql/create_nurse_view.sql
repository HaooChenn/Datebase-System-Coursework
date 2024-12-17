-- 创建护士可见的病人基本信息视图
CREATE OR REPLACE VIEW nurse_patient_view AS
SELECT 
    c.clientID,
    CONCAT(c.fName, ' ', c.lName) as name,
    c.gender,
    c.birth,
    c.room,
    c.nursingRequirements,
    c.allergies,
    c.healthNotes
FROM client c;

-- 授予护士角色对视图的访问权限
GRANT SELECT ON nursingHouse.nurse_patient_view TO 'nurse_role'; 