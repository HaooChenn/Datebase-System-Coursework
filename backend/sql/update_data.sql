-- 更新部门数据
UPDATE department 
SET name = 'Nursing Department', 
    details = 'Responsible for daily nursing care' 
WHERE departmentID = 'DEPT001';

-- 更新行政人员数据
UPDATE administrativeStaff 
SET fName = 'John', 
    lName = 'Smith' 
WHERE staffID = 'ADMIN001';

-- 更新城市数据
UPDATE PostCodeCityMapping 
SET name = 'Beijing', 
    postCode = '100000' 
WHERE cityID = 'CITY001';

-- 更新客户数据
UPDATE client 
SET fName = 'David', 
    lName = 'Wilson', 
    address = 'Chaoyang District', 
    phoneNumber = '13800138000', 
    gender = 'Male', 
    allergies = 'Pollen allergy', 
    healthNotes = 'High blood pressure', 
    nursingRequirements = 'Regular blood pressure monitoring' 
WHERE clientID = 'CLIENT001';

-- 更新监护人数据
UPDATE guardian 
SET fName = 'Mary', 
    lName = 'Wilson', 
    address = 'Chaoyang District', 
    telNo = '13900139000', 
    wechatNo = 'wx123456', 
    relation = 'Daughter' 
WHERE guardianID = 'GUARD001';

-- 更新护士数据
UPDATE nurse 
SET fName = 'Sarah', 
    lName = 'Johnson', 
    telNo = '13700137000' 
WHERE nurseID = 'NURSE001';

-- 更新护工数据
UPDATE caregiver 
SET fName = 'Emily', 
    lName = 'Brown', 
    telNo = '13600136000' 
WHERE caregiverID = 'CARE001';

-- 更新治疗记录数据
UPDATE treatmentRecords 
SET detail = 'Regular blood pressure check' 
WHERE clientID = 'CLIENT001' AND nurseID = 'NURSE001';

-- 更新护理记录数据
UPDATE careRecords 
SET detail = 'Morning care assistance' 
WHERE clientID = 'CLIENT001' AND caregiverID = 'CARE001';

-- 更新个人记录数据
UPDATE personalRecords 
SET detail = 'Completed morning care routine' 
WHERE caregiverID = 'CARE001';

-- 更新日程数据
UPDATE schedule 
SET activity = 'Morning exercise', 
    visits = 'Family visit' 
WHERE clientID = 'CLIENT001'; 