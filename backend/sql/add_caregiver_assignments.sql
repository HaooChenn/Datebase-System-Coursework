-- 创建护工-病人分配表
CREATE TABLE IF NOT EXISTS client_caregiver_assignment (
    clientID VARCHAR(20) NOT NULL,
    caregiverID VARCHAR(20) NOT NULL,
    assignDate DATE NOT NULL,
    PRIMARY KEY (clientID, caregiverID),
    FOREIGN KEY (clientID) REFERENCES client(clientID),
    FOREIGN KEY (caregiverID) REFERENCES caregiver(caregiverID)
);

-- 添加分配关系
INSERT INTO client_caregiver_assignment (clientID, caregiverID, assignDate) VALUES
('CLIENT001', 'CARE001', CURDATE()),
('CLIENT002', 'CARE001', CURDATE()); 