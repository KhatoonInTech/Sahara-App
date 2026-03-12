import React, { useState, useEffect, useRef } from 'react';
import { Send, AlertCircle, Trash2, Info, MessageCircle, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { translations } from '../i18n';
import { Language, Message } from '../types';
import { storage } from '../utils/storage';
import { getChatResponse, detectCrisis } from '../services/geminiService';

interface ChatProps {
  language: Language;
  theme: 'light' | 'dark';
}

// Add SpeechRecognition type for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Chat({ language, theme }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(storage.get('chatHistory') || []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    storage.set('chatHistory', messages);
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'ur' ? 'ur-PK' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    if (detectCrisis(input)) {
      setShowCrisis(true);
    }

    setIsLoading(true);
    try {
      const aiResponseText = await getChatResponse([...messages, userMsg], language);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    storage.remove('chatHistory');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <header className={`p-4 border-b flex justify-between items-center shrink-0 ${
        language === 'ur' ? 'flex-row-reverse' : ''
      } bg-hero-gradient border-text-muted/10`}>
        <div className={`flex items-center gap-2 ${language === 'ur' ? 'flex-row-reverse' : ''}`}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">S</div>
          <div className={language === 'ur' ? 'text-right' : ''}>
            <h2 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>Sahara AI</h2>
            <p className="text-[10px] text-success font-medium">Online</p>
          </div>
        </div>
        <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-text-muted hover:text-emergency transition-colors">
          <Trash2 size={20} />
        </button>
      </header>

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card-bg w-full max-w-xs rounded-3xl p-6 shadow-2xl border border-text-muted/10"
            >
              <h3 className={`font-bold mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {language === 'en' ? 'Clear Chat?' : 'چیٹ صاف کریں؟'}
              </h3>
              <p className={`text-xs text-text-secondary mb-6 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {t.privacy.wipeConfirm}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-3 text-text-muted font-bold text-sm"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={clearChat}
                  className="flex-1 bg-emergency text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emergency/20"
                >
                  {t.common.delete}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center px-8 opacity-50">
            <MessageCircle size={48} className="text-primary mb-4" />
            <p className={`text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
              {t.onboarding.tagline}
            </p>
            <div className="mt-4 p-3 bg-support-blue/30 rounded-xl flex items-start gap-2 text-left">
              <Info size={16} className="text-primary shrink-0 mt-0.5" />
              <p className="text-[10px] text-text-secondary">
                {t.chat.disclaimer}
              </p>
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-chat-user text-text-primary rounded-tr-none'
                    : 'bg-chat-ai text-text-primary rounded-tl-none'
                }`}
              >
                <div className={`prose prose-sm ${theme === 'dark' ? 'prose-invert' : ''} ${language === 'ur' ? 'urdu-text' : ''}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <p className={`text-[8px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-chat-ai p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-primary rounded-full" />
            </div>
          </div>
        )}

        {showCrisis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emergency-soft/50 border border-emergency/20 p-4 rounded-2xl flex flex-col gap-3"
          >
            <div className="flex items-center gap-2 text-emergency">
              <AlertCircle size={20} />
              <h4 className="font-bold">{language === 'en' ? 'Crisis Support' : 'بحرانی مدد'}</h4>
            </div>
            <p className={`text-xs text-text-primary ${language === 'ur' ? 'urdu-text' : ''}`}>
              {t.chat.crisisDetected}
            </p>
            <button 
              onClick={() => navigate('/emergency')}
              className="bg-emergency text-white py-2 rounded-xl text-xs font-bold"
            >
              {t.emergency.immediate}
            </button>
          </motion.div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-card-bg border-t border-text-muted/10 shrink-0">
        <div className="flex gap-2 bg-section-bg p-2 rounded-2xl border border-text-muted/5 items-center">
          <button
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all ${
              isListening ? 'bg-emergency text-white animate-pulse' : 'bg-text-muted/10 text-text-muted hover:bg-primary/10 hover:text-primary'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? (language === 'en' ? 'Listening...' : 'سن رہا ہے...') : t.chat.placeholder}
            className={`flex-1 bg-transparent px-3 py-2 outline-none text-sm text-text-primary placeholder:text-text-secondary ${language === 'ur' ? 'text-right' : ''}`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`p-3 rounded-xl transition-all ${
              input.trim() && !isLoading ? 'bg-primary text-white shadow-md' : 'bg-text-muted/20 text-text-muted'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
