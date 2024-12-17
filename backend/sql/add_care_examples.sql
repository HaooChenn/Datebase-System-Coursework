-- 添加更多护理记录示例
INSERT INTO careRecords (clientID, caregiverID, date, time, detail, type, status) VALUES
-- 日常护理记录
('CLIENT001', 'CARE001', CURDATE(), '07:30:00', '完成晨间洗漱，协助更衣', '日常护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '08:15:00', '协助进食早餐，服用早间药物', '用药护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '10:30:00', '陪同进行晨间散步，状态良好', '康复护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '12:00:00', '协助午餐进食，进食量正常', '日常护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '14:30:00', '下午休息，翻身拍背', '康复护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '16:00:00', '协助上厕所，记录排泄情况', '日常护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '18:00:00', '协助晚餐进食，服用晚间药物', '用药护理', '已完成'),
('CLIENT001', 'CARE001', CURDATE(), '20:00:00', '协助洗漱，准备就寝', '日常护理', '已完成'),

-- 特殊护理记录
('CLIENT001', 'CARE001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', '测量血压：收缩压130/舒张压85，状态稳定', '健康监测', '已完成'),
('CLIENT001', 'CARE001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '15:00:00', '协助做康复运动，完成下肢活动', '康复护理', '已完成'),
('CLIENT001', 'CARE001', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '19:00:00', '记录今日饮水量：1500ml', '健康监测', '已完成'),

-- CLIENT002的护理记录
('CLIENT002', 'CARE001', CURDATE(), '07:45:00', '完成晨间洗漱，血糖测量：6.2mmol/L', '健康监测', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '08:30:00', '协助进食早餐，注射胰岛素', '用药护理', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '11:00:00', '陪同进行康复训练', '康复护理', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '12:30:00', '午餐前血糖：7.1mmol/L，协助进食', '健康监测', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '15:30:00', '下午茶点心，注意控制糖分', '日常护理', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '18:30:00', '晚餐前血糖：6.8mmol/L，协助进食', '健康监测', '已完成'),
('CLIENT002', 'CARE001', CURDATE(), '21:00:00', '睡前血糖：6.5mmol/L，记录全天情况', '健康监测', '已完成'); 