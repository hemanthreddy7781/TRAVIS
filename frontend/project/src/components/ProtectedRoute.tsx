import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute: React.FC = () => {
  const context = useContext(AppContext);

  if (!context) {
    // This can happen if the component is not wrapped in AppProvider
    return <Navigate to="/login" replace />;
  }

  const { isAuthenticated } = context;

  // If authenticated, render the child route. Otherwise, redirect to login.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;