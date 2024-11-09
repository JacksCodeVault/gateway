import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDJbgmMRBU8ifozFHo4jaYHeH6cObAglAo",
  authDomain: "sms-sync-bridge.firebaseapp.com",
  databaseURL: "https://sms-sync-bridge-default-rtdb.firebaseio.com",
  projectId: "sms-sync-bridge",
  storageBucket: "sms-sync-bridge.firebasestorage.app",
  messagingSenderId: "470504583266",
  appId: "1:470504583266:web:450fc945efbe9fe566613b"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();