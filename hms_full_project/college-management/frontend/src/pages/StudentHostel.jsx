import React, { useEffect, useState } from 'react';
import hms from '../utils/hmsAxios';
const StudentHostel = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  let user = JSON.parse(localStorage.getItem('user') || '{}');
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await hms.get(`/api/hostel/student/${user.id}`);
        setData(res.data);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    if (user.id) fetchData();
  }, [user.id]);
  if (loading) return <p>Loading hostel details...</p>;
  if (!data) return <p>No hostel record found.</p>;
  return (<div><h2>My Hostel Details</h2><p><strong>Hostel:</strong> {data.hostelName}</p><p><strong>Room:</strong> {data.roomNumber}</p></div>);
};
export default StudentHostel;
