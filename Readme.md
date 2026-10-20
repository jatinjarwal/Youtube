# 📺 Video Streaming Platform API Backend

A scalable, production-grade RESTful API backend for a video streaming platform built using Node.js, Express.js, MongoDB, and Mongoose. This application features asynchronous background processing, ACID-compliant database operations, and a robust cloud deployment architecture.

🟢 **Live API Base URL:** `http://13.206.167.188/api/v1`

---

## 🚀 Key Features & Architecture

*   **Asynchronous Media Pipeline:** Engineered a distributed background job pipeline using BullMQ and Redis to asynchronously process Cloudinary media uploads and channel subscriptions, ensuring zero main-thread blocking.
*   **In-Memory Caching:** Implemented Redis caching for high-traffic read operations (e.g., channel profiles), bypassing complex MongoDB aggregation pipelines to significantly improve API response times.
*   **Data Integrity & Transactions:** Utilizes MongoDB ACID transactions to guarantee data integrity during complex cascade deletion operations spanning videos, comments, likes, and cloud assets.
*   **Production Infrastructure:** Deployed the REST API to an AWS EC2 instance attached to an Elastic IP, utilizing PM2 in cluster mode to independently manage scalable API instances and isolated worker processes. Traffic is securely routed through an Nginx global reverse proxy.
*   **Advanced Security:** Secured API endpoints against DDoS and abuse by implementing sliding-window rate limiters via Upstash Redis. Features JWT-based Access and Refresh Token authentication with bcrypt password hashing.
*   **Deep Analytics:** Employs complex MongoDB Aggregation Pipelines to generate detailed channel statistics and user watch histories.

---

## 🛠️ Tech Stack

### Core Application
*   **Runtime & Framework:** Node.js, Express.js
*   **Database & ODM:** MongoDB, Mongoose
*   **Authentication:** JSON Web Tokens (JWT), bcrypt.js

### Infrastructure & Cloud
*   **Hosting & Proxy:** AWS EC2, Nginx
*   **Process Management:** PM2 (Cluster Mode & Worker Separation)
*   **Caching & Queues:** Redis (Upstash), BullMQ
*   **Cloud Storage & Media:** Cloudinary, Multer

---

## 🧪 Recruiter & Developer Testing Guide

Testing a headless backend without a frontend can be difficult. Think of this API like a restaurant kitchen: you send an order (a Request) using an API client, and it serves you data (a Response). 

To explore this live project easily, use **Postman**, **Thunder Client** (a VS Code extension), or **cURL**. Here is a step-by-step humanized guide to testing the core flow:

### 1. Server Pulse Check (Health Route)
Verify that the Nginx proxy is properly routing traffic to the Node application.
*   **Method:** `GET`
*   **URL:** `http://13.206.167.188/api/v1/health`
*   **Expected Response:** A `200 OK` status confirming the server is actively listening. *(You can actually just click this link directly in your web browser!)*

### 2. Account Registration
Create a test user account to interact with the platform.
*   **Method:** `POST`
*   **URL:** `http://13.206.167.188/api/v1/users/register`
*   **Body Type:** `form-data` *(Required because we are handling physical file uploads via Multer)*
*   **Keys to Add:**
    *   `fullName`: "Test User"
    *   `username`: "testuser123"
    *   `email`: "test@example.com"
    *   `password`: "SecurePassword123"
    *   `avatar`: *(Attach a sample image file from your computer)*
*   **Expected Response:** A `201 Created` status with the new user profile object.

### 3. Authentication (Login)
Retrieve your secure JWT access and refresh tokens.
*   **Method:** `POST`
*   **URL:** `http://13.206.167.188/api/v1/users/login`
*   **Body Type:** `raw` (JSON)
    ```json
    {
      "email": "test@example.com",
      "password": "SecurePassword123"
    }
    ```
*   **Expected Response:** A `200 OK` status. Your API client will automatically store the secure HTTP-only authentication cookies required for the next step.

### 4. Asynchronous Video Upload (The Heavy Lifter)
Test the background BullMQ worker pipeline. Because of the queue architecture, the server will not make you wait for the file to reach Cloudinary.
*   **Method:** `POST`
*   **URL:** `http://13.206.167.188/api/v1/videos`
*   **Headers:** Ensure your Authorization cookie/token is attached.
*   **Body Type:** `form-data`
*   **Keys to Add:**
    *   `title`: "BullMQ Test Video"
    *   `description`: "Testing the background worker queue."
    *   `videoFile`: *(Attach a short .mp4 file)*
    *   `thumbnail`: *(Attach a sample image file)*
*   **Expected Response:** You will instantly receive a `202 Accepted` status indicating the files have been buffered locally and the upload job has been queued. The isolated background worker processes the heavy asset transfer to Cloudinary behind the scenes, ensuring the API remains highly responsive.

---

## 📂 Project Structure

```text
src/
├── controllers/    # Route controllers & business logic (videos, users, etc.)
├── db/             # MongoDB and Redis connection setups
├── middlewares/    # JWT verification, Multer, Rate Limiting, Error handling
├── models/         # Mongoose Schemas (User, Video, Comment, Like, etc.)
├── queues/         # BullMQ queue initializations for background jobs
├── routes/         # Express API routing definitions
├── utils/          # Cloudinary services, API Errors, and API Responses
├── workers/        # Isolated worker processes for consuming queues
├── constants.js    # Global application variables
├── app.js          # Express app configuration & middleware binding
└── index.js        # Main server entry point
