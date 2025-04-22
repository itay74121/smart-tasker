import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import TaskList from './pages/TaskList.js';
import TaskForm from './pages/TaskForm.js';
import TaskDetail from './pages/TaskDetail.js';
import Profile from './pages/Profile.js';
import Home from './pages/Home.js'; // Import the Home component

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} /> {/* Use the Home component */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tasks" element={<TaskList />} />
      <Route path="/tasks/new" element={<TaskForm />} />
      <Route path="/tasks/:id" element={<TaskDetail />} />
      <Route path="/settings" element={<Profile />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
