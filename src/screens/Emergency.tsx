import React from 'react';
import { AlertTriangle, ShieldCheck, Camera, Phone, ChevronRight } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface EmergencyProps {
  language: Language;
}

export default function Emergency({ language }: EmergencyProps) {
  const t = translations[language];

  const sections = [
    {
      title: t.emergency.checklist,
      icon: ShieldCheck,
      color: 'text-green-600 bg-green-50',
      items: language === 'en' ? [
        'Get to a safe location immediately.',
        'Call someone you trust.',
        'Do not shower or change clothes if you plan to report.',
        'Seek medical attention even if you feel okay.'
      ] : [
        'فوری طور پر کسی محفوظ جگہ پر جائیں۔',
        'کسی ایسے شخص کو کال کریں جس پر آپ بھروسہ کرتے ہیں۔',
        'اگر آپ رپورٹ کرنے کا ارادہ رکھتے ہیں تو نہائیں یا کپڑے تبدیل نہ کریں۔',
        'طبی امداد حاصل کریں چاہے آپ ٹھیک محسوس کر رہے ہوں۔'
      ]
    },
    {
      title: t.emergency.evidence,
      icon: Camera,
      color: 'text-blue-600 bg-blue-50',
      items: language === 'en' ? [
        'Do not wash your hands or body.',
        'Keep the clothes you were wearing in a paper bag.',
        'Take photos of any visible injuries.',
        'Save all digital evidence (messages, call logs).'
      ] : [
        'اپنے ہاتھ یا جسم نہ دھوئیں۔',
        'جو کپڑے آپ نے پہنے ہوئے تھے انہیں کاغذ کے تھیلے میں رکھیں۔',
        'کسی بھی نظر آنے والی چوٹ کی تصاویر لیں۔',
        'تمام ڈیجیٹل ثبوت (پیغامات، کال لاگز) محفوظ کریں۔'
      ]
    }
  ];

  const contacts = [
    { name: language === 'en' ? 'Police' : 'پولیس', number: '15' },
    { name: language === 'en' ? 'Ambulance' : 'ایمبولینس', number: '1122' },
    { name: language === 'en' ? 'Women Helpline' : 'خواتین کی ہیلپ لائن', number: '1094' },
  ];

  return (
    <div className="p-6">
      <header className="mb-8 mt-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emergency/10 rounded-xl">
            <AlertTriangle className="text-emergency" size={24} />
          </div>
          <h1 className={`text-2xl font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.emergency.title}
          </h1>
        </div>
      </header>

      <div className="space-y-6">
        <button className="w-full bg-emergency text-white p-6 rounded-3xl shadow-lg shadow-emergency/20 flex items-center justify-between transition-transform active:scale-[0.98]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-2xl">
              <Phone size={28} />
            </div>
            <div className="text-left">
              <p className="text-xs opacity-80">{language === 'en' ? 'Immediate Action' : 'فوری کارروائی'}</p>
              <h3 className="text-xl font-bold">{t.emergency.immediate}</h3>
            </div>
          </div>
          <ChevronRight size={24} />
        </button>

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-card-bg p-6 rounded-3xl border border-text-muted/5 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${section.color}`}>
                  <section.icon size={20} />
                </div>
                <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                  {section.title}
                </h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm opacity-70">
                    <div className="w-1.5 h-1.5 bg-text-muted/30 rounded-full mt-1.5 shrink-0" />
                    <span className={language === 'ur' ? 'urdu-text' : ''}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-card-bg p-6 rounded-3xl border border-text-muted/5 shadow-sm">
          <h3 className={`font-bold mb-4 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {t.emergency.contacts}
          </h3>
          <div className="space-y-3">
            {contacts.map((contact, i) => (
              <a
                key={i}
                href={`tel:${contact.number}`}
                className="flex items-center justify-between p-4 bg-section-bg rounded-2xl transition-colors active:bg-primary/5"
              >
                <span className={`font-medium ${language === 'ur' ? 'urdu-text' : ''}`}>
                  {contact.name}
                </span>
                <span className="font-bold text-primary">{contact.number}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
