import React, { useEffect, useState } from 'react';
import hms from '../utils/hmsAxios';
const HostelAdminMerged = () => {
  const [students, setStudents] = useState([]);
  useEffect(() => { hms.get('/api/hostel/admin/students').then(r=>setStudents(r.data||[])).catch(e=>console.error(e)); }, []);
  return (<div><h1>Hostel Admin</h1><table border="1"><thead><tr><th>ID</th><th>Hostel</th><th>Room</th></tr></thead><tbody>{students.map(s=><tr key={s.studentId}><td>{s.studentId}</td><td>{s.hostelName}</td><td>{s.roomNumber}</td></tr>)}</tbody></table></div>);
};
export default HostelAdminMerged;
