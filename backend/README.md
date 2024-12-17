# Nursing Home Management System

A comprehensive nursing home management system built with Node.js (Express) backend and Vue.js frontend.

## Project Overview

This system provides a complete solution for nursing home management, supporting three main roles:
- Nurses
- Caregivers
- Administrators

### Key Features
- Role-based access control
- Patient management
- Treatment records
- Care records
- Staff scheduling
- Work statistics
- Real-time monitoring

## Technology Stack

### Backend
- Node.js v22.11.0
- Express.js
- MySQL
- JWT Authentication
- CORS enabled

### Frontend
- Vue 3.3.10
- Element Plus 2.4.3
- Vue Router 4.2.5
- Axios 1.6.2
- Vite 5.0.5

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── middleware/  # Express middleware
│   │   ├── routes/      # API routes
│   │   └── app.js       # Main application file
│   ├── sql/            # SQL scripts
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/        # API integration
    │   ├── components/ # Reusable components
    │   ├── layouts/    # Layout components
    │   ├── views/      # Page components
    │   ├── router/     # Vue Router config
    │   ├── App.vue     # Root component
    │   └── main.js     # Entry point
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js >= 16.20.0
- npm >= 8.19.4
- MySQL >= 8.0

### Backend Setup
1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
# .env
DB_HOST=your_db_host
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=nursingHouse
JWT_SECRET=your_jwt_secret
PORT=3000
```

3. Initialize database:
```bash
mysql -u root -p < sql/init.sql
```

4. Start the server:
```bash
npm start
```

### Frontend Setup
1. Install dependencies:
```bash
cd frontend
npm install
```

2. Configure environment variables:
```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm run dev
```

## API Documentation

### Authentication
- POST /api/auth/login
- POST /api/auth/logout

### Nurse Endpoints
- GET /api/nurse/patients
- GET /api/nurse/patients/:id
- GET /api/nurse/patients/:id/tasks
- POST /api/nurse/patients/:id/tasks

### Caregiver Endpoints
- GET /api/caregiver/patients
- GET /api/caregiver/patients/:id
- GET /api/caregiver/patients/:id/care-records
- POST /api/caregiver/patients/:id/care-records

### Admin Endpoints
- GET /api/admin/staff
- GET /api/admin/schedule
- POST /api/admin/schedule
- GET /api/admin/stats
- GET /api/admin/clients

## Test Accounts

```json
{
    "admin": {
        "username": "admin1",
        "password": "admin123"
    },
    "nurse": {
        "username": "nurse1",
        "password": "nurse123"
    },
    "caregiver": {
        "username": "caregiver1",
        "password": "care123"
    }
}
```

## Development

### Backend Development
- Uses nodemon for hot reloading
- Includes comprehensive error handling
- Implements CORS security
- Features detailed request logging

### Frontend Development
- Vue 3 Composition API
- Element Plus UI components
- Axios for API integration
- Vue Router for navigation
- Vite for fast development

## Security Features
- JWT-based authentication
- Password hashing
- Role-based access control
- SQL injection prevention
- CORS protection

## Database Schema
- Includes tables for:
  - Patients/Clients
  - Staff (Nurses & Caregivers)
  - Treatment Records
  - Care Records
  - Schedules
  - Departments
  - User Authentication

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License
This project is licensed under the MIT License.

## Contact
For any queries, please open an issue in the GitHub repository. 