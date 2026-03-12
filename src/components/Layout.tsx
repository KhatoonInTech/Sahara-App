import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, Home, MessageCircle, BookOpen, Users, HelpCircle, Shield, Sun, Moon, Lock, HandHeart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  language: 'en' | 'ur';
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toggleLanguage: () => void;
  triggerQuickExit: () => void;
  lockApp: () => void;
  isLockEnabled: boolean;
}

export default function Layout({ 
  children, 
  showNav = true, 
  language, 
  theme, 
  toggleTheme,
  toggleLanguage,
  triggerQuickExit,
  lockApp,
  isLockEnabled
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, path: '/home', label: language === 'en' ? 'Home' : 'ہوم', id: 'nav-home' },
    { icon: MessageCircle, path: '/chat', label: language === 'en' ? 'Chat' : 'چیٹ', id: 'nav-chat' },
    { icon: BookOpen, path: '/education', label: language === 'en' ? 'Education' : 'تعلیم', id: 'nav-education' },
    { icon: Users, path: '/community', label: language === 'en' ? 'Community' : 'کمیونٹی', id: 'nav-community' },
    { icon: HelpCircle, path: '/help', label: language === 'en' ? 'Help' : 'مدد', id: 'nav-help' },
  ];

  const isEmergency = location.pathname === '/emergency';
  const isChat = location.pathname === '/chat';
  const isHome = location.pathname === '/home';
  const isEducation = location.pathname === '/education';
  const isCommunity = location.pathname === '/community';
  const isHelp = location.pathname === '/help';

  const useAppGradient = isHome || isEducation || isCommunity || isHelp;

  return (
    <div className={`min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl transition-colors duration-300 text-text-primary ${
      isEmergency ? 'bg-emergency-gradient' : 
      isChat ? 'bg-chat-gradient bg-noise' :
      useAppGradient ? 'bg-app-gradient bg-noise' : 'bg-app-bg'
    }`}>
      {!isChat && (
        <header className={`px-6 py-4 flex justify-between items-center border-b sticky top-0 z-50 transition-colors duration-300 ${
          theme === 'dark' ? 'bg-card-bg/40 border-text-muted/10 backdrop-blur-md' : 'bg-card-bg/40 border-text-muted/10 backdrop-blur-md'
        }`}>
          <div className="flex items-center gap-2">
            <HandHeart className="text-primary" size={24} />
            <h1 className="font-bold text-xl tracking-tight">Sahara</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Toggle */}
            <button 
              onClick={toggleLanguage}
              className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                theme === 'dark' ? 'bg-section-bg text-text-secondary hover:bg-primary/10' : 'bg-section-bg text-text-secondary hover:bg-primary/10'
              }`}
            >
              {language === 'en' ? 'اردو' : 'EN'}
            </button>

            {/* Quick Exit Toggle */}
            <button 
              id="quick-exit-btn"
              onClick={triggerQuickExit}
              className="px-3 py-2 rounded-full bg-emergency text-white hover:bg-emergency/90 transition-colors shadow-lg shadow-emergency/20 flex items-center gap-2"
              title="Quick Exit"
            >
              <ShieldAlert size={18} />
              <span className="text-[10px] font-bold uppercase tracking-tighter">Exit</span>
            </button>

            {/* App Lock Button */}
            {isLockEnabled && (
              <button 
                onClick={lockApp}
                className={`p-2 rounded-full transition-colors ${
                  theme === 'dark' ? 'bg-section-bg text-primary hover:bg-primary/20' : 'bg-section-bg text-primary hover:bg-primary/20'
                }`}
                title="Lock App"
              >
                <Lock size={20} />
              </button>
            )}

            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${
                theme === 'dark' ? 'bg-section-bg text-yellow-400 hover:bg-primary/10' : 'bg-section-bg text-text-secondary hover:bg-primary/10'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto ${isChat ? 'pb-16' : 'pb-24'}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {showNav && (
        <nav className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto border-t px-6 py-3 flex justify-between items-center z-40 transition-colors duration-300 bg-card-bg border-text-muted/10`}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                id={item.id}
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      )}
    </div>
  );
}
