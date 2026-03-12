import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, AlertTriangle, HeartPulse, Users, HelpCircle, Shield, ArrowRight, HandHeart } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface HomeProps {
  language: Language;
}

export default function Home({ language }: HomeProps) {
  const navigate = useNavigate();
  const t = translations[language];

  const menuItems = [
    { 
      id: 'chat', 
      title: t.home.chat, 
      icon: MessageCircle, 
      color: 'bg-primary/10 text-primary', 
      path: '/chat',
      desc: language === 'en' ? 'Safe space to talk' : 'بات کرنے کے لیے محفوظ جگہ'
    },
    { 
      id: 'emergency', 
      title: t.home.emergency, 
      icon: AlertTriangle, 
      color: 'bg-emergency/10 text-emergency', 
      path: '/emergency',
      desc: language === 'en' ? 'Immediate help & guides' : 'فوری مدد اور گائیڈز'
    },
    { 
      id: 'health', 
      title: t.home.health, 
      icon: HeartPulse, 
      color: 'bg-blue-50 text-blue-600', 
      path: '/education',
      desc: language === 'en' ? 'Medical & hygiene info' : 'طبی اور صفائی کی معلومات'
    },
    { 
      id: 'community', 
      title: t.home.community, 
      icon: Users, 
      color: 'bg-support/20 text-purple-600', 
      path: '/community',
      desc: language === 'en' ? 'Connect anonymously' : 'گمنام طور پر جڑیں'
    },
    { 
      id: 'help', 
      title: t.home.help, 
      icon: HelpCircle, 
      color: 'bg-orange-50 text-orange-600', 
      path: '/help',
      desc: language === 'en' ? 'NGOs & legal aid' : 'این جی اوز اور قانونی امداد'
    },
    { 
      id: 'privacy', 
      title: t.home.privacy, 
      icon: Shield, 
      color: 'bg-gray-100 text-gray-600', 
      path: '/privacy',
      desc: language === 'en' ? 'Security settings' : 'حفاظتی ترتیبات'
    },
  ];

  return (
    <div className="p-6">
      <header className="mb-8 mt-4 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-2xl text-primary">
          <HandHeart size={32} />
        </div>
        <div>
          <h1 className={`text-3xl font-bold mb-1 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.home.title}
          </h1>
          <p className={`opacity-60 text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.home.subtitle}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="flex items-center gap-4 p-5 rounded-3xl shadow-sm border text-left transition-all active:scale-[0.98] bg-card-gradient border-text-muted/5 hover:border-primary/20"
          >
            <div className={`p-4 rounded-2xl ${item.color}`}>
              <item.icon size={28} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold text-text-primary ${language === 'ur' ? 'urdu-text' : ''}`}>
                {item.title}
              </h3>
              <p className={`text-xs text-text-secondary mt-0.5 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {item.desc}
              </p>
            </div>
            <ArrowRight size={18} className="text-text-muted opacity-30" />
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-primary-soft/30 rounded-3xl border border-primary-soft">
        <h4 className={`font-bold text-primary mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'Daily Affirmation' : 'روزانہ کی تصدیق'}
        </h4>
        <p className={`text-sm italic text-text-secondary ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' 
            ? '"You are strong, you are brave, and you are worthy of healing."' 
            : '"آپ مضبوط ہیں، آپ بہادر ہیں، اور آپ شفا کے مستحق ہیں۔"'}
        </p>
      </div>
    </div>
  );
}
