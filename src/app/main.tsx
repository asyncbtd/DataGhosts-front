import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './login/Login'
import RegisterPage from './register/Rregister'
import LocationsPage from './locations/Locations'
import LocationDetails from './locations/LocationDetails'
import ChatPage from './chat/Chat'
import SettingsPage from './settings/Settings'
import ProtectedRoute from './core/ProtectedRoute'
import Layout from './navigation/Layout'
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
              <Layout>
                <LocationsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/locations/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <LocationDetails />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <Layout>
                <ChatPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
