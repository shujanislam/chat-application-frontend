// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import AppRouter from './AppRouter';  // Import your main routing component

const root = ReactDOM.createRoot(
  document.getElementById('root')!
);

root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Wrapping everything with BrowserRouter */}
      <AppRouter />  {/* This handles the routes */}
    </BrowserRouter>
  </React.StrictMode>
);

