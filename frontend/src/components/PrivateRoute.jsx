import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — wraps any element that requires authentication.
 * Reads the token from localStorage; redirects to /login if absent.
 */
const PrivateRoute = ({ element }) => {
    const token = localStorage.getItem('token');
    return token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
