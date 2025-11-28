import React, { useState } from 'react';
import { Leaf, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from './Button';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { language, setLanguage, t } = useLanguage();
  const { currentUser, login, logout } = useAuth();

  const handleAuth = async () => {
    try {
      if (currentUser) {
        await logout();
      } else {
        await login();
      }
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <>
      <nav className="bg-white sticky top-0 z-50 py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <img src="/logo.jpg" alt="Plantro Logo" className="w-10 h-10 object-cover rounded-full" />
              <span className="text-2xl font-bold text-brand-dark tracking-tight">
                Plantro
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <Link to="/" className="hover:text-brand-primary transition-colors">{t('home')}</Link>
              <Link to="/identifier" className="flex items-center gap-1 hover:text-brand-primary cursor-pointer transition-colors">
                {t('plantIdentifier')}
              </Link>
              <Link to="/problems" className="flex items-center gap-1 hover:text-brand-primary cursor-pointer transition-colors">
                {t('plantProblems')}
              </Link>
              <Link to="/supplements" className="hover:text-brand-primary transition-colors">{t('supplements')}</Link>

            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1 font-semibold text-slate-700 cursor-pointer hover:text-brand-primary group relative">
              <span>{language === 'en' ? 'English' : 'Bengali'}</span> <ChevronDown className="w-4 h-4" />

              {/* Language Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 hidden group-hover:block p-2">
                <div
                  className="px-4 py-2 hover:bg-mint-50 rounded-lg cursor-pointer text-sm"
                  onClick={() => setLanguage('en')}
                >
                  English
                </div>
                <div
                  className="px-4 py-2 hover:bg-mint-50 rounded-lg cursor-pointer text-sm"
                  onClick={() => setLanguage('bn')}
                >
                  Bengali
                </div>
              </div>
            </div>

            <Button
              className="bg-brand-primary hover:bg-mint-600 text-white rounded-full px-6 py-2.5 font-bold shadow-none hover:shadow-lg transition-all"
              size="md"
              onClick={handleAuth}
            >
              {currentUser ? 'Logout' : t('signUp')}
            </Button>
          </div>
        </div>
      </nav>


    </>
  );
};

export default Navbar;
