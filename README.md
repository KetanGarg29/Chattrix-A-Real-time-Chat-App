# 💬 Chattrix - Real-Time Chat Application

![Chattrix Banner](https://img.shields.io/badge/Chattrix-Chat--App-purple?style=for-the-badge&logo=chatbot&logoColor=white)
> A modern, full-stack real-time chat application built with 💖 using React, Node.js, Socket.IO, MongoDB, Cloudinary, and Express.js.

---

## 🚀 Features

- 🔒 Secure JWT-based user authentication
- 👤 Profile creation with avatar and bio
- 💬 Real-time messaging using **Socket.IO**
- 🟢 Online users indicator
- 🖼️ Image sharing with Cloudinary integration
- 📥 Message history and unread message counter
- 📱 Responsive UI with TailwindCSS

---

## 🧠 Tech Stack

| Frontend | Backend | Realtime | Database | Image Upload | Auth |
|----------|---------|----------|----------|---------------|------|
| React.js | Node.js | Socket.IO| MongoDB  | Cloudinary    | JWT  |

---


---

## 🏁 Getting Started

### ⚙️ Prerequisites

- Node.js v16+
- MongoDB Atlas or local MongoDB
- Cloudinary account (for image uploads)
- Vite (for frontend)

---

### 🧩 Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chattrix.git
cd chattrix
```

#### 2. Setup backend (Serer)
```cd server
npm install

Create .env file inside /sever directory
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

And Start the Server by - npm run server
```

### 3. Running Frontend
```cd ../client
npm install
npm run dev

And FINALLY http://localhost:5173
```

