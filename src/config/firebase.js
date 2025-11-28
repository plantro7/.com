import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
let auth = null;
let googleProvider = null;

const isConfigValid = firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'VITE_FIREBASE_API_KEY' &&
    !firebaseConfig.apiKey.includes('your_api_key') &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId;

if (isConfigValid) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        googleProvider = new GoogleAuthProvider();
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        console.warn("Auth will be disabled due to initialization error.");
    }
} else {
    console.warn("Firebase config missing or invalid. Auth will be disabled.");
}

export { auth, googleProvider };
