import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from './utils/storage';
import { translations } from './i18n';
import Layout from './components/Layout';
import QuickExit from './components/QuickExit';
import LockScreen from './components/LockScreen';

// Screens (to be implemented)
import Onboarding from './screens/Onboarding';
import Home from './screens/Home';
import Chat from './screens/Chat';
import Emergency from './screens/Emergency';
import Education from './screens/Education';
import Community from './screens/Community';
import HelpCenter from './screens/HelpCenter';
import Privacy from './screens/Privacy';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'ur'>(storage.get('language') || 'en');
  const [onboarded, setOnboarded] = useState<boolean>(storage.get('onboarded') || false);
  const [theme, setTheme] = useState<'light' | 'dark'>(storage.get('theme') || 'light');
  const [isCamouflaged, setIsCamouflaged] = useState(false);
  const [isLocked, setIsLocked] = useState<boolean>(storage.get('appLockEnabled') || false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const enabled = storage.get('appLockEnabled') || false;
    setIsLocked(enabled);
  }, []);

  // Sync lock status from storage periodically or on focus
  useEffect(() => {
    const checkLock = () => {
      const enabled = storage.get('appLockEnabled') || false;
      setIsLocked(enabled);
    };
    
    window.addEventListener('storage', checkLock);
    window.addEventListener('focus', checkLock);
    return () => {
      window.removeEventListener('storage', checkLock);
      window.removeEventListener('focus', checkLock);
    };
  }, []);

  const t = translations[language];

  useEffect(() => {
    storage.set('language', language);
  }, [language]);

  useEffect(() => {
    storage.set('onboarded', onboarded);
  }, [onboarded]);

  useEffect(() => {
    storage.set('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  const toggleLanguage = () => setLanguage(prev => prev === 'en' ? 'ur' : 'en');
  const triggerQuickExit = () => setIsCamouflaged(true);
  const lockApp = () => setIsAuthenticated(false);

  const layoutProps = {
    language,
    theme,
    toggleTheme,
    toggleLanguage,
    triggerQuickExit,
    lockApp,
    isLockEnabled: storage.get('appLockEnabled') || false
  };

  return (
    <Router>
      <AnimatePresence mode="wait">
        {isLocked && !isAuthenticated ? (
          <LockScreen 
            key="lock-screen"
            language={language} 
            mode="unlock" 
            storedPin={storage.get('appPin')} 
            onSuccess={() => setIsAuthenticated(true)} 
          />
        ) : (
          <motion.div 
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen"
          >
            <QuickExit isCamouflaged={isCamouflaged} setIsCamouflaged={setIsCamouflaged} />
            <Routes>
              {!onboarded ? (
                <Route 
                  path="*" 
                  element={
                    <Onboarding 
                      language={language} 
                      setLanguage={setLanguage} 
                      onComplete={() => setOnboarded(true)} 
                    />
                  } 
                />
              ) : (
                <>
                  <Route path="/home" element={<Layout {...layoutProps}><Home language={language} /></Layout>} />
                  <Route path="/chat" element={<Layout {...layoutProps}><Chat language={language} theme={theme} /></Layout>} />
                  <Route path="/emergency" element={<Layout {...layoutProps}><Emergency language={language} /></Layout>} />
                  <Route path="/education" element={<Layout {...layoutProps}><Education language={language} /></Layout>} />
                  <Route path="/community" element={<Layout {...layoutProps}><Community language={language} /></Layout>} />
                  <Route path="/help" element={<Layout {...layoutProps}><HelpCenter language={language} /></Layout>} />
                  <Route path="/privacy" element={<Layout {...layoutProps}><Privacy language={language} /></Layout>} />
                  <Route path="*" element={<Navigate to="/home" replace />} />
                </>
              )}
            </Routes>
          </motion.div>
        )}
      </AnimatePresence>
    </Router>
  );
}
