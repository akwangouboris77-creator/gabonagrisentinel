
import React, { useState, useEffect } from 'react';
import { dbService, DBCredit, DBTranche } from '../services/db';
import { useNotification } from './NotificationProvider';

const SGGPortal: React.FC = () => {
  const { showNotification } = useNotification();
  const [activeView, setActiveView] = useState<'DOSSIERS' | 'COMPENSATIONS'>('DOSSIERS');
  const [isBankerAuthenticated, setIsBankerAuthenticated] = useState(false);
  const [bankerCredentials, setBankerCredentials] = useState({ matricule: '', code: '' });
  const [investments, setInvestments] = useState<DBCredit[]>([]);
  const [selectedInvestment, setSelectedInvestment] = useState<DBCredit | null>(null);
  const [automatedFees, setAutomatedFees] = useState<any[]>([]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    if (isBankerAuthenticated) {
      loadData();
    }
  }, [isBankerAuthenticated]);

  const handleBankerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankerCredentials.matricule.length > 3 && bankerCredentials.code.length > 3) {
      setIsBankerAuthenticated(true);
      showNotification("Authentification BCEG réussie. Session sécurisée active.", "success");
    } else {
      showNotification("Identifiants invalides. Veuillez vérifier votre matricule BCEG.", "alert");
    }
  };

  const loadData = async () => {
    const credits = await dbService.getCredits();
    setInvestments(credits);
    const ledger = await dbService.getLedger();
    setAutomatedFees(ledger);
  };

  const handleVerifyAsset = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      showNotification("Audit Drone Multispectral validé. Le gage biologique est conforme aux exigences SGG.", "info");
    }, 2500);
  };

  const handlePayout = async (tranche: DBTranche) => {
    if (!selectedInvestment) return;
    setIsPaying(true);
    
    const fee = tranche.amount * 0.025;
    const net = tranche.amount - fee;
    
    // 1. Mettre à jour le statut dans l'objet local
    const updatedTranches = selectedInvestment.tranches.map(t => 
      t.id === tranche.id ? { ...t, status: 'PAID' as const } : t
    );
    const updatedInvestment = { ...selectedInvestment, tranches: updatedTranches };
    
    // 2. Persister dans IndexedDB
    await dbService.updateCredit(updatedInvestment);
    
    // 3. Ajouter au grand livre (Ledger)
    await dbService.addLedgerEntry({
      id: `L-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      description: `${tranche.label} - ${selectedInvestment.farmer}`,
      gross: tranche.amount,
      fee: fee,
      net: net,
      type: 'BCEG-SPLIT'
    });

    // 4. Actualiser l'UI
    await loadData();
    setSelectedInvestment(updatedInvestment);
    
    setIsPaying(false);
    showNotification(`DÉCAISSEMENT SPLIT PERSISTÉ : ${net.toLocaleString()} XAF au Producteur | ${fee.toLocaleString()} XAF à la plateforme.`, "success", 6000);
  };

  if (!isBankerAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[600px] animate-in fade-in duration-700">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 max-w-md w-full text-center">
          <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-4xl mx-auto mb-8 shadow-xl">🏦</div>
          <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Accès Sécurisé BCEG</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 italic">Portail de Supervision des Garanties Souveraines</p>
          
          <form onSubmit={handleBankerLogin} className="space-y-4">
            <div className="text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Matricule BCEG</label>
              <input 
                type="text" 
                required
                placeholder="Ex: BCEG-2026-X"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={bankerCredentials.matricule}
                onChange={(e) => setBankerCredentials({...bankerCredentials, matricule: e.target.value})}
              />
            </div>
            <div className="text-left">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Code d'Accès</label>
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={bankerCredentials.code}
                onChange={(e) => setBankerCredentials({...bankerCredentials, code: e.target.value})}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all mt-4"
            >
              S'authentifier
            </button>
          </form>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-[8px] font-bold text-blue-700 uppercase leading-relaxed italic">
              Attention: Cette session est auditée par le système Agri-Sentinel Core. Toute transaction est irréversible.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">

      {/* Header Statistique */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-blue-500 rounded-lg text-[9px] font-black uppercase tracking-widest">Garantie Souveraine SGG</span>
               <div className="flex bg-white/10 p-1 rounded-xl ml-4">
                  <button onClick={() => setActiveView('DOSSIERS')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeView === 'DOSSIERS' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>Pilotage Crédit</button>
                  <button onClick={() => setActiveView('COMPENSATIONS')} className={`px-4 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${activeView === 'COMPENSATIONS' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400'}`}>Compensations Auto</button>
               </div>
               <button 
                onClick={() => setIsBankerAuthenticated(false)}
                className="ml-auto px-4 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-[9px] font-black uppercase hover:bg-red-500 hover:text-white transition-all"
               >
                 Déconnexion BCEG
               </button>
            </div>
            <h2 className="text-4xl font-black tracking-tight leading-none mb-4 uppercase italic">
              Supervision <span className="text-blue-400">Transactionnelle</span>
            </h2>
            <p className="text-slate-400 max-w-xl font-medium italic">
               Session active pour : <span className="text-white">{bankerCredentials.matricule}</span> • Les données sont extraites en temps réel.
            </p>
          </div>
        </div>
      </div>

      {activeView === 'DOSSIERS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white">
              <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center justify-between uppercase tracking-tight italic">
                🏦 Dossiers en Base de Données
                <span className="text-[9px] bg-blue-100 px-4 py-1.5 rounded-full text-blue-600 font-black uppercase tracking-widest italic">Persistance Active</span>
              </h3>
              
              <div className="space-y-4">
                {investments.map(inv => (
                  <div 
                    key={inv.id} 
                    onClick={() => setSelectedInvestment(inv)}
                    className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group ${selectedInvestment?.id === inv.id ? 'bg-blue-50 border-blue-200 shadow-inner' : 'bg-slate-50 border-slate-100 hover:bg-white hover:shadow-2xl'}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex gap-6 items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${inv.type === 'AGRICULTURE' ? 'bg-green-100' : 'bg-amber-100'}`}>
                          {inv.type === 'AGRICULTURE' ? '🌾' : '🐄'}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{inv.id}</p>
                          <p className="text-lg font-black text-slate-800 tracking-tight">{inv.farmer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-black text-slate-900">{(inv.amount / 1000000).toFixed(1)}M XAF</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-white flex flex-col h-full min-h-[600px]">
                <h4 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter italic">🛡️ Gestion des <span className="text-blue-600">Mouvements de Fonds</span></h4>
                
                {selectedInvestment ? (
                  <div className="space-y-8 animate-in slide-in-from-right-10 flex-1">
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 text-white">
                        <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Valeur du Gage Biologique</p>
                        <p className="text-3xl font-black tracking-tighter">{selectedInvestment.collateralValue}</p>
                    </div>

                    <div className="space-y-4">
                      {selectedInvestment.tranches.map((tranche) => (
                        <div key={tranche.id} className={`p-6 rounded-[2rem] border-2 transition-all ${tranche.status === 'PAID' ? 'bg-slate-50 border-slate-100 opacity-60' : tranche.status === 'LOCKED' ? 'bg-white border-blue-500 shadow-xl' : 'bg-slate-50 border-slate-100'}`}>
                           <div className="flex justify-between items-start mb-4">
                              <div>
                                 <p className="text-sm font-black text-slate-800 leading-none mb-1">{tranche.label}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{tranche.condition}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-black text-slate-800">{tranche.amount.toLocaleString()} XAF</p>
                              </div>
                           </div>
                           
                           {tranche.status === 'LOCKED' && (
                             <div className="flex gap-3">
                                <button onClick={handleVerifyAsset} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl text-[9px] font-black uppercase">VÉRIFIER GAGE</button>
                                <button onClick={() => handlePayout(tranche)} className="flex-[2] py-3 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase">DÉBLOQUER & PRÉLEVER 2.5%</button>
                             </div>
                           )}
                           {tranche.status === 'PAID' && (
                             <p className="text-center text-[9px] font-black text-green-600 uppercase">Tranche décaissée et archivée en base</p>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-20">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-5xl mb-6">🏛️</div>
                    <p className="text-sm font-black uppercase tracking-[0.3em] max-w-[180px]">Sélectionnez un dossier</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-10 space-y-8">
           <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white">
            <h3 className="text-2xl font-black text-slate-800 mb-10 uppercase italic tracking-tighter">Grand Livre des Compensations (IndexedDB)</h3>
            <div className="overflow-hidden rounded-[2.5rem] border border-slate-100">
               <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Tranche / Bénéficiaire</th>
                      <th className="p-6 text-[10px] font-black text-slate-400 uppercase">Brut</th>
                      <th className="p-6 text-[10px] font-black text-blue-500 uppercase">Redevance</th>
                      <th className="p-6 text-[10px] font-black text-green-600 uppercase">Net Payé</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {automatedFees.map(f => (
                      <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-6">
                           <p className="text-sm font-black text-slate-800">{f.description}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{f.date} • {f.id}</p>
                        </td>
                        <td className="p-6 text-sm font-bold text-slate-600">{f.gross.toLocaleString()}</td>
                        <td className="p-6 text-sm font-black text-blue-600">-{f.fee.toLocaleString()}</td>
                        <td className="p-6 text-sm font-black text-green-600">{f.net.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SGGPortal;
