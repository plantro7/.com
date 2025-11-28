import React from 'react';
import { X } from 'lucide-react';
import Button from './Button';

const LoginModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleGoogleLogin = () => {
        // Simulate Google Login
        console.log("Logging in with Google...");
        setTimeout(() => {
            onClose();
            alert("Successfully logged in with Google!");
        }, 1000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative animate-slide-up">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-brand-dark mb-2">Welcome Back</h2>
                    <p className="text-slate-500 mb-8">Sign in to save your plant diagnosis history</p>

                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all shadow-sm hover:shadow-md group"
                    >
                        <img
                            src="https://www.google.com/favicon.ico"
                            alt="Google"
                            className="w-5 h-5"
                        />
                        <span>Continue with Google</span>
                    </button>

                    <div className="mt-8 text-xs text-slate-400">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
