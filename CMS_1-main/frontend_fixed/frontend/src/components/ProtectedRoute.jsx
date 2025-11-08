import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
	const auth = useSelector((state) => state.auth) || {};
	const isAuthenticated =
		auth.isAuthenticated ||
		!!localStorage.getItem('userToken') ||
		!!localStorage.getItem('token');

	if (!isAuthenticated) return <Navigate to="/login" replace />;
	return children;
};

export default ProtectedRoute;
