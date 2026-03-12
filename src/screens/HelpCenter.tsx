import React, { useState, useEffect } from 'react';
import { Building2, Scale, ShieldAlert, Stethoscope, ChevronRight, Phone, ArrowLeft, MapPin, ExternalLink } from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface HelpCenterProps {
  language: Language;
}

interface Resource {
  id: string;
  name: string;
  contact: string;
  location: string;
  specialty?: string;
}

export default function HelpCenter({ language }: HelpCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const t = translations[language];

  const categories = [
    {
      id: 'ngos',
      title: t.help.ngos,
      icon: Building2,
      color: 'bg-primary/10 text-primary',
      desc: language === 'en' ? 'Support organizations' : 'امدادی تنظیمیں'
    },
    {
      id: 'legal',
      title: t.help.legal,
      icon: Scale,
      color: 'bg-blue-50 text-blue-600',
      desc: language === 'en' ? 'Legal aid & advice' : 'قانونی امداد اور مشورہ'
    },
    {
      id: 'cybercrime',
      title: t.help.cybercrime,
      icon: ShieldAlert,
      color: 'bg-orange-50 text-orange-600',
      desc: language === 'en' ? 'Online harassment help' : 'آن لائن ہراساں کرنے کی مدد'
    },
    {
      id: 'doctors',
      title: t.help.doctors,
      icon: Stethoscope,
      color: 'bg-green-50 text-green-600',
      desc: language === 'en' ? 'Specialized medical care' : 'خصوصی طبی دیکھ بھال'
    }
  ];

  useEffect(() => {
    if (selectedCategory === 'ngos' || selectedCategory === 'doctors') {
      setLoading(true);
      fetch(`/api/${selectedCategory}`)
        .then(res => res.json())
        .then(data => {
          setResources(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else if (selectedCategory) {
      // Mock data for legal and cybercrime for now
      if (selectedCategory === 'legal') {
        setResources([
          { id: 'l1', name: 'Legal Aid Society', contact: '021-99211111', location: 'Karachi' },
          { id: 'l2', name: 'Asma Jahangir Legal Aid', contact: '042-35711111', location: 'Lahore' }
        ]);
      } else if (selectedCategory === 'cybercrime') {
        setResources([
          { id: 'c1', name: 'FIA Cybercrime Wing', contact: '9911', location: 'National' },
          { id: 'c2', name: 'Digital Rights Foundation', contact: '0800-39393', location: 'National' }
        ]);
      }
    }
  }, [selectedCategory]);

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    return (
      <div className="p-6">
        <button 
          onClick={() => setSelectedCategory(null)}
          className="flex items-center gap-2 text-primary font-bold mb-6 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
          {language === 'en' ? 'Back' : 'واپس'}
        </button>

        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className={`p-4 rounded-2xl ${category?.color}`}>
              {category && <category.icon size={24} />}
            </div>
            <h1 className={`text-2xl font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
              {category?.title}
            </h1>
          </div>
        </header>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 opacity-50">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className={language === 'ur' ? 'urdu-text' : ''}>
                {language === 'en' ? 'Loading resources...' : 'وسائل لوڈ ہو رہے ہیں...'}
              </p>
            </div>
          ) : resources.length > 0 ? (
            resources.map((res) => (
              <div key={res.id} className="bg-card-bg rounded-3xl p-5 border border-text-muted/5 shadow-sm">
                <h3 className={`font-bold text-lg mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
                  {res.name}
                </h3>
                {res.specialty && (
                  <p className="text-xs text-primary font-bold mb-3 px-3 py-1 bg-primary-soft/30 rounded-lg inline-block">
                    {res.specialty}
                  </p>
                )}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <MapPin size={14} className="text-text-muted" />
                    <span>{res.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <Phone size={14} className="text-text-muted" />
                    <span>{res.contact}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={`tel:${res.contact}`}
                    className="flex-1 bg-primary text-white py-3 rounded-xl text-xs font-bold text-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
                  >
                    {language === 'en' ? 'Call Now' : 'ابھی کال کریں'}
                  </a>
                  <button className="p-3 bg-section-bg text-text-muted rounded-xl active:scale-95 transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 opacity-50">
              <p className={language === 'ur' ? 'urdu-text' : ''}>
                {language === 'en' ? 'No resources found in this category.' : 'اس زمرے میں کوئی وسائل نہیں ملے۔'}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8 mt-4">
        <h1 className={`text-2xl font-bold mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {t.help.title}
        </h1>
        <p className={`opacity-60 text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'Connect with professionals who can help.' : 'ان پیشہ ور افراد سے جڑیں جو مدد کر سکتے ہیں۔'}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {categories.map((cat, i) => (
          <button
            key={i}
            onClick={() => setSelectedCategory(cat.id)}
            className="w-full flex items-center gap-4 p-5 bg-card-bg rounded-3xl shadow-sm border border-text-muted/5 text-left transition-transform active:scale-[0.98] hover:border-primary/20"
          >
            <div className={`p-4 rounded-2xl ${cat.color}`}>
              <cat.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                {cat.title}
              </h3>
              <p className={`text-xs opacity-50 mt-0.5 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {cat.desc}
              </p>
            </div>
            <ChevronRight size={18} className="text-text-muted opacity-30" />
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-card-bg rounded-3xl border border-text-muted/5 shadow-sm">
        <h3 className={`font-bold mb-4 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'National Helpline' : 'قومی ہیلپ لائن'}
        </h3>
        <div className="flex items-center justify-between p-4 bg-primary-soft/30 rounded-2xl border border-primary/10">
          <div className="flex items-center gap-3">
            <Phone className="text-primary" size={20} />
            <span className="font-bold">1094</span>
          </div>
          <a href="tel:1094" className="bg-primary text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {language === 'en' ? 'Call Now' : 'ابھی کال کریں'}
          </a>
        </div>
      </div>
    </div>
  );
}
