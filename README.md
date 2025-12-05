# 🏟️ Turf-Ease: AI-Powered Sports Facility Booking Platform

A comprehensive full-stack web application for booking sports facilities (turfs/courts) with advanced features including user authentication, admin dashboard, analytics, and real-time notifications.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Key Features Explained](#key-features-explained)
- [Security Features](#security-features)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Project Overview

**Turf-Ease** is a modern, AI-integrated platform designed to streamline the booking of sports facilities. Users can discover available turfs, make bookings, manage reservations, and owners can manage their properties with advanced analytics. The application includes role-based access control for Users, Owners, and Administrators.

### Key Use Cases:
- **Bookers**: Browse and book available sports facilities
- **Owners**: List, manage, and monitor their sports facilities and bookings
- **Admins**: Monitor platform activities, manage users, and view analytics

---

## ✨ Features

### For Bookers
- 🔍 Browse and filter available sports facilities
- 📅 Real-time availability checking and booking
- 💳 Secure booking management
- 📝 View booking history and details
- ⭐ Write and view reviews
- 🔔 Real-time booking notifications
- 👤 Comprehensive user profile management

### For Owners
- 🏢 Add and manage multiple sports facilities
- 📊 Advanced analytics and booking statistics
- 📈 Revenue tracking and reporting
- ⏰ Availability management and scheduling
- 📱 Booking notifications and alerts
- 🎯 Customer review management

### For Administrators
- 👥 User management and role assignment
- 📊 Platform-wide analytics and reporting
- ⚙️ System configuration and monitoring
- 🚨 Error and activity logging
- 📋 Facility and booking oversight

### General Features
- 🔐 Secure user authentication with JWT
- 🎭 Role-based access control (RBAC)
- 📧 Email notifications (Nodemailer)
- 🖼️ Cloud image storage (Cloudinary)
- 🔒 Password encryption with bcryptjs
- ⚡ Rate limiting and security middleware
- 🌐 CORS support
- 💾 MongoDB Atlas integration

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (v18.0.0+)
- **Framework**: Express.js 4.18.2
- **Database**: MongoDB (Mongoose 8.0.3)
- **Authentication**: JWT (jsonwebtoken 9.0.2)
- **File Upload**: Multer 1.4.5 + Cloudinary
- **Email**: Nodemailer 6.9.7
- **Security**: 
  - Helmet 7.1.0 (HTTP headers)
  - bcryptjs 2.4.3 (password hashing)
  - express-rate-limit 7.1.5
  - express-validator 7.0.1
- **Utilities**: 
  - CORS 2.8.5
  - Compression 1.7.4
  - Morgan 1.10.0 (logging)
  - Dotenv 16.3.1

### Frontend
- **Library**: React 19.1.0
- **Build Tool**: Vite 7.0.4
- **Routing**: React Router DOM 7.7.0
- **HTTP Client**: Axios 1.13.2
- **Notifications**: React Toastify 11.0.5
- **Styling**: CSS3 (custom stylesheets)
- **Testing**: Vitest 4.0.9
- **Linting**: ESLint 9.30.1

### Database
- **MongoDB Atlas**: Cloud-hosted MongoDB
- Connection pooling and retry logic
- Automated backups and scaling

---

## 📁 Project Structure

```
Turf-Ease/
├── BackEnd/
│   ├── config/
│   │   └── database.js              # MongoDB connection configuration
│   ├── controllers/                 # Business logic for routes
│   │   ├── authController.js        # Authentication logic
│   │   ├── bookingController.js     # Booking operations
│   │   ├── notificationController.js# Notification handling
│   │   ├── turfController.js        # Turf/facility operations
│   │   └── userController.js        # User operations
│   ├── middleware/                  # Express middleware
│   │   ├── auth.js                  # JWT verification
│   │   ├── dbHealthCheck.js         # Database health monitoring
│   │   ├── errorHandler.js          # Global error handling
│   │   ├── upload.js                # File upload configuration
│   │   └── validate.js              # Input validation
│   ├── models/                      # Mongoose schemas
│   │   ├── Booking.js               # Booking schema
│   │   ├── Notification.js          # Notification schema
│   │   ├── Review.js                # Review schema
│   │   ├── Turf.js                  # Facility schema
│   │   └── User.js                  # User schema
│   ├── routes/                      # API route definitions
│   │   ├── auth.js                  # Authentication routes
│   │   ├── bookings.js              # Booking routes
│   │   ├── notifications.js         # Notification routes
│   │   ├── turfs.js                 # Facility routes
│   │   └── users.js                 # User routes
│   ├── utils/                       # Utility functions
│   │   ├── cloudinary.js            # Cloudinary integration
│   │   ├── dbErrorHandler.js        # Database error handling
│   │   └── email.js                 # Email sending utility
│   ├── scripts/                     # Utility scripts
│   │   ├── seedDatabase.js          # Database seeding
│   │   ├── testModels.js            # Model testing
│   │   ├── testRoleSwitching.js     # Role switching tests
│   │   └── verify-turf-images.js    # Image verification
│   ├── server.js                    # Express app entry point
│   ├── package.json                 # Backend dependencies
│   └── .env.example                 # Environment variables template
│
├── FrontEnd/
│   ├── src/
│   │   ├── components/              # Reusable React components
│   │   │   ├── BlogCard.jsx         # Blog card component
│   │   │   ├── BlogSection.jsx      # Blog section
│   │   │   ├── ErrorBoundary.jsx    # Error boundary
│   │   │   ├── Footer.jsx           # Footer component
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── ProtectedRoute.jsx   # Route protection wrapper
│   │   │   ├── TurfCard.jsx         # Facility card
│   │   │   ├── TurfGrid.jsx         # Facility grid layout
│   │   │   └── [other components]
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx             # Landing page
│   │   │   ├── Login.jsx            # Login page
│   │   │   ├── SignupSelection.jsx  # Signup role selection
│   │   │   ├── SignupBooker.jsx     # Booker signup
│   │   │   ├── SignupOwner.jsx      # Owner signup
│   │   │   ├── SignupAdmin.jsx      # Admin signup
│   │   │   ├── Dashboard.jsx        # User dashboard
│   │   │   ├── AdminDashboard.jsx   # Admin panel
│   │   │   ├── OwnerDashboard.jsx   # Owner dashboard
│   │   │   ├── BookTurf.jsx         # Booking interface
│   │   │   ├── ManageBookings.jsx   # Booking management
│   │   │   ├── Analytics.jsx        # Analytics page
│   │   │   ├── AvailableTurfs.jsx   # Facility browsing
│   │   │   └── [other pages]
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # Global authentication context
│   │   ├── services/
│   │   │   └── api.js               # API client configuration
│   │   ├── utils/
│   │   │   ├── toast.js             # Toast notifications
│   │   │   ├── tokenStorage.js      # Token management
│   │   │   └── turfDataMapper.js    # Data transformation
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React entry point
│   │   └── [CSS files]
│   ├── index.html                   # HTML template
│   ├── vite.config.js               # Vite configuration
│   ├── eslint.config.js             # ESLint configuration
│   ├── package.json                 # Frontend dependencies
│   └── .env.example                 # Environment variables template
│
└── README.md                        # This file
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** v18.0.0 or higher
- **npm** or **yarn** package manager
- **MongoDB Atlas** account (or local MongoDB)
- **Cloudinary** account for image hosting
- **Gmail** account (for email notifications)

### Step 1: Clone the Repository
```bash
git clone https://github.com/Ayas300/Turf-Ease.git
cd Turf-Ease
```

### Step 2: Backend Setup
```bash
cd BackEnd

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### Step 3: Frontend Setup
```bash
cd ../FrontEnd

# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Configuration

#### 1. **Database Connection** (`config/database.js`)
- MongoDB Atlas connection with retry logic
- Connection pooling: 5-50 connections
- Auto-reconnection enabled
- Health check monitoring

#### 2. **Security Configuration** (`middleware/`)
- **Auth Middleware**: JWT token validation
- **Error Handler**: Centralized error management
- **Upload Middleware**: File upload with Multer
- **Validation Middleware**: Input validation with express-validator
- **Rate Limiting**: Protection against brute force attacks

#### 3. **CORS Configuration**
- Configured for development and production
- Supports multiple frontend URLs

---

## 🏃 Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd BackEnd
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd FrontEnd
npm run dev
```

### Production Mode

**Backend:**
```bash
cd BackEnd
npm start
```

**Frontend:**
```bash
cd FrontEnd
npm run build
npm run preview
```

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Turf/Facility Endpoints
- `GET /api/turfs` - Get all facilities
- `GET /api/turfs/:id` - Get facility details
- `POST /api/turfs` - Create new facility (Owner only)
- `PUT /api/turfs/:id` - Update facility (Owner only)
- `DELETE /api/turfs/:id` - Delete facility (Owner only)

### Booking Endpoints
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### User Endpoints
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users/assign-role` - Assign role (Admin only)

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id` - Mark as read
- `DELETE /api/notifications/:id` - Delete notification

---

## 💾 Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String (required),
  role: Enum['user', 'owner', 'admin'] (default: 'user'),
  avatar: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Turf Schema
```javascript
{
  name: String,
  description: String,
  location: String,
  pricePerHour: Number,
  images: [String] (Cloudinary URLs),
  owner: ObjectId (User reference),
  facilities: [String],
  availability: {
    monday: Boolean,
    tuesday: Boolean,
    // ...
  },
  avgRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Schema
```javascript
{
  turf: ObjectId (Turf reference),
  user: ObjectId (User reference),
  startTime: Date,
  endTime: Date,
  totalPrice: Number,
  status: Enum['pending', 'confirmed', 'cancelled'],
  paymentStatus: Enum['unpaid', 'paid'],
  createdAt: Date,
  updatedAt: Date
}
```

### Notification Schema
```javascript
{
  user: ObjectId (User reference),
  title: String,
  message: String,
  type: String,
  read: Boolean,
  createdAt: Date
}
```

### Review Schema
```javascript
{
  turf: ObjectId (Turf reference),
  user: ObjectId (User reference),
  rating: Number (1-5),
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Environment Variables

### Backend (.env)
```dotenv
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:5173

# Database - MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
DB_NAME=turfease_production

# JWT Configuration
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRE=30d

# Email Configuration (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend (.env)
```dotenv
# Backend API URL
VITE_API_URL=http://localhost:5000/api
```

---

## 📜 Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm test           # Run tests with Jest
npm run lint       # Lint code with ESLint
npm run seed       # Seed database with sample data
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Lint code with ESLint
npm test           # Run tests with Vitest
npm run test:watch # Run tests in watch mode
```

---

## 🔍 Key Features Explained

### 1. **Role-Based Access Control (RBAC)**
- **User/Booker**: Can browse and book facilities
- **Owner**: Can manage facilities and view analytics
- **Admin**: Full platform access and monitoring

### 2. **JWT Authentication**
- Secure token-based authentication
- Access and refresh tokens
- Token expiration and renewal

### 3. **Real-Time Notifications**
- Booking confirmations
- Cancellation alerts
- Review notifications
- Email notifications via Nodemailer

### 4. **File Upload & Storage**
- Image upload via Multer
- Cloud storage with Cloudinary
- Automatic image optimization

### 5. **Advanced Analytics**
- Booking statistics
- Revenue tracking
- User engagement metrics
- Availability analysis

---

## 🔒 Security Features

1. **Password Hashing**: bcryptjs with salt rounds
2. **JWT Tokens**: Secure authentication mechanism
3. **Rate Limiting**: Prevents brute force attacks
4. **CORS**: Configured for specific origins
5. **Helmet**: HTTP header security
6. **Input Validation**: express-validator
7. **Error Handling**: Centralized error management
8. **Database**: MongoDB connection encryption
9. **Environment Variables**: Sensitive data protection

---

## 🌐 Deployment

### Backend Deployment (Heroku/Railway)
1. Create account on Heroku or Railway
2. Connect GitHub repository
3. Set environment variables in platform settings
4. Deploy from main branch

### Frontend Deployment (Vercel/Netlify)
1. Build the project: `npm run build`
2. Push to GitHub
3. Connect to Vercel/Netlify
4. Set environment variables
5. Auto-deploy on push

### Database
- Use MongoDB Atlas for cloud database
- Configure connection string in environment variables
- Enable network access for deployment servers

---

## 👥 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m 'Add AmazingFeature'`
4. Push to branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

### Code Standards
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features
- Keep functions small and focused

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🤝 Support & Contact

For support, feature requests, or bug reports:
- 📧 Email: support@turfease.com
- 🐛 GitHub Issues: [Create an Issue](https://github.com/Ayas300/Turf-Ease/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Ayas300/Turf-Ease/discussions)

---

## 🙏 Acknowledgments

- MongoDB & Mongoose for database solutions
- Cloudinary for image hosting
- React team for the excellent library
- Express.js community
- All contributors and users

---

**Last Updated**: December 5, 2025  
**Version**: 1.0.0  
**Repository**: [Turf-Ease](https://github.com/Ayas300/Turf-Ease)

---

*Built with ❤️ by the Turf-Ease Team*
