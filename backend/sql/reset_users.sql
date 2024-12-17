-- 删除现有的用户认证数据
DELETE FROM user_auth;

-- 重新插入用户数据
INSERT INTO user_auth (username, password_hash, role, staff_id, is_active) VALUES
('nurse1', SHA2('nurse123', 256), 'nurse', 'NURSE001', true),
('admin1', SHA2('admin123', 256), 'admin', 'ADMIN001', true),
('caregiver1', SHA2('care123', 256), 'caregiver', 'CARE001', true); 