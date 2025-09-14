// Impor fungsi-fungsi yang Anda butuhkan dari Firebase SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore,  GeoPoint } from "firebase/firestore";

// Konfigurasi Firebase untuk aplikasi web.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Inisialisasi Firebase dengan konfigurasi yang telah disediakan.
const app = initializeApp(firebaseConfig);

// Inisialisasi layanan Firebase yang ingin Anda gunakan.
// Dengan mengekspor instance ini, Anda dapat menggunakannya kembali di seluruh aplikasi.
export const auth = getAuth(app);
export const db = getFirestore(app);
export { GeoPoint }; 

