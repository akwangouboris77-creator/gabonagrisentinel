
import React from 'react';
import { View } from '../types';
import { Language, t } from '../services/i18n';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen?: boolean;
  onClose?: () => void;
  userRole?: 'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER' | null;
  onLogout?: () => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, isOpen, onClose, userRole, onLogout, lang }) => {
  const navItems = [
    { id: View.DASHBOARD, label: t('dashboard', lang), icon: '📊', roles: ['PRODUCER', 'INVESTOR', 'BANKER', 'BUYER'] },
    { id: View.BUYER_HUB, label: t('buyer_hub', lang), icon: '🛒', roles: ['BUYER', 'BANKER'] },
    { id: View.PRODUCER_HUB, label: t('producer_hub', lang), icon: '🌱', roles: ['PRODUCER', 'BANKER'] },
    { id: View.SENTINELLE, label: t('sentinelle', lang), icon: '🚁', roles: ['PRODUCER', 'BANKER', 'BUYER'] },
    { id: View.MARKETPLACE, label: t('marketplace', lang), icon: '💎', roles: ['INVESTOR', 'PRODUCER', 'BANKER'] },
    { id: View.LOGISTICS, label: t('logistics', lang), icon: '🚛', roles: ['PRODUCER', 'BANKER', 'BUYER'] },
    { id: View.SGG_PORTAL, label: t('sgg_portal', lang), icon: '🛡️', roles: ['BANKER'] },
    { id: View.BLOCKCHAIN, label: t('blockchain', lang), icon: '⛓️', roles: ['PRODUCER', 'INVESTOR', 'BANKER', 'BUYER'] },
    { id: View.MEDIA_KIT, label: t('media_kit', lang), icon: '🏢', roles: ['INVESTOR', 'PRODUCER', 'BUYER'] },
  ];

  const filteredItems = navItems.filter(item => userRole && item.roles.includes(userRole));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 text-white flex flex-col z-[101] transition-transform duration-500 ease-in-out border-r border-white/5 md:relative md:translate-x-0 md:flex md:w-64 lg:w-72 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 border-b border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500 rounded-2xl flex items-center justify-center font-black italic shadow-lg">AS</div>
            <div>
              <span className="text-lg font-black tracking-tight block leading-none">AGRI-SENTINEL</span>
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.4em]">Souveraineté 2026</span>
            </div>
          </div>
          <div className="mt-6 py-2 px-4 bg-white/5 rounded-xl border border-white/10">
             <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t('session', lang)}</p>
             <p className="text-[10px] font-black text-green-500 uppercase italic">{userRole}</p>
          </div>
        </div>
        <nav className="flex-1 p-6 space-y-1 overflow-y-auto no-scrollbar">
          {filteredItems.map((item) => (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-[1.25rem] transition-all relative group ${currentView === item.id ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[11px] uppercase font-black tracking-wider text-left">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-6">
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase text-slate-500 hover:bg-red-500/10 hover:text-red-500 transition-all border border-white/5">🚪 {t('logout', lang)}</button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
