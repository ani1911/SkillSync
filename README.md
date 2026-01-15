<div align="center">

# 🚀 SkillSync – Backend  
### Skill-Based Student Networking Platform (Backend)

A backend system that enables students to connect with each other based on **skills and interests**, inspired by real-world social matching platforms.

</div>

---

## 📌 About the Project

**SkillSync** is a backend application designed to help students **discover, connect, and collaborate** with other students who have complementary technical skills.

The focus of this project is on building a **secure, scalable, and well-structured backend**, implementing real-world concepts such as authentication, protected APIs, pagination, and relationship management.

This repository contains only the **backend implementation** of the project.

---


## 🛠️ Tech Stack

- **Backend Framework:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** JWT (JSON Web Tokens) + HTTP-only Cookies  
- **Encryption:** bcryptjs  
- **API Testing:** Postman  
- **Environment Management:** dotenv  
- **Package Manager:** npm  

---

## ⭐ Key Things Implemented in This Project

### 🔐 Authentication & Authorization
- User signup and login APIs
- Password hashing using **bcrypt**
- JWT-based authentication
- Middleware to protect private routes

---

### 👤 User Management
- User schema designed using Mongoose
- Stores user information such as:
  - Skills
  - Interests
- Authenticated user data available via middleware

---

### 🔍 Feed API & Pagination
- Fetch suggested developer profiles while excluding:
  - Logged-in user
  - Existing connections
  - Ignored users
  - Users with pending requests
- Pagination implemented using `skip` & `limit`
- Optimized queries using MongoDB `$nin` and `$ne` operators

---

### 📬 Connection Request System
- API to send connection requests
- API to review requests (accept / reject)
- Maintains request status in database
- Prevents duplicate or invalid requests

---

### 🗄️ Database Design
- **User Schema**
  - Sanitized inputs (trim, lowercase, validation)
  - Unique constraints on email and username
- **ConnectionRequest Schema**
  - `fromUserId`, `toUserId`, `status`
  - Enum validation for request status
  - Indexed fields for faster queries
  - Prevents multiple requests between the same users


---

### 🔒 Security Practices
- Encrypted passwords
- JWT validation on protected APIs
- Environment variables for sensitive data

---

## ✨ APIs Implemented (Core)

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | `/signup` | Register a new user |
| POST | `/login` | Authenticate user |
| GET | `/profile/view` | View logged-in user profile |
| PATCH | `/profile/edit` | Edit user profile |
| PATCH | `/profile/password` | Update password |
| POST | `/request/send` | Send connection request |
| POST | `/request/review` | Accept or reject request |
| GET | `/user/feed?page=1&limit=10` | Get suggested users |

🔐 **All protected APIs require JWT authentication**

---


