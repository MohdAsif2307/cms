import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function SsoComplete(){
  const navigate = useNavigate();
  const [status, setStatus] = useState('Signing you in...');

  useEffect(()=>{
    (async ()=>{
      try{
        const res = await api.get('/auth/me');
        if(res?.data?.user){
          setStatus('Signed in — redirecting...');
          setTimeout(()=> navigate('/'), 600);
          return;
        }
      }catch(e){
        setStatus('Sign-in failed — please login manually');
        console.error('SSO complete error', e);
      }
    })();
  },[]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">{status}</h2>
        <p className="text-sm text-gray-600">If you are not redirected automatically, please <a href="/login" className="text-blue-600">click here</a> to login.</p>
      </div>
    </div>
  )
}
