video stream platform api backend

A scalable backend for a video streaming platform built using Node.js, Express.js, MongoDB, and Mongoose. The project provides APIs for video management, user authentication, subscriptions, playlists, comments, likes, and channel analytics.

---

## 🚀 Features

- JWT-based Authentication & Authorization
- Access Token and Refresh Token Support
- Video Upload and Management
- Cloudinary Integration for Media Storage
- User Profile Management
- Comments and Likes System
- Subscription Management
- Playlist Creation and Management
- Watch History Tracking
- Channel Statistics and Analytics
- Pagination, Search, and Filtering
- Centralized Error Handling
- RESTful API Architecture

---

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT (JSON Web Tokens)

### File Handling
- Multer
- Cloudinary

### Development Tools
- Postman
- Git
- GitHub

---

## 📂 Project Structure

```text
src/
├── controllers/
├── models/
├── routes/
├── middlewares/
├── utils/
├── db/
├── constants/
└── app.js
```

---

## 📌 API Modules

### User
- Register User
- Login User
- Logout User
- Update Profile
- Change Password
- View Channel Profile

### Video
- Upload Video
- Update Video
- Delete Video
- Publish/Unpublish Video
- Get Video Details

### Comment
- Add Comment
- Update Comment
- Delete Comment
- View Comments

### Like
- Like/Unlike Video
- Like/Unlike Comment
- Like/Unlike Tweet

### Playlist
- Create Playlist
- Update Playlist
- Delete Playlist
- Add/Remove Videos

### Subscription
- Subscribe to Channel
- Unsubscribe from Channel
- View Subscribers

### Dashboard
- Channel Statistics
- Watch History
- Uploaded Videos Analytics


## 🔒 Security Features

- Password Hashing using bcrypt
- JWT Authentication
- Protected Routes
- Refresh Token Support
- Input Validation
- Ownership Verification for Resources

---

## 📈 Key Functionalities

- Secure user authentication and authorization
- Upload and manage videos using Cloudinary
- Like, comment, and subscribe functionalities
- Create and manage playlists
- Track watch history
- Generate channel analytics using MongoDB Aggregation Pipelines
- Search, filter, and paginate content efficiently

---

## 🚀 Future Improvements

- Video Streaming Support
- Recommendation System
- Real-Time Notifications
- Redis Caching
- API Rate Limiting
- Unit & Integration Testing

---

## 🎯 Learning Outcomes

- Backend Development with Node.js and Express.js
- REST API Design
- Authentication & Authorization
- MongoDB Aggregation Pipelines
- File Upload Management
- Middleware Design
- Database Modeling
- Error Handling & Validation

---

## 👨‍💻 Author

Jatin

Built as a backend-focused project to learn scalable API development using the MERN ecosystem.
