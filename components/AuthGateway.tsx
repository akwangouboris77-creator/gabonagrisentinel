
import React, { useState } from 'react';
import { Language, t } from '../services/i18n';

interface AuthGatewayProps {
  onLogin: (role: 'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER') => void;
  lang: Language;
  setLang: (l: Language) => void;
}

const AuthGateway: React.FC<AuthGatewayProps> = ({ onLogin, lang, setLang }) => {
  const [selectedRole, setSelectedRole] = useState<'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER' | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [step, setStep] = useState<'SELECT' | 'IDENTIFY' | 'SUCCESS'>('SELECT');

  const handleRoleSelect = (role: 'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER') => {
    setSelectedRole(role);
    setStep('IDENTIFY');
  };

  const startVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('SUCCESS');
      setTimeout(() => {
        if (selectedRole) onLogin(selectedRole);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-6 overflow-y-auto">
      <div className="absolute top-8 right-8 z-[100] flex bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
        {(['FR', 'EN', 'ES'] as Language[]).map(l => (
          <button 
            key={l}
            onClick={() => setLang(l)}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${lang === l ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#10b981_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,#3b82f6_0%,transparent_50%)]"></div>
      </div>

      <div className="w-full max-w-6xl relative z-10">
        <div className="text-center mb-16 animate-in fade-in slide-in-from-top-10 duration-700">
           <div className="w-20 h-20 bg-green-500 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white italic shadow-2xl shadow-green-900/40 mx-auto mb-6">AS</div>
           <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">{t('auth_title', lang)}</h1>
           <p className="text-slate-500 font-black uppercase tracking-[0.4em] mt-4">{t('auth_subtitle', lang)}</p>
        </div>

        {step === 'SELECT' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            {[
              { id: 'PRODUCER', label: t('producer', lang), icon: '🌾', color: 'bg-green-600' },
              { id: 'BUYER', label: t('buyer', lang), icon: '🛒', color: 'bg-amber-500' },
              { id: 'INVESTOR', label: t('investor', lang), icon: '💎', color: 'bg-blue-600' },
              { id: 'BANKER', label: t('banker', lang), icon: '🛡️', color: 'bg-slate-800' }
            ].map((role) => (
              <button
                key={role.id}
                onClick={() => handleRoleSelect(role.id as any)}
                className="bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 text-center group hover:bg-white hover:border-white transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`w-20 h-20 ${role.color} rounded-[2rem] flex items-center justify-center text-3xl mx-auto mb-6 shadow-2xl group-hover:scale-110 transition-transform text-white`}>
                  {role.icon}
                </div>
                <h3 className="text-xl font-black text-white group-hover:text-slate-900 uppercase tracking-tighter mb-2">{role.label}</h3>
                <p className="text-slate-500 group-hover:text-slate-400 text-[10px] font-bold uppercase tracking-widest italic">{t('identify_as', lang)}</p>
              </button>
            ))}
          </div>
        )}

        {step === 'IDENTIFY' && selectedRole && (
          <div className="max-w-xl mx-auto bg-white rounded-[4rem] p-12 shadow-2xl animate-in zoom-in-95 duration-500">
             <button onClick={() => setStep('SELECT')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8 hover:text-slate-800 flex items-center gap-2">← {t('back', lang)}</button>
             <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic mb-8 text-center">{t('identify_as', lang)} {t(selectedRole.toLowerCase() as any, lang)}</h2>
             <div className="space-y-6">
                <input type="text" placeholder="ID / RCCM" className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none" />
                <button onClick={startVerification} className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-4 hover:scale-[1.02] transition-all">
                  {isVerifying ? t('verifying', lang) : t('verify_button', lang)}
                </button>
             </div>
          </div>
        )}

        {step === 'SUCCESS' && (
          <div className="text-center py-20 animate-in zoom-in-95 duration-500 text-white">
             <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-2xl shadow-green-900/40 mb-10 animate-bounce">✓</div>
             <h2 className="text-5xl font-black tracking-tighter uppercase italic">{t('success_auth', lang)}</h2>
             <p className="text-slate-400 font-black uppercase tracking-[0.4em] mt-4">{t('opening_terminal', lang)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthGateway;
