import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { routes } from './App';
import { RouterProvider } from 'react-router-dom';
import { ToastBar } from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={routes} />
    <ToastContainer />
  </React.StrictMode>
);
