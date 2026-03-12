import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Language } from '../types';

interface TourStep {
  targetId: string;
  title: string;
  content: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

interface TourProps {
  language: Language;
  onComplete: () => void;
}

export default function Tour({ language, onComplete }: TourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps: TourStep[] = [
    {
      targetId: 'nav-home',
      title: language === 'en' ? 'Home' : 'ہوم',
      content: language === 'en' 
        ? 'Access quick resources and emergency help from here.' 
        : 'یہاں سے فوری وسائل اور ہنگامی مدد تک رسائی حاصل کریں۔',
      position: 'top'
    },
    {
      targetId: 'nav-chat',
      title: language === 'en' ? 'Safe Chat' : 'محفوظ چیٹ',
      content: language === 'en' 
        ? 'Connect with our AI companion for support and guidance.' 
        : 'سپورٹ اور رہنمائی کے لیے ہمارے AI ساتھی سے رابطہ کریں۔',
      position: 'top'
    },
    {
      targetId: 'quick-exit-btn',
      title: language === 'en' ? 'Quick Exit' : 'فوری اخراج',
      content: language === 'en' 
        ? 'Tap this anytime to instantly hide the app behind a calculator.' 
        : 'ایپ کو فوری طور پر کیلکولیٹر کے پیچھے چھپانے کے لیے کسی بھی وقت اسے دبائیں۔',
      position: 'bottom'
    },
    {
      targetId: 'nav-privacy',
      title: language === 'en' ? 'Privacy' : 'رازداری',
      content: language === 'en' 
        ? 'Manage your security settings and PIN from here.' 
        : 'یہاں سے اپنی سیکیورٹی سیٹنگز اور پن کا انتظام کریں۔',
      position: 'top'
    }
  ];

  const step = steps[currentStep];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div className="absolute inset-0 bg-black/40 pointer-events-auto" onClick={onComplete} />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-[210] pointer-events-auto w-[280px] bg-white rounded-2xl shadow-2xl p-5"
          style={{
            // This is a simplified positioning. In a real app, we'd use getBoundingClientRect
            // For this demo, we'll place it in the center or relative to known positions
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-primary">{step.title}</h3>
            <button onClick={onComplete} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            {step.content}
          </p>
          
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full ${i === currentStep ? 'bg-primary' : 'bg-gray-200'}`} 
                />
              ))}
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={onComplete}
                className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600"
              >
                {language === 'en' ? 'Cancel Tour' : 'ٹور منسوخ کریں'}
              </button>
              
              <div className="flex gap-1">
                {currentStep > 0 && (
                  <button 
                    onClick={handlePrev}
                    className="p-1.5 rounded-lg bg-gray-100 text-gray-600"
                  >
                    <ChevronLeft size={16} />
                  </button>
                )}
                <button 
                  onClick={handleNext}
                  className="px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold flex items-center gap-1"
                >
                  {currentStep === steps.length - 1 
                    ? (language === 'en' ? 'Finish' : 'ختم') 
                    : (language === 'en' ? 'Next' : 'اگلا')}
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
