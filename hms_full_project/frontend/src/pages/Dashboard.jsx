import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import api from '../utils/api'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'

export default function Dashboard(){
  const [summary, setSummary] = useState({});
  const [entries, setEntries] = useState([]);

  useEffect(()=>{ loadEntries(); loadNotices(); }, []);

  async function loadEntries(){
    try{
      const res = await api.get('/entry/me');
      setEntries(res.data.slice(0,5));
    }catch(err){ console.error(err); }
  }
  async function loadNotices(){
    try{
      // simple: fetch notices for quick count
      const res = await api.get('/notices');
      setSummary(s => ({ ...s, notices: res.data.length }));
    }catch(err){}
  }

  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Notices</div>
          <div className="text-xl font-bold">{summary.notices ?? 0}</div>
          <Link to="/notices" className="text-sm text-blue-600">View</Link>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Recent Entries</div>
          <div className="text-xl font-bold">{entries.length}</div>
          <Link to="/entry" className="text-sm text-blue-600">Manage</Link>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-500">Complaints</div>
          <div className="text-xl font-bold">--</div>
          <Link to="/complaints" className="text-sm text-blue-600">View</Link>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="text-lg font-semibold">Recent Entry/Exit</h2>
        <ul className="mt-3 space-y-2">
          {entries.map(e => <li key={e._id} className="bg-white p-3 rounded shadow">{e.type} — {dayjs(e.timestamp).format('DD MMM YYYY, HH:mm')}</li>)}
        </ul>
      </section>
    </Layout>
  )
}
