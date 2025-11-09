import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	// Select the boolean directly to avoid selector memoization warnings
	const isAuthenticatedFromState = useSelector((state) => (state && state.auth ? state.auth.isAuthenticated : false));
	const isAuthenticated =
		isAuthenticatedFromState ||
		!!localStorage.getItem('userToken') ||
		!!localStorage.getItem('token');

	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return children;
};

export default ProtectedRoute;
