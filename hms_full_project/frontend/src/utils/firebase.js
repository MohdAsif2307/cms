// firebase web push setup (client)
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export function initFirebase(onMessageCallback){
  try{
    const app = initializeApp(firebaseConfig);
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      if(onMessageCallback) onMessageCallback(payload);
    });
    return messaging;
  }catch(e){ console.warn('Firebase init failed', e); return null; }
}

export async function getFcmToken(){
  try{
    const messaging = initFirebase();
    const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY });
    return currentToken;
  }catch(e){ console.warn('FCM token error', e); return null; }
}
