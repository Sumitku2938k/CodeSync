# CodeSync

> A real-time collaborative code editor for developers to code together from anywhere.

CodeSync is a real-time collaborative coding platform that allows multiple developers to work on the same code simultaneously.

Changes made by one user are instantly synchronized with other connected users, creating a shared coding environment similar to collaborative editors.

## 🚀 Features

- 👥 Real-time collaborative code editing
- ⚡ Instant synchronization using Socket.IO
- 💻 Modern code editor interface
- 🔄 Multiple users can work on the same session
- 🌐 Real-time client-server communication
- 🐳 Dockerized application
- ☁️ AWS deployment
- 📦 Persistent project/data storage
- 🔌 REST APIs for application functionality

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- Socket.IO

### Database
- MongoDB

### DevOps & Deployment
- Docker
- AWS

## 🏗️ How It Works

CodeSync maintains a persistent connection between clients and the server using Socket.IO.

```text
    Developer A
       │
       │ Code Changes
       ▼
┌────────────────┐
│   Socket.IO    │
│     Server     │
└──────┬─────────┘
       │
       │ Real-time Events
       ▼
    Developer B