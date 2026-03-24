import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { routes } from './App';
import { RouterProvider } from 'react-router-dom';
import { ToastBar } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './Context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
      <ToastContainer />
    </AuthProvider>
  </React.StrictMode>
);

