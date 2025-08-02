# Doctor Appointment Booking System

A full-stack web application for booking doctor appointments online. Built with React.js frontend and Node.js/Express.js backend with MongoDB database.

## Features

### For Patients:
- User registration and authentication
- Browse available doctors by specialization
- Book appointments with available time slots
- View appointment history and status
- Cancel pending appointments
- Update profile information

### For Doctors:
- Doctor registration with credentials
- Manage appointment schedule
- View patient appointments
- Update appointment status (confirm, cancel, complete)
- Add notes, prescriptions, and diagnosis
- Update availability status
- Manage profile information

## Tech Stack

### Frontend:
- React.js 19
- React Router DOM
- Bootstrap 5
- Axios for API calls
- Font Awesome icons

### Backend:
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- CORS for cross-origin requests

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Booking
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/doctor-booking
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

5. **Start MongoDB**
   
   Make sure MongoDB is running on your system. If using MongoDB Atlas, update the MONGODB_URI in the .env file.

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on http://localhost:5000

2. **Start the frontend application**
   ```bash
   cd client
   npm start
   ```
   The React app will start on http://localhost:3000

### Production Mode

1. **Build the frontend**
   ```bash
   cd client
   npm run build
   ```

2. **Start the production server**
   ```bash
   cd server
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Doctors
- `GET /api/doctors` - Get all doctors
- `GET /api/doctors/:id` - Get doctor by ID
- `GET /api/doctors/:id/availability` - Get doctor's available time slots
- `PUT /api/doctors/profile` - Update doctor profile
- `GET /api/doctors/appointments` - Get doctor's appointments

### Appointments
- `POST /api/appointments` - Book new appointment
- `GET /api/appointments/my-appointments` - Get patient's appointments
- `GET /api/appointments/:id` - Get appointment by ID
- `PATCH /api/appointments/:id/status` - Update appointment status
- `PUT /api/appointments/:id` - Update appointment details
- `DELETE /api/appointments/:id` - Cancel appointment

## Database Schema

### User Model
- Basic info: name, email, password, role
- Contact: phone, address
- Doctor-specific: specialization, experience, education, license number, availability

### Appointment Model
- Patient and doctor references
- Date and time slot
- Status (pending, confirmed, cancelled, completed)
- Medical info: reason, symptoms, notes, prescription, diagnosis

## Usage Guide

### For Patients:

1. **Register/Login**: Create an account or login with existing credentials
2. **Find Doctors**: Browse available doctors by specialization
3. **Book Appointment**: Select a doctor, choose date and time slot
4. **Manage Appointments**: View, cancel, or track appointment status
5. **Update Profile**: Modify personal information

### For Doctors:

1. **Register**: Create doctor account with credentials and specialization
2. **Set Availability**: Toggle availability status in profile
3. **View Appointments**: Check incoming appointment requests
4. **Manage Appointments**: Confirm, cancel, or complete appointments
5. **Add Medical Notes**: Update appointments with notes, prescriptions, diagnosis

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control
- Input validation and sanitization
- CORS protection

## Future Enhancements

- Email notifications
- SMS reminders
- Video consultations
- Payment integration
- Admin dashboard
- Analytics and reporting
- Mobile app

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository. 