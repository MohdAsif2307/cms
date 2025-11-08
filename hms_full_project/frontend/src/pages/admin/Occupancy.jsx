import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../utils/api'

export default function Occupancy(){
  const [rooms, setRooms] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{ const res = await api.get('/rooms'); setRooms(res.data || []); }catch(err){ console.error(err); }
  }
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Occupancy</h1>
      <div className="mt-4 grid grid-cols-1 gap-3">
        {rooms.map(r => (
          <div key={r._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">Room {r.block}-{r.roomNumber} ({r.capacity})</div>
            <div className="text-sm text-slate-600">Occupants: {r.occupants?.length || 0}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
