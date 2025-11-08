import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../utils/api'

export default function Reports(){
  const [report, setReport] = useState([]);
  useEffect(()=>{ load(); },[]);
  async function load(){
    try{ const res = await api.get('/reports/entries?date='); setReport(res.data || []); }catch(err){ console.error(err); }
  }
  return (
    <Layout>
      <h1 className="text-2xl font-semibold">Reports</h1>
      <div className="mt-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-slate-600">Download CSV or view entries here.</div>
          <pre className="mt-3">{JSON.stringify(report, null, 2)}</pre>
        </div>
      </div>
    </Layout>
  )
}
