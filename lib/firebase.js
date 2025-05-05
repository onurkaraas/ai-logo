import { initializeApp } from 'firebase/app';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyDAVTqedlG_wgVgHP1akba4RXPDWmNpaoI',
  authDomain: 'ai-logo-95de8.firebaseapp.com',
  projectId: 'ai-logo-95de8',
  storageBucket: 'ai-logo-95de8.firebasestorage.app',
  messagingSenderId: '629285714236',
  appId: '1:629285714236:web:391ba19f83caaafa46c639',
  measurementId: 'G-YG5G5EFTKN',
};

const app = initializeApp(firebaseConfig);
const functions = getFunctions(app);

