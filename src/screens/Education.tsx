import React from 'react';
import { HeartPulse, Droplets, ShieldAlert, MapPin, ChevronRight, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../i18n';
import { Language } from '../types';
import LabMap from '../components/LabMap';

interface EducationProps {
  language: Language;
}

export default function Education({ language }: EducationProps) {
  const [selectedTopic, setSelectedTopic] = React.useState<number | null>(null);
  const t = translations[language];

  const topics = [
    {
      title: t.health.std,
      icon: HeartPulse,
      color: 'bg-red-50 text-red-600',
      desc: language === 'en' ? 'Information on testing and prevention' : 'ٹیسٹنگ اور روک تھام کے بارے میں معلومات',
      content: {
        en: [
          'Testing is recommended if you have concerns about exposure.',
          'Many STIs are treatable or manageable with early detection.',
          'Testing centers provide confidential services.',
          'Prevention includes using protection and regular checkups.'
        ],
        ur: [
          'اگر آپ کو نمائش کے بارے میں خدشات ہیں تو ٹیسٹنگ کی سفارش کی جاتی ہے۔',
          'بہت سے STIs جلد تشخیص کے ساتھ علاج کے قابل یا قابل انتظام ہیں۔',
          'ٹیسٹنگ سینٹرز خفیہ خدمات فراہم کرتے ہیں۔',
          'روک تھام میں تحفظ کا استعمال اور باقاعدہ چیک اپ شامل ہیں۔'
        ]
      }
    },
    {
      title: t.health.hygiene,
      icon: Droplets,
      color: 'bg-blue-50 text-blue-600',
      desc: language === 'en' ? 'Post-assault hygiene guidance' : 'حملے کے بعد صفائی کی رہنمائی',
      content: {
        en: [
          'Try to avoid washing or changing clothes before a medical exam if possible.',
          'If you must wash, try to preserve any evidence in a paper bag.',
          'Gentle cleaning is recommended after the initial exam.',
          'Seek medical advice for any physical discomfort.'
        ],
        ur: [
          'اگر ممکن ہو تو طبی معائنے سے پہلے دھونے یا کپڑے تبدیل کرنے سے گریز کریں۔',
          'اگر آپ کو دھونا ہی پڑے تو کسی بھی ثبوت کو کاغذ کے تھیلے میں محفوظ کرنے کی کوشش کریں۔',
          'ابتدائی معائنے کے بعد نرم صفائی کی سفارش کی جاتی ہے۔',
          'کسی بھی جسمانی تکلیف کے لیے طبی مشورہ حاصل کریں۔'
        ]
      }
    },
    {
      title: t.health.policeMedical,
      icon: ShieldAlert,
      color: 'bg-orange-50 text-orange-600',
      desc: language === 'en' ? 'Understanding the medical-legal process' : 'طبی قانونی عمل کو سمجھنا',
      content: {
        en: [
          'A medical-legal exam is used to collect evidence.',
          'You have the right to have a support person present.',
          'The process is designed to be sensitive to your needs.',
          'Reporting to the police is a separate, optional step.'
        ],
        ur: [
          'ثبوت جمع کرنے کے لیے طبی قانونی معائنہ استعمال کیا جاتا ہے۔',
          'آپ کو ایک معاون شخص کی موجودگی کا حق حاصل ہے۔',
          'یہ عمل آپ کی ضروریات کے مطابق حساس بنایا گیا ہے۔',
          'پولیس کو رپورٹ کرنا ایک الگ، اختیاری قدم ہے۔'
        ]
      }
    },
    {
      title: t.health.findLabs,
      icon: MapPin,
      color: 'bg-green-50 text-green-600',
      desc: language === 'en' ? 'Locate nearby testing centers' : 'قریبی ٹیسٹنگ سینٹرز تلاش کریں',
      content: {
        en: [
          'Use the map below to find verified labs near your location.',
          'Look for labs that offer specialized trauma-informed care.',
          'Many government hospitals provide these services for free.',
          'Private labs also offer confidential testing.'
        ],
        ur: [
          'اپنے مقام کے قریب تصدیق شدہ لیبز تلاش کرنے کے لیے نیچے دیے گئے نقشے کا استعمال کریں۔',
          'ایسی لیبز تلاش کریں جو صدمے سے متعلق خصوصی دیکھ بھال فراہم کرتی ہیں۔',
          'بہت سے سرکاری ہسپتال یہ خدمات مفت فراہم کرتے ہیں۔',
          'نجی لیبز بھی خفیہ ٹیسٹنگ کی پیشکش کرتی ہیں۔'
        ]
      },
      showMap: true
    }
  ];

  if (selectedTopic !== null) {
    const topic = topics[selectedTopic];
    return (
      <div className="p-6">
        <button 
          onClick={() => setSelectedTopic(null)}
          className="flex items-center gap-2 text-primary font-bold mb-6 active:scale-95 transition-transform"
        >
          <ArrowLeft size={20} />
          <span className={language === 'ur' ? 'urdu-text' : ''}>{language === 'en' ? 'Back' : 'واپس'}</span>
        </button>

        <header className="mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${topic.color}`}>
            <topic.icon size={32} />
          </div>
          <h1 className={`text-2xl font-bold mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
            {topic.title}
          </h1>
          <p className={`opacity-60 text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
            {topic.desc}
          </p>
        </header>

        {topic.showMap && (
          <div className="mb-8">
            <LabMap />
          </div>
        )}

        <div className="space-y-4">
          {topic.content[language].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card-bg p-4 rounded-2xl border border-text-muted/5 shadow-sm flex gap-3 items-start"
            >
              <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
              <p className={`text-sm text-text-secondary leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
                {item}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-support-blue/30 rounded-2xl flex items-start gap-3">
          <Info size={20} className="text-primary shrink-0 mt-0.5" />
          <p className={`text-xs text-text-secondary leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
            {language === 'en' 
              ? 'This information is for educational purposes. Always consult with a healthcare professional for medical advice.'
              : 'یہ معلومات تعلیمی مقاصد کے لیے ہیں۔ طبی مشورے کے لیے ہمیشہ صحت کے پیشہ ور سے رجوع کریں۔'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-8 mt-4">
        <h1 className={`text-2xl font-bold mb-2 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {t.health.title}
        </h1>
        <p className={`opacity-60 text-sm ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'Reliable information for your health and safety.' : 'آپ کی صحت اور حفاظت کے لیے قابل اعتماد معلومات۔'}
        </p>
      </header>

      <div className="space-y-4">
        {topics.map((topic, i) => (
          <button
            key={i}
            onClick={() => setSelectedTopic(i)}
            className="w-full flex items-center gap-4 p-5 bg-card-gradient rounded-3xl shadow-sm border border-text-muted/5 text-left transition-transform active:scale-[0.98] hover:border-primary/20"
          >
            <div className={`p-4 rounded-2xl ${topic.color}`}>
              <topic.icon size={24} />
            </div>
            <div className="flex-1">
              <h3 className={`font-bold ${language === 'ur' ? 'urdu-text' : ''}`}>
                {topic.title}
              </h3>
              <p className={`text-xs opacity-50 mt-0.5 ${language === 'ur' ? 'urdu-text' : ''}`}>
                {topic.desc}
              </p>
            </div>
            <ChevronRight size={18} className="text-text-muted opacity-30" />
          </button>
        ))}
      </div>

      <div className="mt-8 p-6 bg-card-bg rounded-3xl border border-text-muted/5 shadow-sm">
        <h3 className={`font-bold mb-4 ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' ? 'Important Note' : 'اہم نوٹ'}
        </h3>
        <p className={`text-sm opacity-70 leading-relaxed ${language === 'ur' ? 'urdu-text' : ''}`}>
          {language === 'en' 
            ? 'Medical evidence is best collected within 72 hours of an assault. However, you can still seek medical care and testing at any time.'
            : 'طبی ثبوت حملے کے 72 گھنٹوں کے اندر بہترین طریقے سے جمع کیے جاتے ہیں۔ تاہم، آپ اب بھی کسی بھی وقت طبی دیکھ بھال اور ٹیسٹنگ حاصل کر سکتے ہیں۔'}
        </p>
      </div>
    </div>
  );
}
