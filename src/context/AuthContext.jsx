import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        if (!auth) {
            console.log("Firebase config missing. Using Mock Login.");
            // alert("Simulating Google Login... (Demo Mode)"); // Removed alert to prevent double alerts with modal
            const mockUser = {
                uid: "mock-google-user-123",
                email: "demo.google@example.com",
                displayName: "Demo Google User",
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            };
            setCurrentUser(mockUser);
            return mockUser;
        }
        return signInWithPopup(auth, googleProvider);
    };

    const loginWithEmail = async (email, password) => {
        if (!auth) {
            console.log("Firebase config missing. Using Mock Email Login.");
            const mockUser = {
                uid: "mock-email-user-456",
                email: email,
                displayName: email.split('@')[0],
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            setCurrentUser(mockUser);
            return mockUser;
        }
        return signInWithEmailAndPassword(auth, email, password);
    };

    const signupWithEmail = async (email, password) => {
        if (!auth) {
            console.log("Firebase config missing. Using Mock Signup.");
            const mockUser = {
                uid: "mock-new-user-789",
                email: email,
                displayName: email.split('@')[0],
                photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
            };
            setCurrentUser(mockUser);
            return mockUser;
        }
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const logout = async () => {
        if (!auth) {
            setCurrentUser(null);
            return;
        }
        return signOut(auth);
    };

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            // If user is logged in, sync with backend (to be implemented)
            if (user) {
                console.log("User logged in:", user.email);
            }
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        currentUser,
        login,
        loginWithEmail,
        signupWithEmail,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
