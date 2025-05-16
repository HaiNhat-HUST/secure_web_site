// src/main.jsx
import React, { StrictMode } from 'react'; // Import React nếu chưa có
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);