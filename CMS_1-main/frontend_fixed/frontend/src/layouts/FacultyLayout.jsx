import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const FacultyLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  // Verify faculty role
  React.useEffect(() => {
    if (user && user.role !== 'faculty') {
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

export default FacultyLayout;
