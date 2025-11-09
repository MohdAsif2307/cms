import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  // Select only the user object reference (avoids creating new objects every render)
  const user = useSelector((state) => (state && state.auth ? state.auth.user : null));

  // Verify admin role
  React.useEffect(() => {
    const localType = (typeof localStorage !== 'undefined' && localStorage.getItem('userType')) || null;
    const isAdmin = localType === 'Admin' || (user && user.role === 'admin');
    if (!isAdmin) {
      navigate('/login');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
