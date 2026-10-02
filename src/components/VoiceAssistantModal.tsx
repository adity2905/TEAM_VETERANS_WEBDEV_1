'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  Globe2, 
  ArrowRight, 
  Heart, 
  ShieldCheck, 
  HelpCircle,
  Play
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDonate?: (fundraiserId: string) => void;
  onOpenChain?: () => void;
}

type Language = 'hi' | 'mr' | 'en';

interface AssistantResponse {
  query: string;
  response: string;
  suggestedAction?: {
    label: string;
    actionType: 'chain' | 'donate' | 'browse';
    fundraiserId?: string;
  };
  metrics?: string;
}

const KNOWLEDGE_BASE: Record<Language, {
  greetings: string;
  listening: string;
  samples: { label: string; query: string }[];
  matchResponses: { 
    keywords: string[]; 
    answer: string; 
    actionLabel?: string; 
    actionType?: 'chain' | 'donate' | 'browse'; 
    fundraiserId?: string;
    metrics?: string;
  }[];
}> = {
  hi: {
    greetings: 'नमस्ते! मैं ओपन-इम्पैक्ट का वॉयस साथी हूँ। आप मुझसे पूछ सकते हैं कि आपका दान कहाँ जाता है, या आपके शहर में कौन सा एनजीओ काम कर रहा है।',
    listening: 'सुन रहा हूँ... कृपया बोलिए...',
    samples: [
      { label: '🍲 राशन और भोजन एनजीओ', query: 'भूख निवारण और भोजन वितरण के अभियान दिखाओ' },
      { label: '⛓️ पैसे का हिसाब कैसे देखें?', query: 'मेरा डोनेशन कहाँ खर्च होता है और इसका सबूत कहाँ है?' },
      { label: '🙋 मैं वालंटियर कैसे बनूँ?', query: 'इस वीकेंड मुंबई में वालंटियरिंग के मौके क्या हैं?' },
      { label: '🚨 मेडिकल इमरजेंसी मदद', query: 'मुझे तुरंत राशन या मेडिकल मदद चाहिए' }
    ],
    matchResponses: [
      {
        keywords: ['भोजन', 'राशन', 'भूख', 'खाना', 'अन्नपूर्णा'],
        answer: 'अन्नपूर्णा सेवा ट्रस्ट मुंबई में 3,200 ताजा भोजन पैकेट बांट रहा है। सिर्फ ₹25 में एक पूरा पौष्टिक भोजन दिया जाता है। हर एक रुपये का राशन रसीद और जीपीएस प्रूफ प्लेटफॉर्म पर मौजूद है।',
        actionLabel: 'अन्नपूर्णा इम्पैक्ट चेन देखें',
        actionType: 'chain',
        metrics: '₹25 = 1 पौष्टिक थाली'
      },
      {
        keywords: ['सबूत', 'हिसाब', 'दान', 'पैसा', 'खर्च', 'कहाँ'],
        answer: 'ओपन-इम्पैक्ट पर हर दान 6 चरणों में ट्रैक होता है: एनजीओ ➔ प्रोजेक्ट ➔ रसीद व बिल ➔ जमीनी गतिविधि ➔ जीपीएस फोटो ➔ इम्पैक्ट रिपोर्ट। आप बिना लॉगिन किए भी पूरा लेजर देख सकते हैं।',
        actionLabel: 'लाइव इम्पैक्ट चेन खोलें',
        actionType: 'chain',
        metrics: '100% सार्वजनिक ऑडिट'
      },
      {
        keywords: ['वालंटियर', 'मदद', 'काम', 'सेवा', 'समय'],
        answer: 'इस वीकेंड 2 बड़े ऑन-ग्राउंड इवेंट्स हैं: धारावी में रात्रि भोजन वितरण (8 वालंटियर चाहिए) और कनकपुरा में 1,000 पेड़ लगाने का अभियान (15 स्लॉट बाकी)।',
        actionLabel: 'वालंटियर स्लॉट्स ब्राउज़ करें',
        actionType: 'browse',
        metrics: 'सर्टिफिकेट + ग्राउंड आवर्स'
      },
      {
        keywords: ['मदद चाहिए', 'इमरजेंसी', 'राशन चाहिए', 'दवा'],
        answer: 'यदि आपको या आपके किसी परिचित को तुरंत भोजन, दवा या शेल्टर चाहिए, तो ऊपर "मुझे मदद चाहिए" बटन दबाएं। आपका आवेदन सीधे नजदीकी जांची हुई एनजीओ को फॉरवर्ड किया जाएगा।',
        actionLabel: 'सहायता फॉर्म खोलें',
        actionType: 'browse'
      }
    ]
  },
  mr: {
    greetings: 'नमस्कार! मी ओपन-इम्पॅक्ट व्हॉईस असिस्टंट आहे. तुमचे दान कुठे खर्च होते आणि महाराष्ट्रातील गरजूंपर्यंत कसे पोहोचते हे मला विचारा.',
    listening: 'ऐकत आहे... कृपया बोला...',
    samples: [
      { label: '🍲 अन्नदान मोहीम', query: 'मुंबई आणि पुण्यात अन्नदानाचे उपक्रम सांगा' },
      { label: '⛓️ खर्चाचा हिशोब कसा पाहायचा?', query: 'माझ्या पैशांचे काय झाले आणि पुरावा कसा पाहावा?' },
      { label: '🌱 वृक्षारोपण स्वयंसेवक', query: 'या रविवारी सह्याद्री वृक्षारोपण स्वयंसेवक बनायचे आहे' }
    ],
    matchResponses: [
      {
        keywords: ['अन्न', 'जेवण', 'भोजन', 'अन्नपूर्णा'],
        answer: 'अन्नपूर्णा सेवा ट्रस्ट धारावी आणि कुर्ला परिसरात रोज रात्री गरजू मजुरांना गरम जेवण पुरवत आहे. एका जेवणाचा खर्च फक्त ₹२५ आहे, आणि प्रत्येक पावती उपलब्ध आहे.',
        actionLabel: 'इम्पॅक्ट चेन तपासा',
        actionType: 'chain',
        metrics: '३,२००+ जेवण वितरित'
      },
      {
        keywords: ['खर्च', 'हिशोब', 'पुरावा', 'पैसे'],
        answer: 'प्लॅटफॉर्मवर प्रत्येक देणगीची खरेदी पावती, जीपीएस लोकेशन आणि ऑन-साइट फोटो जोडलेले असतात. कोणतीही संस्था खोटे दावे करू शकत नाही.',
        actionLabel: 'पारदर्शकता चेन पहा',
        actionType: 'chain',
        metrics: '१००% पडताळणी'
      }
    ]
  },
  en: {
    greetings: 'Hello! I am OpenImpact Voice Assistant. Ask me anything about genuine verified NGOs, proof of funds, or community volunteering near you.',
    listening: 'Listening to your microphone... please speak...',
    samples: [
      { label: '🍲 Food Relief in Mumbai', query: 'Show me verified food relief drives with proof' },
      { label: '⛓️ Where does ₹500 go?', query: 'How does the platform trace donation utilization?' },
      { label: '👧 Girl Child Education', query: 'Find education fundraisers with high transparency' },
      { label: '🌳 Weekend Tree Planting', query: 'Volunteer opportunities in Pune and Bangalore' }
    ],
    matchResponses: [
      {
        keywords: ['food', 'hunger', 'meal', 'annapurna', 'ration'],
        answer: 'Annapurna Seva Trust is running Night Food Runs across Dharavi and Kurla. Each complete thali costs exactly ₹25. Every purchase invoice and GPS distribution stamp is transparently posted.',
        actionLabel: 'Inspect Full Impact Chain',
        actionType: 'chain',
        metrics: '₹25 = 1 Hot Meal'
      },
      {
        keywords: ['trace', 'where', 'money', 'proof', 'transparency', 'chain', 'audit'],
        answer: 'Our Core USP is the 6-stage Impact Chain: NGO ➔ Project ➔ Itemized Invoices ➔ Field Distribution ➔ GPS Stamp Photo ➔ Verified Beneficiary Count. No black-box donations.',
        actionLabel: 'Open Interactive Impact Chain',
        actionType: 'chain',
        metrics: '100% Public Audit Trail'
      },
      {
        keywords: ['education', 'girl', 'school', 'vidya', 'study', 'laptop'],
        answer: 'Vidya Vikas Kendra is currently funding STEM Solar Laptops in rural Karnataka. ₹1,200 sponsors a student for an entire semester, complete with digital attendance logs.',
        actionLabel: 'Donate to Education Fund',
        actionType: 'donate',
        fundraiserId: 'fund-2',
        metrics: '65 Rural Girls Enrolled'
      },
      {
        keywords: ['volunteer', 'weekend', 'tree', 'join', 'help'],
        answer: 'Two major on-ground events are recruiting: Western Ghats Native Afforestation (15 slots left in Pune) and Dharavi Night Transit (8 volunteers needed in Mumbai).',
        actionLabel: 'Browse Volunteer Roles',
        actionType: 'browse',
        metrics: 'Verified NGO Hours'
      }
    ]
  }
};

export default function VoiceAssistantModal({
  isOpen,
  onClose,
  onOpenDonate,
  onOpenChain
}: VoiceAssistantModalProps) {
  const [lang, setLang] = useState<Language>('hi');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [currentQuery, setCurrentQuery] = useState<string>('');
  const [conversation, setConversation] = useState<AssistantResponse[]>([
    {
      query: 'प्लेटफॉर्म कैसे काम करता है?',
      response: 'नमस्ते! ओपन-इम्पैक्ट पर आप एनजीओ के हर काम का जीपीएस फोटो और बिल देख सकते हैं। आप कोई भी सवाल पूछ सकते हैं!',
      suggestedAction: {
        label: '⛓️ इम्पैक्ट चेन देखें',
        actionType: 'chain'
      }
    }
  ]);
  const [audioWaves, setAudioWaves] = useState<number[]>([40, 20, 60, 80, 30, 70, 50, 90]);

  // Simulated audio waveform animation when active
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isListening) {
      interval = setInterval(() => {
        setAudioWaves([
          Math.floor(Math.random() * 80) + 20,
          Math.floor(Math.random() * 95) + 15,
          Math.floor(Math.random() * 70) + 30,
          Math.floor(Math.random() * 90) + 10,
          Math.floor(Math.random() * 60) + 25,
          Math.floor(Math.random() * 85) + 20,
          Math.floor(Math.random() * 75) + 15,
          Math.floor(Math.random() * 95) + 20,
        ]);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isListening]);

  if (!isOpen) return null;

  const currentKB = KNOWLEDGE_BASE[lang];

  const handleStartListening = () => {
    setIsListening(true);
    // If Web Speech API is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        const SpeechRecognition = (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
          (window as unknown as { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const spokenText = event.results[0][0].transcript;
          setCurrentQuery(spokenText);
          setIsListening(false);
          processUserQuery(spokenText);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch (e) {
        console.warn('SpeechRecognition error or fallback triggered', e);
      }
    }

    // Fallback simulated voice listening for demo
    setTimeout(() => {
      setIsListening(false);
      const randomPrompt = currentKB.samples[Math.floor(Math.random() * currentKB.samples.length)].query;
      setCurrentQuery(randomPrompt);
      processUserQuery(randomPrompt);
    }, 2800);
  };

  const processUserQuery = (queryText: string) => {
    const qLower = queryText.toLowerCase();
    const match = currentKB.matchResponses.find(item => 
      item.keywords.some(kw => qLower.includes(kw.toLowerCase()))
    ) || currentKB.matchResponses[0];

    const newResponse: AssistantResponse = {
      query: queryText,
      response: match.answer,
      metrics: match.metrics,
      suggestedAction: match.actionLabel ? {
        label: match.actionLabel,
        actionType: match.actionType || 'chain',
        fundraiserId: match.actionType === 'donate' ? 'fund-2' : undefined
      } : undefined
    };

    setConversation(prev => [newResponse, ...prev]);

    // Optional text to speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(match.answer);
        utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error', err);
      }
    }
  };

  const handleActionClick = (action?: AssistantResponse['suggestedAction']) => {
    if (!action) return;
    onClose();
    if (action.actionType === 'chain' && onOpenChain) {
      onOpenChain();
    } else if (action.actionType === 'donate' && onOpenDonate) {
      onOpenDonate(action.fundraiserId || 'fund-1');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-amber-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-inner">
              <Sparkles className="w-6 h-6 text-amber-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">Saathi AI Voice Assistant</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/25 uppercase tracking-wide">
                  Multi-lingual
                </span>
              </div>
              <p className="text-xs text-amber-100 mt-0.5">
                बोलो और जानो — Ask in Hindi, Marathi, or English
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex bg-black/20 rounded-xl p-0.5 border border-white/20">
              <button
                type="button"
                onClick={() => setLang('hi')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${lang === 'hi' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'}`}
              >
                हिंदी
              </button>
              <button
                type="button"
                onClick={() => setLang('mr')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${lang === 'mr' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'}`}
              >
                मराठी
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${lang === 'en' ? 'bg-white text-orange-600 shadow' : 'text-white/80 hover:text-white'}`}
              >
                ENG
              </button>
            </div>

            <button 
              onClick={() => {
                if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                onClose();
              }}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-gradient-to-b from-orange-50/30 to-white">
          
          {/* Active Voice Listening Display */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-rose-500/10 rounded-2xl p-6 border border-orange-200/60 text-center flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[11px] text-amber-700 font-medium">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice Accessibility</span>
            </div>

            {/* Mic Pulse Button */}
            <div className="relative my-2">
              {isListening && (
                <div className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-30"></div>
              )}
              <button
                type="button"
                onClick={handleStartListening}
                disabled={isListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl ${
                  isListening 
                    ? 'bg-rose-500 text-white scale-110 shadow-rose-300' 
                    : 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white hover:scale-105 shadow-orange-200'
                }`}
              >
                {isListening ? (
                  <Mic className="w-9 h-9 animate-bounce" />
                ) : (
                  <Mic className="w-9 h-9" />
                )}
              </button>
            </div>

            {/* Audio Waveform */}
            {isListening ? (
              <div className="flex items-center justify-center gap-1.5 h-8 my-2">
                {audioWaves.map((height, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-orange-500 rounded-full transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="h-8 my-2 flex items-center text-xs text-gray-500 font-medium">
                माइक दबाएं और बोलें / Click Mic to Speak
              </div>
            )}

            <p className="text-sm font-semibold text-gray-800">
              {isListening ? currentKB.listening : 'Speak naturally in your preferred language'}
            </p>
            <p className="text-xs text-gray-500 mt-1 max-w-md">
              Accessible for elderly donors, rural volunteers, and hands-free community triage.
            </p>
          </div>

          {/* Quick Prompts / Suggested Questions */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2 flex items-center gap-1.5">
              <span>Quick Tap Suggestions</span>
              <span className="text-gray-400 font-normal">({lang.toUpperCase()})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentKB.samples.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setCurrentQuery(item.query);
                    processUserQuery(item.query);
                  }}
                  className="p-3 text-left rounded-xl bg-white border border-gray-200/80 hover:border-orange-400 hover:bg-orange-50/40 text-xs font-medium text-gray-700 transition-all flex items-center justify-between shadow-xs group"
                >
                  <span className="truncate pr-2 font-semibold text-gray-900 group-hover:text-orange-700">{item.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Assistant Conversation History */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Live Voice Dialogue
            </div>

            {conversation.map((item, idx) => (
              <div key={idx} className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                {/* User query bubble */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    आप
                  </div>
                  <div className="text-xs font-semibold text-gray-800 bg-orange-50/70 px-3 py-1.5 rounded-xl border border-orange-100 inline-block">
                    "{item.query}"
                  </div>
                </div>

                {/* Assistant Answer */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    AI
                  </div>
                  <div className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100 w-full space-y-2">
                    <p>{item.response}</p>
                    
                    {item.metrics && (
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100/80 text-emerald-800 text-[11px] font-bold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{item.metrics}</span>
                      </div>
                    )}

                    {item.suggestedAction && (
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleActionClick(item.suggestedAction)}
                          className="px-3 py-1.5 rounded-lg bg-orange-600 text-white font-semibold text-xs hover:bg-orange-700 flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>{item.suggestedAction.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="font-medium text-gray-700">Real-time Multilingual Engine</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
          >
            Close / बंद करें
          </button>
        </div>

      </div>
    </div>
  );
}
