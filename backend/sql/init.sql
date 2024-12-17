-- 创建数据库
CREATE DATABASE IF NOT EXISTS nursingHouse DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nursingHouse;

-- 创建部门表并插入示例数据
CREATE TABLE IF NOT EXISTS department (
    departmentID VARCHAR(20) NOT NULL,
    name VARCHAR(45) NULL,
    details VARCHAR(60) NULL,
    PRIMARY KEY (departmentID)
) ENGINE = InnoDB;

INSERT INTO department VALUES ('DEPT001', '护理部', '负责日常护理工作');

-- 创建行政人员表并插入示例数据
CREATE TABLE IF NOT EXISTS administrativeStaff (
    staffID VARCHAR(20) NOT NULL,
    fName VARCHAR(45) NULL,
    lName VARCHAR(45) NULL,
    PRIMARY KEY (staffID)
) ENGINE = InnoDB;

INSERT INTO administrativeStaff VALUES ('ADMIN001', '张', '三');

-- 创建邮编城市映射表并插入示例数据
CREATE TABLE IF NOT EXISTS PostCodeCityMapping (
    cityID VARCHAR(20) NOT NULL,
    name VARCHAR(45) NULL,
    postCode VARCHAR(10) NULL,
    PRIMARY KEY (cityID)
) ENGINE = InnoDB;

INSERT INTO PostCodeCityMapping VALUES ('CITY001', '北京', '100000');

-- 创建客户表并插入示例数据
CREATE TABLE IF NOT EXISTS client (
    clientID VARCHAR(20) NOT NULL,
    fName VARCHAR(45) NULL,
    lName VARCHAR(45) NULL,
    cityID VARCHAR(20) NOT NULL,
    address VARCHAR(60) NULL,
    phoneNumber VARCHAR(45) NULL,
    birth DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    allergies VARCHAR(45) NULL,
    healthNotes VARCHAR(100) NULL,
    nursingRequirements VARCHAR(45) NULL,
    room VARCHAR(10) NULL,
    staffID VARCHAR(20) NOT NULL,
    PRIMARY KEY (clientID),
    FOREIGN KEY (staffID) REFERENCES administrativeStaff(staffID),
    FOREIGN KEY (cityID) REFERENCES PostCodeCityMapping(cityID)
) ENGINE = InnoDB;

INSERT INTO client VALUES ('CLIENT001', '李', '四', 'CITY001', '朝阳区', '13800138000', '1950-01-01', 'Male', '花粉过敏', '高血压', '需要定期测量血压', 'A101', 'ADMIN001');

-- 创建监护人表并插入示例数据
CREATE TABLE IF NOT EXISTS guardian (
    guardianID VARCHAR(20) NOT NULL,
    fName VARCHAR(45) NULL,
    lName VARCHAR(45) NULL,
    cityID VARCHAR(20) NOT NULL,
    address VARCHAR(45) NULL,
    telNo VARCHAR(45) NULL,
    wechatNo VARCHAR(45) NULL,
    relation VARCHAR(45) NULL,
    owedAmount INT NULL,
    clientID VARCHAR(20) NOT NULL,
    PRIMARY KEY (guardianID),
    FOREIGN KEY (clientID) REFERENCES client(clientID),
    FOREIGN KEY (cityID) REFERENCES PostCodeCityMapping(cityID)
) ENGINE = InnoDB;

INSERT INTO guardian VALUES ('GUARD001', '李', '小四', 'CITY001', '朝阳区', '13900139000', 'wx123456', '子女', 0, 'CLIENT001');

-- 创建护士表并插入示例数据
CREATE TABLE IF NOT EXISTS nurse (
    nurseID VARCHAR(20) NOT NULL,
    fName VARCHAR(45) NULL,
    lName VARCHAR(45) NULL,
    telNo VARCHAR(45) NULL,
    sTime TIME NULL,
    fTime TIME NULL,
    departmentID VARCHAR(20) NOT NULL,
    PRIMARY KEY (nurseID),
    FOREIGN KEY (departmentID) REFERENCES department(departmentID)
) ENGINE = InnoDB;

INSERT INTO nurse VALUES ('NURSE001', '王', '五', '13700137000', '08:00:00', '17:00:00', 'DEPT001');

-- 创建护工表并插入示例数据
CREATE TABLE IF NOT EXISTS caregiver (
    caregiverID VARCHAR(20) NOT NULL,
    fName VARCHAR(45) NULL,
    lName VARCHAR(45) NULL,
    sTime TIME NULL,
    fTime TIME NULL,
    telNo VARCHAR(20) NULL,
    departmentID VARCHAR(20) NOT NULL,
    PRIMARY KEY (caregiverID),
    FOREIGN KEY (departmentID) REFERENCES department(departmentID)
) ENGINE = InnoDB;

INSERT INTO caregiver VALUES ('CARE001', '赵', '六', '08:00:00', '17:00:00', '13600136000', 'DEPT001');

-- 创建治疗记录表并插入示例数据
CREATE TABLE IF NOT EXISTS treatmentRecords (
    clientID VARCHAR(20) NOT NULL,
    nurseID VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    detail VARCHAR(100) NULL,
    PRIMARY KEY (clientID, nurseID, date, time),
    FOREIGN KEY (clientID) REFERENCES client(clientID),
    FOREIGN KEY (nurseID) REFERENCES nurse(nurseID)
) ENGINE = InnoDB;

INSERT INTO treatmentRecords VALUES ('CLIENT001', 'NURSE001', CURDATE(), CURTIME(), '日常血压检查');

-- 创建护理记录表并插入示例数据
CREATE TABLE IF NOT EXISTS careRecords (
    clientID VARCHAR(20) NOT NULL,
    caregiverID VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    detail VARCHAR(100) NULL,
    PRIMARY KEY (clientID, caregiverID, date, time),
    FOREIGN KEY (clientID) REFERENCES client(clientID),
    FOREIGN KEY (caregiverID) REFERENCES caregiver(caregiverID)
) ENGINE = InnoDB;

INSERT INTO careRecords VALUES ('CLIENT001', 'CARE001', CURDATE(), CURTIME(), '协助晨间洗漱');

-- 创建个人记录表并插入示例数据
CREATE TABLE IF NOT EXISTS personalRecords (
    caregiverID VARCHAR(20) NOT NULL,
    pRecordsID VARCHAR(20) NOT NULL,
    date DATE NULL,
    time TIME NULL,
    detail VARCHAR(100) NULL,
    PRIMARY KEY (caregiverID, pRecordsID),
    FOREIGN KEY (caregiverID) REFERENCES caregiver(caregiverID)
) ENGINE = InnoDB;

INSERT INTO personalRecords VALUES ('CARE001', 'PR001', CURDATE(), CURTIME(), '完成晨间护理工作');

-- 创建日程表并插入示例数据
CREATE TABLE IF NOT EXISTS schedule (
    clientID VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    activity VARCHAR(45) NULL,
    visits VARCHAR(45) NULL,
    PRIMARY KEY (clientID, date),
    FOREIGN KEY (clientID) REFERENCES client(clientID)
) ENGINE = InnoDB;

INSERT INTO schedule VALUES ('CLIENT001', CURDATE(), '晨间运动', '家属探访');

-- 创建用户认证表
CREATE TABLE IF NOT EXISTS user_auth (
    username VARCHAR(50) PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('caregiver', 'nurse', 'admin', 'guardian') NOT NULL,
    staff_id VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE
);

-- 插入示例用户数据（密码为 'password' 的哈希值）
INSERT INTO user_auth (username, password_hash, role, staff_id) VALUES
('admin1', SHA2('password', 256), 'admin', 'ADMIN001'),
('nurse1', SHA2('password', 256), 'nurse', 'NURSE001'),
('caregiver1', SHA2('password', 256), 'caregiver', 'CARE001'); 