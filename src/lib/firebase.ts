import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyBPpFZqQR_j9xXowv23gbAg4dggVL7kvts",
  authDomain: "vereda-sonsito-2.firebaseapp.com",
  projectId: "vereda-sonsito-2",
  storageBucket: "vereda-sonsito-2.firebasestorage.app",
  messagingSenderId: "654476017786",
  appId: "1:654476017786:web:657c9ff744678330ad7bc3",
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
