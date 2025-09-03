# 🚀 My-BRAND Backend API

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v21.7.3-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Latest-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://www.mongodb.com/)
[![Express.js](https://img.shields.io/badge/Express.js-Framework-black.svg)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*A robust and scalable REST API backend powering a modern portfolio website*

[🔗 Live Demo](http://localhost:6090) • [📖 Documentation](http://localhost:6090/docs) • [🐛 Report Bug](mailto:niyokwizerwajeanpaulelisa@gmail.com) • [✨ Request Feature](mailto:niyokwizerwajeanpaulelisa@gmail.com)

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Database Seeding](#-database-seeding)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🎯 Overview

My-BRAND Backend API is a comprehensive REST API built with Node.js, Express, TypeScript, and MongoDB. It serves as the backend infrastructure for a modern portfolio website, providing secure authentication, blog management, user profiles, and more.

### ✨ Key Highlights

- 🔒 **Secure Authentication** - JWT-based auth with role-based access control
- 📝 **Blog Management** - Complete CRUD operations with rich content support
- 👤 **User Profiles** - Comprehensive profile management with file uploads
- 💬 **Comment System** - Interactive commenting with moderation
- 📧 **Contact Management** - Message handling and notifications
- 📚 **API Documentation** - Interactive Swagger documentation
- 🔧 **Database Seeding** - Automated data seeding for development

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**
  - User registration and login
  - JWT token-based authentication
  - Role-based access control (Admin, Subscriber)
  - Secure session management

- **Blog Management**
  - Create, read, update, delete blog posts
  - Rich content support with HTML sanitization
  - Category-based organization
  - Tag-based filtering and search
  - Image upload with Cloudinary integration
  - SEO-friendly URLs with slugs

- **User Profiles**
  - Public and private profile management
  - Avatar upload functionality
  - Personal information management
  - Profile privacy controls

- **Interactive Features**
  - Comment system for blog posts
  - Like functionality
  - Newsletter subscription
  - Contact form handling
  - Real-time notifications

### Technical Features
- **Security**
  - Data encryption and validation
  - XSS protection with HTML sanitization
  - CORS configuration
  - Rate limiting
  - Secure file upload handling

- **Performance**
  - Optimized database queries
  - Image optimization with Cloudinary
  - Caching strategies
  - Pagination support

- **Developer Experience**
  - Comprehensive API documentation
  - TypeScript for type safety
  - Automated testing setup
  - Database seeding scripts
  - Environment configuration

## 🛠 Tech Stack

### Backend Technologies
- **Runtime**: Node.js v21.7.3
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Cloudinary
- **Documentation**: Swagger/OpenAPI 3.0

### Development Tools
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier
- **Process Management**: Nodemon
- **Build Tool**: TypeScript Compiler
- **API Testing**: Postman

### Third-Party Services
- **Email**: Nodemailer
- **SMS**: Twilio
- **Image Processing**: Cloudinary
- **Documentation**: Swagger UI

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v21.7.3 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance)
- **Git**

### Required Accounts
- MongoDB Atlas account (for cloud database)
- Cloudinary account (for image storage)
- Email service account (for notifications)
- Twilio account (for SMS features) - Optional

## 🔧 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Ndevu12/My-BRAND_BackEnd.git
cd My-BRAND_BackEnd
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit the `.env` file with your configuration values (see [Configuration](#-configuration) section).

### 4. Build the Project
```bash
npm run build
```

## ⚙️ Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Server Configuration
PORT=6090
NODE_ENV=development
NODE_VERSION=21.7.3

# Database
DB_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name

# JWT Configuration
JWT_SECRETKEY=your_super_secure_jwt_secret_key_here

# CORS Configuration - Comma-separated list of allowed origins
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Cloudinary Configuration (for image uploads)
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Swagger Configuration
SWAGGER_SERVER=http://localhost:6090/v1
SECOND_SWAGGER_SERVER=https://your-production-url.com

# Email Configuration
emailAddress=your_email@example.com
emailpassword=your_app_password
password=your_password

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
username=your_username
```

### 🔐 Security Notes
- Use strong, unique values for `JWT_SECRETKEY`
- Never commit `.env` file to version control
- Use app-specific passwords for email services
- Rotate credentials regularly

## 🎯 Usage

### Development Mode
```bash
npm run dev
# or
yarn dev
```

### Production Mode
```bash
npm start
# or
yarn start
```

### Available Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run seed        # Run database seeders
npm run db:fresh    # Clear database and run all seeders
npm test           # Run tests
```

The server will start on `http://localhost:6090`

### 📖 API Documentation
Once the server is running, visit:
- **Interactive Docs**: `http://localhost:6090/docs`
- **API Homepage**: `http://localhost:6090`

## 🔗 API Endpoints

### Base URL
```
http://localhost:6090/v1
```

### Authentication
```
POST   /auth/signup        # User registration
POST   /auth/login         # User login
POST   /auth/logout        # User logout
GET    /auth/status        # Get current user status
GET    /auth/me           # Get current user info
```

### Blog Management
```
GET    /blogs/public              # Get all public blogs
GET    /blogs/public/recent       # Get recent blogs with pagination
GET    /blogs/public/:id          # Get single blog by ID
GET    /blogs/by-category/:id     # Get blogs by category
GET    /blogs/by-tag              # Get blogs by tag
GET    /blogs/by-slug/:slug       # Get blog by slug (SEO-friendly)
POST   /blogs/create              # Create new blog (Admin only)
PUT    /blogs/update/:id          # Update blog (Author/Admin)
DELETE /blogs/delete/:id          # Delete blog (Author/Admin)
PUT    /blogs/like/:id            # Like/unlike blog
```

### User Profiles
```
GET    /profile/me                # Get my profile
PUT    /profile/me                # Update my profile
DELETE /profile/me                # Delete my profile
GET    /profile/:userId           # Get public profile by user ID
```

### Comments
```
POST   /comment/add               # Add comment to blog
GET    /comment/blog/:blogId      # Get comments for blog
PUT    /comment/:id               # Update comment
DELETE /comment/:id               # Delete comment
```

### Categories & Tags
```
GET    /blog-category             # Get all categories
POST   /blog-category/create      # Create category (Admin only)
PUT    /blog-category/update/:id  # Update category (Admin only)
DELETE /blog-category/delete/:id  # Delete category (Admin only)
```

### Contact & Messaging
```
POST   /message/contact-me        # Send contact message
GET    /message                   # Get all messages (Admin only)
GET    /message/:id               # Get message by ID (Admin only)
PATCH  /message/mark-read/:id     # Mark message as read (Admin only)
DELETE /message/delete/:id        # Delete message (Admin only)
```

### Subscriptions
```
POST   /subscriber/create         # Subscribe to newsletter
GET    /subscriber                # Get all subscribers (Admin only)
PUT    /subscriber/update/:id     # Update subscriber (Admin/Subscriber)
DELETE /subscriber/delete/:id     # Unsubscribe (Admin only)
```

## 🌱 Database Seeding

The project includes comprehensive database seeding for development and testing:

### Seed All Data
```bash
npm run seed
# or
yarn seed
```

### Seed Specific Data
```bash
npm run seed:users          # Seed users only
npm run seed:categories     # Seed blog categories only  
npm run seed:profiles       # Seed user profiles only
npm run seed:blogs         # Seed blog posts only
```

### Force Update (Override existing data)
```bash
npm run seed:users:force
npm run seed:blogs:force
# etc.
```

### Database Management
```bash
npm run db:clear     # Clear all data
npm run db:reset     # Reset database
npm run db:fresh     # Clear all data and run fresh seeds
```

## 🧪 Testing

### Unit Testing
```bash
npm test
# or
yarn test
```

### API Testing
- Use the provided **Postman** collection
- Interactive testing available at `/docs` endpoint
- Automated integration tests with **Jest**

### Test Coverage
- Unit tests for services and utilities
- Integration tests for API endpoints
- Authentication and authorization testing

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
Make sure to set production values for:
- `NODE_ENV=production`
- `DB_URL` (production MongoDB URI)
- `CORS_ORIGINS` (production frontend URLs)
- `SWAGGER_SERVER` (production API URL)

### Recommended Deployment Platforms
- **Heroku** - Easy deployment with MongoDB Atlas
- **Railway** - Modern deployment platform
- **AWS EC2** - Full control and scalability
- **Digital Ocean** - Cost-effective VPS hosting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### Development Workflow
1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
4. **Make** your changes
5. **Test** your changes (`npm test`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Code Style
- Follow TypeScript best practices
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Ensure all tests pass
- Follow the existing code structure

### Reporting Issues
Please use the issue tracker to report bugs or request features. Include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE.md) file for details.

## 📞 Contact

**Ndevu (Jean Paul Elisa)**
- **LinkedIn**: [linkedin](https://www.linkedin.com/in/jean-paul-elisa)
- 🌐 **Portfolio**: [https://ndevuspace.netlify.app/](https://ndevuspace.netlify.app/)
- 💼 **GitHub**: [@Ndevu12](https://github.com/Ndevu12)

---

<div align="center">

**Built with ❤️ by Ndevu using modern web technologies**

⭐ **Star this repository if you found it helpful!** ⭐

</div>