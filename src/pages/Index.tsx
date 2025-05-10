
import React from 'react';
import { Navigate } from 'react-router-dom';

// Redirigimos de index a dashboard
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
