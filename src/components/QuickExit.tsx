import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldAlert } from 'lucide-react';

interface QuickExitProps {
  isCamouflaged: boolean;
  setIsCamouflaged: (val: boolean) => void;
}

export default function QuickExit({ isCamouflaged, setIsCamouflaged }: QuickExitProps) {
  const [calcDisplay, setCalcDisplay] = useState('0');

  const handleQuickExit = () => {
    setIsCamouflaged(true);
  };

  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
    } else if (calcDisplay === '0') {
      setCalcDisplay(val);
    } else {
      setCalcDisplay(prev => (prev + val).slice(0, 12));
    }
  };

  // Listen for escape key as a shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleQuickExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const calculate = () => {
    try {
      // Use a safe way to evaluate simple math expressions
      // eslint-disable-next-line no-eval
      const result = eval(calcDisplay);
      setCalcDisplay(String(result).slice(0, 12));
    } catch (e) {
      setCalcDisplay('Error');
    }
  };

  if (isCamouflaged) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-6 font-mono">
        <div className="w-full max-w-xs bg-zinc-900 rounded-3xl p-6 shadow-2xl border border-zinc-800">
          <div className="bg-zinc-800 rounded-xl p-4 mb-6 text-right text-4xl text-white overflow-hidden h-16 flex items-center justify-end">
            {calcDisplay}
          </div>
          <div className="grid grid-cols-4 gap-3">
            {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '.', 'C', '+'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleCalcClick(btn)}
                className="h-14 rounded-full bg-zinc-700 text-white text-xl font-medium active:bg-zinc-600 transition-colors"
              >
                {btn}
              </button>
            ))}
            <button 
              onClick={calculate}
              className="col-span-4 h-14 rounded-full bg-orange-600 text-white text-xl font-medium active:bg-orange-500 transition-colors mt-2"
            >
              =
            </button>
          </div>
        </div>
        <p className="mt-8 text-zinc-500 text-sm">Calculator v2.4.1</p>
      </div>
    );
  }

  return null;
}
