import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import BoardList from './components/BoardList';
import TaskList from './components/TaskList';
import CommentList from './components/CommentList';

// Main App component with routing and theme toggle
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [theme, setTheme] = useState('light');

  // Toggle between light and dark theme
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
        <nav className="bg-blue-600 dark:bg-blue-800 p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-2xl font-bold">Task Manager</h1>
            <button
              onClick={toggleTheme}
              className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-md"
            >
              {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
            </button>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login setToken={setToken} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/boards"
              element={
                <ProtectedRoute>
                  <BoardList token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/boards/:boardId/tasks"
              element={
                <ProtectedRoute>
                  <TaskList token={token} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:taskId/comments"
              element={
                <ProtectedRoute>
                  <CommentList token={token} />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
