import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './login/Login'
import RegisterPage from './register/Rregister'
import LocationsPage from './locations/Locations'
import LocationDetails from './locations/LocationDetails'
import ChatPage from './chat/Chat'
import ProtectedRoute from './core/ProtectedRoute'
import './index.scss'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route 
          path="/locations" 
          element={
            <ProtectedRoute>
              <LocationsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/locations/:id" 
          element={
            <ProtectedRoute>
              <LocationDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
