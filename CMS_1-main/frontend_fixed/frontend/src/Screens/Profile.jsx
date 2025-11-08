import React from 'react';
const Profile = () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  return (
    <div className="p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold">Profile</h2>
      {user ? (
        <div className="mt-4">
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p className="mt-4 text-gray-600">No user data available</p>
      )}
    </div>
  );
};
export default Profile;
