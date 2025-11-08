import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { connectSocket } from '../utils/socket'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  useEffect(()=>{
    // First, try to detect a server-set session (cookie) by calling /auth/me
    (async () => {
      try {
        const me = await api.get('/auth/me');
        if (me && me.data && me.data.user) {
          setUser(me.data.user);
          localStorage.setItem('hms_user', JSON.stringify(me.data.user));
          try{ connectSocket(); }catch(e){ console.warn('socket connect failed', e); }
          return;
        }
      } catch (err) {
        // ignore — fall through to other methods
      }

      // If CMS provided an SSO token via query param (back-compat), accept it and create a session
      try{
        const params = new URLSearchParams(window.location.search);
        const sso = params.get('cms_hms_token');
        if(sso){
          // store token and set api
          localStorage.setItem('hms_token', sso);
          api.setToken(sso);
          try{ connectSocket(sso); }catch(e){ console.warn('socket connect failed', e); }
          // try to decode token payload (no verification) to extract id/role
          try{
            const parts = sso.split('.');
            if(parts.length===3){
              const payload = JSON.parse(atob(parts[1]));
              const userObj = { id: payload.id || payload._id || null, role: payload.role || 'student' };
              setUser(userObj);
              localStorage.setItem('hms_user', JSON.stringify(userObj));
            }
          }catch(err){ /* ignore decode errors */ }
          // remove the query param from the URL to keep things clean
          const url = new URL(window.location.href);
          url.searchParams.delete('cms_hms_token');
          window.history.replaceState({}, document.title, url.toString());
        } else {
          const raw = localStorage.getItem('hms_user');
          if(raw) setUser(JSON.parse(raw));
          const token = localStorage.getItem('hms_token');
          if(token) api.setToken(token);
        }
      }catch(e){
        const raw = localStorage.getItem('hms_user');
        if(raw) setUser(JSON.parse(raw));
        const token = localStorage.getItem('hms_token');
        if(token) api.setToken(token);
      }
    })();
  },[]);
  const login = async (email,password) => {
    const res = await api.post('/auth/login',{ email, password });
    const { token, user } = res.data;
    api.setToken(token);
      try{ connectSocket(token); }catch(e){ console.warn('socket connect failed', e); }
    setUser(user);
    localStorage.setItem('hms_user', JSON.stringify(user));
    localStorage.setItem('hms_token', token);
    return user;
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('hms_user');
    localStorage.removeItem('hms_token');
    api.setToken(null);
  };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
