import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        if (!auth) {
            console.log("Firebase config missing. Using Mock Login.");
            alert("Simulating Google Login... (Demo Mode)");
            const mockUser = {
                uid: "mock-user-123",
                email: "demo@example.com",
                displayName: "Demo User",
                photoURL: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
            };
            setCurrentUser(mockUser);
            return;
        }
        return signInWithPopup(auth, googleProvider);
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
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
