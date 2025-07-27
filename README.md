# Real-Time Online Library System

A web-based application that allows multiple users to manage a shared book collection with real-time synchronization. [cite_start]When one user adds, updates, or deletes a book, all other connected users instantly see the changes without refreshing their browsers.

## Key Features

***Real-time Synchronization**: Changes are instantly reflected across all connected clients.
***CRUD Operations**: Complete functionality for creating, reading, updating, and deleting books.
***Live User Count**: Real-time display of how many users are currently online.
***Instant Notifications**: Users receive immediate alerts for all book operations.
***Responsive Design**: A user-friendly interface for both desktop and mobile devices.

## Technology Stack

***Backend**: Node.js, Express.js, Socket.IO, Mongoose 
***Frontend**: React 18, Socket.IO Client, Context API 
***Database**: MongoDB with real-time change streams
***Deployment**: Docker, Nginx, PM2

## Getting Started

### Prerequisites

* Node.js (v16+)
* MongoDB (v5+)
* An active internet connection

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/hampnna/online-library.git]
    cd online-library
    ```
2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```
3.  **Install frontend dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env` file in the `backend` folder and add your MongoDB connection string:
    ```env
    MONGODB_URI=your_mongodb_connection_string
    PORT=5000
    ```
5.  **Run the application:**
    - In one terminal, start the backend server:
      ```bash
      cd backend
      npm start
      ```
    - In another terminal, start the frontend React app:
      ```bash
      cd frontend
      npm start
      ```
