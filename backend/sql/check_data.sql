-- 查看部门数据
SELECT * FROM department;

-- 查看行政人员数据
SELECT * FROM administrativeStaff;

-- 查看城市数据
SELECT * FROM PostCodeCityMapping;

-- 查看客户（病人）数据
SELECT * FROM client;

-- 查看监护人数据
SELECT * FROM guardian;

-- 查看护士数据
SELECT * FROM nurse;

-- 查看护工数据
SELECT * FROM caregiver;

-- 查看治疗记录数据
SELECT * FROM treatmentRecords;

-- 查看护理记录数据
SELECT * FROM careRecords;

-- 查看个人记录数据
SELECT * FROM personalRecords;

-- 查看日程数据
SELECT * FROM schedule;

-- 查看用户认证数据
SELECT username, role, staff_id, is_active FROM user_auth; 