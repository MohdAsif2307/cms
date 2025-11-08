import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../utils/api'

export default function Notices(){
  const [notices, setNotices] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    const res = await api.get('/notices');
    setNotices(res.data || []);
  }
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Notices</h1>
      <div className="mt-4 space-y-3">
        {notices.map(n => (
          <div key={n._id} className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{n.title}</div>
            <div className="text-sm text-slate-600">{n.body}</div>
            <div className="text-xs text-slate-400 mt-2">Posted: {new Date(n.postedAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
