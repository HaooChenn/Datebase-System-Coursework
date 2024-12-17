# Nursing House Management System

## Project Overview

This is a comprehensive management system specifically designed for family-style nursing homes, utilizing modern database technology to transition from traditional paper records to digital management. The system implements strict data access control through MySQL views and stored procedures, ensuring efficient operation and information security.

## System Features

- 🔐 Multi-level permission management based on MySQL views
- 📊 Complete database transaction processing mechanism
- 🏥 Professional medical care record tracking
- 👥 Personnel allocation management based on stored procedures
- 📱 Responsive interface design
- 🛡️ Data minimization principle implementation

## Technical Architecture

### Frontend Stack
- Vue 3.3.10
- Element Plus 2.4.3
- Vue Router 4.2.5
- Axios 1.6.2
- Vite 5.0.5

### Backend Stack
- Node.js v22.11.0
- Express.js
- MySQL 8.0
- JWT Authentication
- CORS Security Configuration

### Database Design Features
- Data access control through MySQL views
- Complex business logic handling via stored procedures
- Data integrity ensured by triggers
- Transaction management for data consistency

## Role-Based Access Control

The system implements multi-level permission control based on MySQL, with each role accessing data through specific views:

### 1. Caregivers
```sql
CREATE VIEW caregiver_view AS
SELECT care_records.*, basic_info 
FROM care_records 
JOIN resident_info 
WHERE assigned_caregiver_id = CURRENT_USER();
```
- Access to basic information of assigned residents only
- Permission to record daily care activities

### 2. Nurses
```sql
CREATE VIEW nurse_view AS
SELECT medical_records.*, vital_signs
FROM medical_records 
JOIN health_records
WHERE authorized_nurse_id = CURRENT_USER();
```
- Access to specific medical record views
- Management of prescriptions and treatment plans

### 3. Administrative Staff
```sql
CREATE VIEW admin_view AS
SELECT non_medical_info.*
FROM resident_info
WHERE is_active = 1;
```
- Access to non-sensitive information management views
- Personnel scheduling permissions

### 4. Guardians
```sql
CREATE VIEW guardian_view AS
SELECT basic_care_info, payment_records
FROM resident_info
WHERE guardian_id = CURRENT_USER();
```
- Access to ward's basic information
- Access to payment records

### 5. Database Administrator
- Complete database management permissions
- User permission assignment
- System maintenance authority

## Core Function Implementation

### 1. Data Access Control
```sql
-- Example: Caregiver data access stored procedure
DELIMITER //
CREATE PROCEDURE get_care_records(IN caregiver_id INT)
BEGIN
    SELECT * FROM care_records 
    WHERE assigned_caregiver = caregiver_id
    AND record_date >= CURDATE() - INTERVAL 30 DAY;
END //
DELIMITER ;
```

### 2. User Authentication System
- JWT-based token authentication
- Encrypted MySQL user table storage
- Password hashing
```sql
CREATE TABLE users (
    id INT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    password_hash VARCHAR(255),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
```

### 3. Data Minimization Implementation
```sql
-- Example: Guardian information filtering view
CREATE VIEW guardian_minimal_info AS
SELECT 
    resident_id,
    name,
    room_number,
    basic_health_status
FROM resident_info
WHERE guardian_access = TRUE;
```

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   └── app.js       # Main application file
│   ├── sql/            # SQL scripts and stored procedures
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/        # API integration
    │   ├── components/ # Reusable components
    │   ├── views/      # Page components
    │   ├── router/     # Vue router configuration
    │   ├── App.vue     # Root component
    │   └── main.js     # Entry file
    └── package.json
```

## Security Features

- Fine-grained MySQL user permission control
- View layer data filtering
- Stored procedure parameter validation
- SQL injection protection
- XSS attack protection
- CORS security configuration

## System Requirements

- Node.js >= 16.20.0
- MySQL >= 8.0
- npm >= 8.19.4
- Modern browsers (Chrome, Firefox, Safari, Edge)

## Deployment Guide

1. Database Initialization
```bash
mysql -u root -p < sql/init.sql
mysql -u root -p < sql/procedures.sql
mysql -u root -p < sql/views.sql
```

2. Backend Configuration
```bash
cd backend
npm install
# Configure .env file
npm run start
```

3. Frontend Deployment
```bash
cd frontend
npm install
npm run build
```

## License

This project is licensed under the MIT License