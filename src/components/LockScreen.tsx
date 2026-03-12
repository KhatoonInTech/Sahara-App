import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Fingerprint, Delete, X, ShieldAlert } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface LockScreenProps {
  language: Language;
  mode: 'unlock' | 'set';
  onSuccess: (pin?: string) => void;
  onCancel?: () => void;
  storedPin?: string;
  triggerQuickExit?: () => void;
}

export default function LockScreen({ language, mode, onSuccess, onCancel, storedPin, triggerQuickExit }: LockScreenProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [error, setError] = useState('');
  const t = translations[language];

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + num);
      setError('');
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  useEffect(() => {
    if (pin.length === 4) {
      if (mode === 'unlock') {
        if (pin === storedPin) {
          onSuccess();
        } else {
          setError(t.privacy.wrongPin);
          setPin('');
          // Security feature: Redirect to quick screen on wrong password
          if (triggerQuickExit) {
            triggerQuickExit();
          }
        }
      } else if (mode === 'set') {
        if (!isConfirming) {
          setConfirmPin(pin);
          setPin('');
          setIsConfirming(true);
        } else {
          if (pin === confirmPin) {
            onSuccess(pin);
          } else {
            setError(t.privacy.pinMismatch);
            setPin('');
            setConfirmPin('');
            setIsConfirming(false);
          }
        }
      }
    }
  }, [pin, mode, storedPin, isConfirming, confirmPin, onSuccess, t.privacy]);

  const handleBiometrics = async () => {
    if (window.PublicKeyCredential) {
      try {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (available && mode === 'unlock') {
          // Real WebAuthn request for local authentication
          const challenge = new Uint8Array(32);
          window.crypto.getRandomValues(challenge);
          
          const options: CredentialRequestOptions = {
            publicKey: {
              challenge,
              timeout: 60000,
              userVerification: 'required',
              rpId: window.location.hostname,
            }
          };

          try {
            // This triggers the native FaceID/Fingerprint/PIN prompt
            await navigator.credentials.get(options);
            onSuccess();
          } catch (err: any) {
            if (err.name !== 'NotAllowedError') {
              setError(language === 'en' ? 'Biometric authentication failed' : 'بایومیٹرک تصدیق ناکام ہوگئی');
            }
          }
        } else if (!available) {
          setError(language === 'en' ? 'Biometrics not available on this device' : 'اس ڈیوائس پر بایومیٹرکس دستیاب نہیں ہے');
        }
      } catch (e) {
        console.error('Biometrics error:', e);
        setError(language === 'en' ? 'Biometrics error' : 'بایومیٹرک خرابی');
      }
    } else {
      setError(language === 'en' ? 'Biometrics not supported' : 'بایومیٹرکس سپورٹ نہیں ہے');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-app-bg flex flex-col items-center justify-center p-8"
    >
      <div className="absolute top-8 right-8 flex justify-end items-center">
        {onCancel && (
          <button 
            onClick={onCancel}
            className="p-2 text-text-muted hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </div>

      <div className="mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 shadow-inner">
          {mode === 'unlock' ? <Lock size={32} /> : <Unlock size={32} />}
        </div>
        <h2 className={`text-2xl font-bold text-text-primary mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {mode === 'unlock' ? t.privacy.unlockApp : (isConfirming ? t.privacy.confirmPin : t.privacy.setPin)}
        </h2>
        <p className={`text-sm text-text-secondary ${language === 'ur' ? 'urdu-text' : ''}`}>
          {t.privacy.appLockDesc}
        </p>
      </div>

      <div className="flex gap-4 mb-12">
        {[0, 1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
              pin.length > i ? 'bg-primary border-primary scale-125' : 'border-text-muted/30'
            }`}
          />
        ))}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`text-emergency text-sm font-medium mb-8 ${language === 'ur' ? 'urdu-text' : ''}`}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className="w-16 h-16 rounded-full bg-card-bg border border-text-muted/5 flex items-center justify-center text-xl font-bold text-text-primary shadow-sm active:scale-90 transition-transform hover:bg-primary/5 hover:border-primary/20"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleBiometrics}
          className="w-16 h-16 rounded-full flex items-center justify-center text-primary active:scale-90 transition-transform hover:bg-primary/5"
        >
          <Fingerprint size={28} />
        </button>
        <button
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 rounded-full bg-card-bg border border-text-muted/5 flex items-center justify-center text-xl font-bold text-text-primary shadow-sm active:scale-90 transition-transform hover:bg-primary/5 hover:border-primary/20"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-full flex items-center justify-center text-text-muted active:scale-90 transition-transform hover:bg-emergency/5 hover:text-emergency"
        >
          <Delete size={24} />
        </button>
      </div>
    </motion.div>
  );
}
