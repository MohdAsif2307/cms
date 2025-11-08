import { io } from 'socket.io-client';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
let socket = null;
export function connectSocket(token){
  if(socket) return socket;
  socket = io(SOCKET_URL, { auth: { token } });
  socket.on('connect', () => console.log('socket connected', socket.id));
  socket.on('disconnect', () => console.log('socket disconnected'));
  return socket;
}
export function getSocket(){ return socket; }
