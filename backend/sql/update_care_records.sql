-- 修改careRecords表结构
ALTER TABLE careRecords
ADD COLUMN recordID INT AUTO_INCREMENT PRIMARY KEY FIRST,
ADD COLUMN type VARCHAR(50) DEFAULT '日常护理',
ADD COLUMN status VARCHAR(20) DEFAULT '已完成',
MODIFY COLUMN detail TEXT,
DROP PRIMARY KEY,
ADD UNIQUE KEY unique_care_record (clientID, caregiverID, date, time);

-- 更新现有记录
UPDATE careRecords SET type = '日常护理', status = '已完成' WHERE type IS NULL; 