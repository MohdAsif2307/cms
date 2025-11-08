import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../utils/api'

export default function Entry(){
  const [entries, setEntries] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{
      const res = await api.get('/entry/me');
      setEntries(res.data || []);
    }catch(err){ console.error(err); }
  }
  function mark(type){
    if(!navigator.geolocation) return alert('Enable geolocation');
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try{
        await api.post('/entry', { type, lat: pos.coords.latitude, lng: pos.coords.longitude });
        alert('Marked ' + type);
        load();
      }catch(err){ alert(err.response?.data?.message || 'Error'); }
    }, err => alert('Allow location'));
  }
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Mark Entry / Exit</h1>
      <div className="mt-4 flex gap-3">
        <button onClick={()=>mark('entry')} className="px-4 py-2 bg-green-600 text-white rounded">Mark Entry</button>
        <button onClick={()=>mark('exit')} className="px-4 py-2 bg-red-600 text-white rounded">Mark Exit</button>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">History</h2>
        <ul className="mt-3 space-y-2">
          {entries.map(e => <li key={e._id} className="bg-white p-3 rounded shadow">{e.type} — {new Date(e.timestamp).toLocaleString()}</li>)}
        </ul>
      </section>
    </Layout>
  )
}
