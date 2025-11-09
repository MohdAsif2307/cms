import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function SsoComplete(){
  const navigate = useNavigate();
  const [status, setStatus] = useState('Completing SSO login...');

  useEffect(()=>{
    (async ()=>{
      try {
        // First check if we have a transfer token in URL (from CMS)
        const params = new URLSearchParams(window.location.search);
        const transfer = params.get('transfer');
        
        // If we have a transfer token, validate it with our backend
        if (transfer) {
          setStatus('Validating transfer token...');
          const validationUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/sso/validate-transfer`;
          const res = await fetch(validationUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transfer })
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.message || 'Transfer validation failed');
        }

        // Now check our session (either from cookie or validated transfer)
        setStatus('Checking session...');
        const me = await api.get('/auth/me');
        if (me?.data?.user) {
          const user = me.data.user;
          localStorage.setItem('hms_user', JSON.stringify(user));
          
          // Redirect based on role
          setStatus(`Welcome ${user.role === 'admin' ? 'Administrator' : 'Student'}! Redirecting...`);
          const destination = user.role === 'admin' ? '/admin/occupancy' : '/notices';
          setTimeout(() => navigate(destination), 800);
          return;
        }
        throw new Error('No session found');
      } catch (e) {
        console.error('SSO complete error:', e);
        setStatus('SSO login failed. Please try again or contact support.');
      }
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-lg p-8 text-center max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">{status}</h2>
        <p className="text-sm text-gray-600 mb-4">
          {status.includes('failed') ? 
            'There was a problem completing your login. Please try again or contact support.' :
            'Please wait while we complete your login...'}
        </p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  )
}
