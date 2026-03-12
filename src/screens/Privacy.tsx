import React, { useState } from 'react';
import { Shield, Lock, Trash2, Globe, ChevronRight, AlertCircle, CheckCircle2, Fingerprint } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';
import { storage } from '../utils/storage';
import LockScreen from '../components/LockScreen';

interface PrivacyProps {
  language: Language;
}

export default function Privacy({ language }: PrivacyProps) {
  const [isLockEnabled, setIsLockEnabled] = useState<boolean>(storage.get('appLockEnabled') || false);
  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(storage.get('biometricEnabled') || false);
  const [showLockSetup, setShowLockSetup] = useState(false);
  const [biometricsSupported, setBiometricsSupported] = useState(false);
  const t = translations[language];

  React.useEffect(() => {
    if (window.PublicKeyCredential) {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then(available => setBiometricsSupported(available));
    }
  }, []);

  const handleWipeData = () => {
    if (window.confirm(t.privacy.wipeConfirm)) {
      storage.clear();
      window.location.reload();
    }
  };

  const handleToggleLock = () => {
    if (isLockEnabled) {
      storage.set('appLockEnabled', false);
      storage.remove('appPin');
      setIsLockEnabled(false);
      window.location.reload();
    } else {
      setShowLockSetup(true);
    }
  };

  const handlePinSet = (pin?: string) => {
    if (pin) {
      storage.set('appPin', pin);
      storage.set('appLockEnabled', true);
      setIsLockEnabled(true);
      setShowLockSetup(false);
      alert(t.privacy.pinSuccess);
      window.location.reload();
    }
  };

  const handleToggleBiometric = () => {
    const newValue = !isBiometricEnabled;
    storage.set('biometricEnabled', newValue);
    setIsBiometricEnabled(newValue);
  };

  return (
    <div className="p-6">
      {showLockSetup && (
        <LockScreen 
          language={language} 
          mode="set" 
          onSuccess={handlePinSet} 
          onCancel={() => setShowLockSetup(false)} 
        />
      )}
      <header className="mb-8 mt-4">
        <h1 className={`text-2xl font-bold mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {t.privacy.title}
        </h1>
        <p className={`opacity-60 text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'Control your data and security settings.' : 'اپنے ڈیٹا اور سیکیورٹی کی ترتیبات کو کنٹرول کریں۔'}
        </p>
      </header>

      <div className="space-y-4">
        <div className="bg-card-bg rounded-3xl border border-text-muted/5 shadow-sm overflow-hidden">
          <button 
            onClick={handleToggleLock}
            className="w-full flex items-center justify-between p-5 hover:bg-section-bg transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${isLockEnabled ? 'bg-primary/10 text-primary' : 'bg-support-blue/30 text-text-muted'}`}>
                <Lock size={20} />
              </div>
              <div className="text-left">
                <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                  {t.privacy.appLock}
                </h3>
                <p className="text-[10px] text-text-muted">
                  {isLockEnabled ? t.privacy.disableLock : t.privacy.enableLock}
                </p>
              </div>
            </div>
            {isLockEnabled ? (
              <CheckCircle2 size={18} className="text-primary" />
            ) : (
              <ChevronRight size={18} className="text-text-muted opacity-30" />
            )}
          </button>

          {isLockEnabled && biometricsSupported && (
            <>
              <div className="h-px bg-section-bg mx-5" />
              <button 
                onClick={handleToggleBiometric}
                className="w-full flex items-center justify-between p-5 hover:bg-section-bg transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${isBiometricEnabled ? 'bg-primary/10 text-primary' : 'bg-support-blue/30 text-text-muted'}`}>
                    <Fingerprint size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                      {language === 'en' ? 'Biometric Unlock' : 'بایومیٹرک ان لاک'}
                    </h3>
                    <p className="text-[10px] text-text-muted">
                      {isBiometricEnabled 
                        ? (language === 'en' ? 'Use Fingerprint/FaceID to unlock' : 'ان لاک کرنے کے لیے فنگر پرنٹ/فیس آئی ڈی استعمال کریں')
                        : (language === 'en' ? 'Enable biometric authentication' : 'بایومیٹرک تصدیق فعال کریں')}
                    </p>
                  </div>
                </div>
                <div className={`w-10 h-5 rounded-full transition-colors relative ${isBiometricEnabled ? 'bg-primary' : 'bg-text-muted/20'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBiometricEnabled ? 'left-6' : 'left-1'}`} />
                </div>
              </button>
            </>
          )}
          
          {isLockEnabled && (
            <>
              <div className="h-px bg-section-bg mx-5" />
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-between p-5 hover:bg-section-bg transition-colors text-primary"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-primary/10">
                    <Lock size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                      {language === 'en' ? 'Lock Now' : 'ابھی لاک کریں'}
                    </h3>
                    <p className="text-[10px] text-text-muted">
                      {language === 'en' ? 'Immediately lock the application' : 'درخواست کو فوری طور پر لاک کریں'}
                    </p>
                  </div>
                </div>
                <ChevronRight size={18} className="opacity-30" />
              </button>
            </>
          )}
          
          <div className="h-px bg-section-bg mx-5" />

          <button className="w-full flex items-center justify-between p-5 hover:bg-section-bg transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-support-lavender/30 text-primary rounded-2xl">
                <Globe size={20} />
              </div>
              <div className="text-left">
                <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                  {language === 'en' ? 'Language' : 'زبان'}
                </h3>
                <p className="text-[10px] text-text-muted">
                  {language === 'en' ? 'Change app language' : 'ایپ کی زبان تبدیل کریں'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary px-3 py-1 bg-primary-soft/30 rounded-lg">
              {language === 'en' ? 'English' : 'اردو'}
            </span>
          </button>
        </div>

        <div className="bg-card-bg rounded-3xl border border-text-muted/5 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emergency-soft/50 text-emergency rounded-xl">
              <AlertCircle size={20} />
            </div>
            <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
              {language === 'en' ? 'Danger Zone' : 'خطرناک زون'}
            </h3>
          </div>
          
          <p className={`text-xs text-text-secondary mb-6 leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
            {language === 'en' 
              ? 'Wiping your data will permanently delete all chat history, preferences, and local settings. This action cannot be undone.'
              : 'آپ کا ڈیٹا صاف کرنے سے تمام چیٹ ہسٹری، ترجیحات اور مقامی ترتیبات مستقل طور پر حذف ہو جائیں گی۔ اس عمل کو واپس نہیں لیا جا سکتا۔'}
          </p>

          <button
            onClick={handleWipeData}
            className="w-full bg-emergency-soft/50 text-emergency py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border border-emergency/20 transition-all active:bg-emergency active:text-white shadow-sm"
          >
            <Trash2 size={20} />
            {t.privacy.wipeData}
          </button>
        </div>

        <div className="p-6 bg-primary-soft/30 rounded-3xl border border-primary/10 text-center">
          <Shield className="text-primary mx-auto mb-3" size={32} />
          <h4 className={`font-bold text-primary mb-1 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.onboarding.privacyPromise}
          </h4>
          <p className={`text-[10px] text-text-secondary ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.onboarding.privacyText}
          </p>
        </div>
      </div>
    </div>
  );
}
