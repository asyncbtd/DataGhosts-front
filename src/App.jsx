import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LocationsPage from './pages/LocationsPage';
import LocationDetailPage from './pages/LocationDetailPage';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/locations" element={<PrivateRoute><LocationsPage /></PrivateRoute>} />
          <Route path="/locations/:id" element={<PrivateRoute><LocationDetailPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/locations" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
} 