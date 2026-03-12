import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Globe, ArrowRight, CheckCircle2 } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface OnboardingProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  onComplete: () => void;
}

export default function Onboarding({ language, setLanguage, onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const t = translations[language];

  const steps = [
    {
      title: t.onboarding.selectLanguage,
      content: (
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
              language === 'en' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white'
            }`}
          >
            <span className="font-semibold">English</span>
            {language === 'en' && <CheckCircle2 size={20} />}
          </button>
          <button
            onClick={() => setLanguage('ur')}
            className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
              language === 'ur' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 bg-white'
            }`}
          >
            <span className="font-urdu text-xl">اردو</span>
            {language === 'ur' && <CheckCircle2 size={20} />}
          </button>
        </div>
      ),
      icon: <Globe className="text-primary" size={48} />
    },
    {
      title: t.onboarding.privacyPromise,
      content: (
        <div className="text-center px-6">
          <p className={`text-gray-600 mb-6 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.onboarding.privacyText}
          </p>
          <div className="bg-primary/10 p-4 rounded-2xl flex items-start gap-3 text-left">
            <Shield className="text-primary shrink-0" size={24} />
            <p className="text-sm text-primary font-medium">
              {language === 'en' ? 'Zero-knowledge architecture. No server-side chat logs.' : 'زیرو نالج آرکیٹیکچر۔ کوئی سرور سائیڈ چیٹ لاگز نہیں۔'}
            </p>
          </div>
        </div>
      ),
      icon: <Shield className="text-primary" size={48} />
    }
  ];

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-hero-gradient bg-noise flex flex-col items-center justify-center p-8 max-w-md mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="flex flex-col items-center w-full"
        >
          <div className="mb-8 p-6 bg-card-gradient rounded-full shadow-sm">
            {currentStep.icon}
          </div>
          <h1 className={`text-2xl font-bold mb-8 text-center ${language === 'ur' ? 'urdu-text' : ''}`}>
            {currentStep.title}
          </h1>
          {currentStep.content}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 w-full max-w-xs flex flex-col gap-4">
        <button
          onClick={() => {
            if (step < steps.length - 1) {
              setStep(step + 1);
            } else {
              onComplete();
            }
          }}
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
        >
          {step === steps.length - 1 ? t.onboarding.getStarted : t.common.next}
          <ArrowRight size={20} />
        </button>
        
        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-gray-400 font-medium py-2"
          >
            {t.common.back}
          </button>
        )}
      </div>

      <div className="mt-8 flex gap-2">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all ${
              i === step ? 'w-8 bg-primary' : 'w-2 bg-gray-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
