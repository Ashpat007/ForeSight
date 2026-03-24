# ForeSight

ForeSight is a full-stack web application built using the MERN stack (MongoDB, Express, React, Node.js). It features a robust backend for processing data securely and a modern, lighting-fast Vite-React frontend designed with Tailwind CSS and Framer Motion for beautiful animations.

## Project Structure
- `sightback`: The Node.js and Express backend.
- `sightfront/sight-app`: The React (Vite) frontend.

## Prerequisites
Before you begin, ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas cluster)
- Git

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Ashpat007/ForeSight.git
cd ForeSight
```

### 2. Setup the Backend
The backend runs on Node.js and uses MongoDB for its database.

1. Navigate to the backend directory:
   ```bash
   cd sightback
   ```
2. Install backend dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables:
   - Create a file named `.env` inside the `sightback` directory.
   - Add the necessary environment variables (e.g., your MongoDB URI, JWT Secrets, PORT, etc.).
   *Example `.env`:*
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/foresight
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend should now be running on `http://localhost:5000`.*

### 3. Setup the Frontend
The frontend is built using React and Vite, delivering a blazing-fast development experience.

1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd sightfront/sight-app
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend should now be running on `http://localhost:5173`.*

---

## 🛠️ Built With
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, TensorFlow.js
- **Authentication**: JWT, bcryptjs

## 📝 License
This project is open-source and free to use.
