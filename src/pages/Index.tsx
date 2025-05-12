
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirigimos de index a dashboard
const Index = () => {
  console.log('Index page reached, redirecting to dashboard');
  return <Navigate to="/" replace />;
};

export default Index;
