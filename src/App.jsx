import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import LocationsPage from './pages/LocationsPage';
import LocationDetailPage from './pages/LocationDetailPage';
import ChatWidget from './pages/ChatPage';
import './App.css';
import { useLocation } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function LayoutWithChat({ children }) {
  const location = useLocation();
  const hideChat = location.pathname === '/login' || location.pathname === '/register';
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!hideChat && <ChatWidget />}
      <div style={{ flex: 1, marginLeft: hideChat ? 0 : 320, transition: 'margin-left 0.2s' }}>
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LayoutWithChat>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/locations" element={<PrivateRoute><LocationsPage /></PrivateRoute>} />
          <Route path="/locations/:id" element={<PrivateRoute><LocationDetailPage /></PrivateRoute>} />
          <Route path="*" element={<Navigate to="/locations" />} />
        </Routes>
      </LayoutWithChat>
    </BrowserRouter>
  );
} 