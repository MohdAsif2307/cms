import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';

const FacultyLayout = ({ children }) => {
  const navigate = useNavigate();
  // Select user directly to avoid returning new objects and unnecessary rerenders
  const user = useSelector((state) => (state && state.auth ? state.auth.user : null));

  // Verify faculty role
  React.useEffect(() => {
    const localType = (typeof localStorage !== 'undefined' && localStorage.getItem('userType')) || null;
    // Allow if localStorage indicates Faculty or user.role/designation implies faculty
    const isFaculty =
      localType === 'Faculty' ||
      (user && (user.role === 'faculty' || (user.designation && user.designation.toLowerCase().includes('faculty'))));
    if (!isFaculty) {
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
