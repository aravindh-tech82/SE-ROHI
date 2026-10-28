import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <NotificationProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </NotificationProvider>
    </BrowserRouter>
  );
}

