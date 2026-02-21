
import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProducerHub from './components/ProducerHub';
import Sentinelle from './components/Sentinelle';
import Marketplace from './components/Marketplace';
import Logistics from './components/Logistics';
import SGGPortal from './components/SGGPortal';
import BlockchainTracker from './components/BlockchainTracker';
import AdminFinance from './components/AdminFinance';
import MediaKit from './components/MediaKit';
import LiveAssistant from './components/LiveAssistant';
import AuthGateway from './components/AuthGateway';
import BuyerHub from './components/BuyerHub';
import { dbService } from './services/db';
import { Language, t } from './services/i18n';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER' | null>(null);
  const [isDbReady, setIsDbReady] = useState(false);
  const [language, setLanguage] = useState<Language>('FR');
  
  const [history, setHistory] = useState<View[]>([View.DASHBOARD]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const currentView = history[historyIndex];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dbService.init().then(() => {
      setIsDbReady(true);
      console.log("G-AS Database Engine: ACTIVE");
    });
  }, []);

  const handleLogin = (role: 'PRODUCER' | 'INVESTOR' | 'BANKER' | 'BUYER') => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === 'PRODUCER') handleNavigate(View.PRODUCER_HUB);
    else if (role === 'BANKER') handleNavigate(View.SGG_PORTAL);
    else if (role === 'BUYER') handleNavigate(View.BUYER_HUB);
    else handleNavigate(View.MARKETPLACE);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setHistory([View.DASHBOARD]);
    setHistoryIndex(0);
    setIsSidebarOpen(false);
  };

  const renderContent = () => {
    if (!isDbReady) return <div className="flex items-center justify-center h-full text-slate-400 font-black italic">Initialisation DB...</div>;

    switch (currentView) {
      case View.DASHBOARD: return <Dashboard lang={language} />;
      case View.PRODUCER_HUB: return <ProducerHub lang={language} />;
      case View.SENTINELLE: return <Sentinelle lang={language} />;
      case View.MARKETPLACE: return <Marketplace lang={language} />;
      case View.LOGISTICS: return <Logistics lang={language} />;
      case View.SGG_PORTAL: return <SGGPortal lang={language} />;
      case View.BLOCKCHAIN: return <BlockchainTracker lang={language} />;
      case View.ADMIN_FINANCE: return <AdminFinance lang={language} />;
      case View.MEDIA_KIT: return <MediaKit lang={language} />;
      case View.BUYER_HUB: return <BuyerHub lang={language} />;
      default: return <Dashboard lang={language} />;
    }
  };

  const handleNavigate = (view: View) => {
    if (view === currentView) return;
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, view]);
    setHistoryIndex(newHistory.length);
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) return <AuthGateway onLogin={handleLogin} lang={language} setLang={setLanguage} />;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar 
        currentView={currentView} onNavigate={handleNavigate} isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} userRole={userRole} onLogout={handleLogout}
        lang={language}
      />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 relative pb-24">
        <header className="mb-4 flex items-center justify-between gap-4 bg-white/70 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] border border-white shadow-lg sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-900 text-white rounded-xl">☰</button>
            <div>
              <h1 className="text-lg md:text-xl font-black text-slate-800 uppercase italic leading-none">{currentView.replace('_', ' ')}</h1>
              <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5 italic">Gabon Agri-Sentinel • {userRole}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-slate-100 p-1 rounded-lg flex">
              {(['FR', 'EN', 'ES'] as Language[]).map(l => (
                <button 
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`px-2 py-1 rounded-md text-[8px] font-black transition-all ${language === l ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <button onClick={handleLogout} className="px-4 py-2 bg-red-50 text-red-600 rounded-[1.2rem] text-[9px] font-black uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all whitespace-nowrap">
              🚪 {t('logout', language)}
            </button>
          </div>
        </header>
        {renderContent()}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998] flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-[2rem] border border-white/10 shadow-2xl">
          <button onClick={() => historyIndex > 0 && setHistoryIndex(historyIndex - 1)} className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-all text-sm">←</button>
          <button onClick={() => handleNavigate(View.DASHBOARD)} className="w-10 h-10 rounded-full flex items-center justify-center bg-green-600 text-white shadow-lg shadow-green-900/20 transition-all text-sm">🏠</button>
          <button onClick={() => historyIndex < history.length - 1 && setHistoryIndex(historyIndex + 1)} className="w-10 h-10 rounded-full flex items-center justify-center text-white bg-white/10 hover:bg-white/20 transition-all text-sm">→</button>
        </div>
        <LiveAssistant lang={language} />
      </main>
    </div>
  );
};

export default App;
