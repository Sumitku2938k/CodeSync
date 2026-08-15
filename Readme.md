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
```

## 🏃‍♂️ Running Backend & Frontend on the Same Domain/Port

To serve the frontend and backend from a single domain and port, follow these steps:

1.  **Build the Frontend Application**
    -   In your `Frontend` directory, run the build command:
        ```bash
        npm run build
        ```
    -   This will create a `dist` folder containing the static HTML, CSS, and JavaScript files for your React application.

2.  **Copy Frontend Build to Backend**
    -   Copy the entire contents of the `Frontend/dist` directory.
    -   Paste these files into the `Backend/public` directory.

3.  **Serve Static Files with Express**
    -   In your backend's main server file, use the `express.static()` middleware to serve the `public` folder.
        ```javascript
        app.use(express.static('public'));
        ```

4.  **Run the Backend Server**
    -   Once the backend server is running, you can access the complete application (both frontend and backend) from the backend's URL.
