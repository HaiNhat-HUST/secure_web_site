// src/main.jsx
import React, { StrictMode } from 'react'; // Import React nếu chưa có
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import AppRoutes from './routes/AppRoutes'; // Import AppRoutes
import './styles/index.css';

// Lấy root element
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

// Render ứng dụng
root.render(
  <StrictMode>
    <BrowserRouter> {/* Bọc toàn bộ ứng dụng trong BrowserRouter */}
      <AuthProvider> {/* Bọc AppRoutes trong AuthProvider */}
        <AppRoutes /> {/* Render trực tiếp AppRoutes */}
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);