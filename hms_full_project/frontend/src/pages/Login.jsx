import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  async function doLogin(e){
    e.preventDefault();
    setLoading(true);
    try{
      await login(email, password);
      nav('/');
    }catch(err){
      alert(err.response?.data?.message || 'Login failed');
    }finally{ setLoading(false); }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-4">Hostel Management System</h2>
        <form onSubmit={doLogin}>
          <label className="block mb-2">Email</label>
          <input value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-4" />
          <label className="block mb-2">Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />
          <button className="w-full p-2 bg-blue-600 text-white rounded">{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}
