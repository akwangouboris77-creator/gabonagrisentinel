
import React, { useState, useEffect } from 'react';
import { dbService, DBAsset } from '../services/db';

type Step = 'WELCOME' | 'PROFILE' | 'AGREEMENT' | 'LOCATION' | 'EQUIPMENT' | 'FINISH';
type HubTab = 'ASSETS' | 'SUBSCRIPTION' | 'FINANCE';

const ProducerHub: React.FC = () => {
  const [step, setStep] = useState<Step>('WELCOME');
  const [activeTab, setActiveTab] = useState<HubTab>('ASSETS');
  const [userProfile, setUserProfile] = useState<'AGRI' | 'LIVESTOCK' | null>(null);
  const [isCertified, setIsCertified] = useState(false);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [agreementVerified, setAgreementVerified] = useState(false);
  const [scanMessage, setScanMessage] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [myAssets, setMyAssets] = useState<DBAsset[]>([]);

  useEffect(() => {
    if (isCertified) {
      loadAssets();
    }
  }, [isCertified]);

  const loadAssets = async () => {
    const assets = await dbService.getAssets();
    setMyAssets(assets);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const pricingPlans = [
    { 
      id: 'FAM', 
      name: 'FAMILIAL', 
      price: 5000, 
      features: ['Météo Précision', '1 Scan Drone / mois', 'Support IA Basique'],
      usage: { drones: 40, connectivity: 30, ia: 15, blockchain: 15 },
      color: 'from-slate-700 to-slate-900'
    },
    { 
      id: 'PME', 
      name: 'COOPÉRATIVE / PME', 
      price: 25000, 
      features: ['Audit IA Complet', 'Monitoring Hebdo', 'Priorité Logistique', 'Tokenisation'],
      usage: { drones: 45, connectivity: 25, ia: 20, blockchain: 10 },
      color: 'from-green-600 to-green-800'
    },
    { 
      id: 'IND', 
      name: 'AGRO-INDUSTRIEL', 
      price: 150000, 
      features: ['IoT Temps-Réel', 'Scan Drone Quotidien', 'Assurance SGG 100%', 'Dashboard SGG'],
      usage: { drones: 35, connectivity: 35, ia: 20, blockchain: 10 },
      color: 'from-blue-600 to-blue-800'
    }
  ];

  const handleDroneRequest = () => {
    setIsProcessing('DRONE');
    setTimeout(() => {
      setIsProcessing(null);
      setToast("Demande de drone enregistrée. Survol prévu dans les 12h.");
    }, 2000);
  };

  const handleVerifyAgreement = () => {
    setIsProcessing('AGREEMENT_SCAN');
    setScanMessage("Initialisation du scanner optique...");
    
    const messages = [
      "Détection des bordures du document...",
      "Extraction du numéro d'Agrément PME...",
      "Vérification de l'authenticité (Blockchain SGG)...",
      "Validation de l'identité du producteur..."
    ];

    messages.forEach((msg, index) => {
      setTimeout(() => setScanMessage(msg), (index + 1) * 800);
    });

    setTimeout(() => {
      setIsProcessing(null);
      setAgreementVerified(true);
      setToast("Agrément PME Authentifié ✓");
    }, 4000);
  };

  const handleSubscribe = (plan: any) => {
    setSelectedPlan(plan);
    setShowPayModal(true);
  };

  const executeSubscription = () => {
    setIsProcessing('PAYMENT');
    setTimeout(() => {
      setIsProcessing(null);
      setShowPayModal(false);
      setToast(`Abonnement ${selectedPlan.name} activé. Infrastructure mobilisée.`);
    }, 2500);
  };

  const renderWelcome = () => (
    <div className="space-y-8 text-center py-12 animate-in zoom-in-95">
      <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-green-900/20 text-white">🌱</div>
      <div>
        <h2 className="text-4xl font-black text-slate-800 tracking-tight italic uppercase">Accès Producteur</h2>
        <p className="text-slate-400 font-bold uppercase tracking-widest mt-2 italic">L'infrastructure de votre souveraineté</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:scale-105 transition-all cursor-pointer group" onClick={() => { setUserProfile('AGRI'); setStep('PROFILE'); }}>
           <span className="text-5xl block mb-4 group-hover:animate-bounce">🌾</span>
           <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">Je suis Agriculteur</p>
           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Cultures, fruits et légumes</p>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:scale-105 transition-all cursor-pointer group" onClick={() => { setUserProfile('LIVESTOCK'); setStep('PROFILE'); }}>
           <span className="text-5xl block mb-4 group-hover:animate-bounce">🐄</span>
           <p className="text-xl font-black text-slate-800 uppercase tracking-tighter">Je suis Éleveur</p>
           <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Bétail, volaille, porcs</p>
        </div>
      </div>
      <button onClick={() => setIsCertified(true)} className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] hover:text-slate-800 transition-colors">Déjà inscrit ? Accéder à mon Espace</button>
    </div>
  );

  const renderSubscription = () => (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="relative z-10">
          <h3 className="text-3xl font-black tracking-tighter uppercase italic mb-4">Abonnement à la Souveraineté</h3>
          <p className="text-slate-400 max-w-2xl font-medium italic leading-relaxed">
            Votre contribution couvre les frais de maintenance de la flotte de drones, la connectivité Starlink haut-débit et l'infrastructure de données Blockchain sécurisée.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {pricingPlans.map(plan => (
          <div key={plan.id} className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col justify-between hover:shadow-2xl transition-all group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${plan.color} opacity-5 rounded-full blur-3xl -mr-12 -mt-12`}></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{plan.name}</p>
              <div className="flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-black text-slate-800 tracking-tighter">{plan.price.toLocaleString()}</span>
                <span className="text-xs font-black text-slate-400 uppercase">XAF / MOIS</span>
              </div>
              
              <div className="space-y-4 mb-10">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-bold text-slate-600">
                    <span className="w-5 h-5 rounded-lg bg-green-100 text-green-600 flex items-center justify-center text-[10px]">✓</span>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="pt-6 border-t border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-4 tracking-widest text-center">Répartition des charges (%)</p>
                 <div className="h-2 w-full bg-slate-100 rounded-full flex overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${plan.usage.drones}%` }} title="Drones"></div>
                    <div className="h-full bg-amber-400" style={{ width: `${plan.usage.connectivity}%` }} title="Starlink"></div>
                    <div className="h-full bg-green-500" style={{ width: `${plan.usage.ia}%` }} title="IA"></div>
                    <div className="h-full bg-slate-800" style={{ width: `${plan.usage.blockchain}%` }} title="Blockchain"></div>
                 </div>
                 <div className="mt-3 flex justify-between text-[7px] font-black text-slate-400 uppercase tracking-tighter">
                   <span>Drone</span>
                   <span>Uplink</span>
                   <span>IA</span>
                   <span>Chain</span>
                 </div>
              </div>

              <button 
                onClick={() => handleSubscribe(plan)}
                className={`w-full py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all shadow-xl group-hover:scale-105 ${plan.id === 'PME' ? 'bg-green-600 text-white shadow-green-900/20' : 'bg-slate-900 text-white'}`}
              >
                Activer ce Pack
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOnboarding = () => (
    <div className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-bottom-10">
       <div className="text-center">
         <div className="flex justify-center gap-2 mb-8">
            {['PROFILE', 'AGREEMENT', 'LOCATION', 'EQUIPMENT', 'FINISH'].map((s, i) => (
              <div key={s} className={`h-1.5 w-10 rounded-full ${step === s ? 'bg-green-500 shadow-lg' : i < ['PROFILE', 'AGREEMENT', 'LOCATION', 'EQUIPMENT', 'FINISH'].indexOf(step) ? 'bg-green-200' : 'bg-slate-200'}`}></div>
            ))}
         </div>
         <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">
           {step === 'PROFILE' && "Détails de l'Exploitation"}
           {step === 'AGREEMENT' && "Agrément PME / Certificat"}
           {step === 'LOCATION' && "Localisation Tactique"}
           {step === 'EQUIPMENT' && "Équipement IoT & Balises"}
           {step === 'FINISH' && "Certification Initiale"}
         </h2>
       </div>

       <div className="bg-white p-12 rounded-[4rem] shadow-2xl border border-white space-y-8">
          {step === 'PROFILE' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type de Production</label>
                 <select className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors">
                    {userProfile === 'AGRI' ? (
                      <><option>Manioc</option><option>Banane Plantain</option><option>Maraîchage</option></>
                    ) : (
                      <><option>Bovins (Viande)</option><option>Porcins</option><option>Volaille</option></>
                    )}
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacité Estimée</label>
                 <input type="text" placeholder={userProfile === 'AGRI' ? "Hectares" : "Nombre de têtes"} className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-black outline-none focus:ring-2 focus:ring-green-500/20" />
               </div>
               <button onClick={() => setStep('AGREEMENT')} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl mt-4 hover:bg-slate-800 transition-all active:scale-95">Étape Suivante</button>
            </div>
          )}

          {step === 'AGREEMENT' && (
            <div className="space-y-8 text-center animate-in fade-in duration-500">
              <div className={`relative h-80 rounded-[3.5rem] border-4 border-dashed overflow-hidden flex flex-col items-center justify-center transition-all duration-700 ${agreementVerified ? 'bg-green-50 border-green-500 shadow-inner' : 'bg-slate-50 border-slate-200'}`}>
                {isProcessing === 'AGREEMENT_SCAN' && (
                  <>
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/10">
                      <div className="h-1 bg-green-500 w-full animate-[bounce_2s_infinite] shadow-[0_0_20px_rgba(34,197,94,1)]"></div>
                    </div>
                    <div className="absolute bottom-10 left-0 right-0 z-30 flex flex-col items-center gap-2">
                       <p className="text-[11px] font-black text-slate-800 uppercase bg-white/90 px-6 py-2 rounded-full shadow-lg border border-slate-100 animate-pulse">{scanMessage}</p>
                    </div>
                  </>
                )}
                
                {agreementVerified ? (
                  <div className="animate-in zoom-in-95 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-4xl text-white shadow-xl mb-6 animate-bounce">✓</div>
                    <p className="text-xl font-black text-green-600 uppercase tracking-tight">Vérification Réussie</p>
                    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">ID G-AS Certifié: PME-GAB-2026-X</p>
                  </div>
                ) : !isProcessing && (
                  <div className="text-center p-8 opacity-60">
                    <span className="text-7xl block mb-6 animate-pulse">📄</span>
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest max-w-[200px] mx-auto">Veuillez scanner l'original de votre Agrément PME Gabon</p>
                  </div>
                )}
              </div>

              {!agreementVerified ? (
                <button 
                  onClick={handleVerifyAgreement}
                  disabled={isProcessing === 'AGREEMENT_SCAN'}
                  className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-95"
                >
                  {isProcessing === 'AGREEMENT_SCAN' ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> ANALYSE EN COURS</>
                  ) : "Lancer le Scan IA"}
                </button>
              ) : (
                <button onClick={() => setStep('LOCATION')} className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl animate-in fade-in hover:bg-green-500 transition-all">Continuer vers Localisation</button>
              )}
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Technologie de Reconnaissance Documentaire G-AS IA</p>
            </div>
          )}

          {step === 'LOCATION' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <div className="aspect-video bg-slate-950 rounded-[3rem] border border-slate-900 flex items-center justify-center text-slate-400 overflow-hidden relative shadow-2xl group">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=1200')] bg-cover opacity-60 group-hover:scale-110 transition-transform duration-[10s]"></div>
                   <div className="relative z-10 text-center p-10 bg-white/95 backdrop-blur-md rounded-3xl mx-10 border border-white shadow-2xl">
                      <div className="text-3xl mb-3">📍</div>
                      <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Ntoum - Secteur Estuaire</p>
                      <p className="text-[9px] text-slate-500 uppercase font-black mt-1 tracking-widest">Coordonnées GPS Fixées ✓</p>
                   </div>
                   <div className="absolute top-6 right-6 z-20 px-4 py-2 bg-green-500 rounded-full text-[9px] font-black text-white uppercase shadow-lg">Signal HD Strong</div>
                </div>
                <button onClick={() => setStep('EQUIPMENT')} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all">Valider la Zone</button>
             </div>
          )}

          {step === 'EQUIPMENT' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 gap-6">
                  {[
                    { icon: '📡', title: 'Sondes Sol IoT G-AS', desc: 'NPK + Humidité temps-réel', tag: 'INCLUS' },
                    { icon: '🛰️', title: 'Traceurs Beacon v2', desc: 'Tracking & Santé Cheptel', tag: 'INCLUS' }
                  ].map((eq, i) => (
                    <div key={i} className="p-8 border-2 border-green-500 bg-green-50 rounded-[2.5rem] flex justify-between items-center group hover:bg-green-100 transition-all cursor-default">
                       <div className="flex gap-6 items-center">
                          <span className="text-4xl group-hover:rotate-12 transition-transform">{eq.icon}</span>
                          <div>
                            <p className="text-base font-black text-slate-800 tracking-tight">{eq.title}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{eq.desc}</p>
                          </div>
                       </div>
                       <span className="px-4 py-1.5 bg-green-600 rounded-full text-[9px] font-black text-white uppercase tracking-tighter">{eq.tag}</span>
                    </div>
                  ))}
               </div>
               <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <p className="text-[10px] text-slate-400 font-black uppercase text-center tracking-widest">Matériel expédié sous 48h par le Hub Logistique</p>
               </div>
               <button onClick={() => setStep('FINISH')} className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl hover:scale-[1.01] transition-all">Finaliser l'Inscription</button>
            </div>
          )}

          {step === 'FINISH' && (
            <div className="space-y-10 text-center animate-in zoom-in-95 duration-700">
               <div className="w-24 h-24 bg-blue-600 text-white rounded-[2.5rem] flex items-center justify-center text-4xl mx-auto shadow-2xl rotate-3">🚀</div>
               <div className="space-y-4">
                  <h3 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Exploitation <span className="text-green-600">Certifiée</span></h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium italic max-w-sm mx-auto">
                    "Félicitations. Votre Agrément PME est désormais lié à votre identité numérique Blockchain. Vos actifs sont visibles par la SGG."
                  </p>
               </div>
               <div className="p-8 border border-slate-100 rounded-[2.5rem] bg-slate-50 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span>Assurance SGG</span>
                    <span className="text-green-600">Active ✓</span>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                    <span>Lien Marketplace</span>
                    <span className="text-green-600">Connecté ✓</span>
                  </div>
               </div>
               <button onClick={() => setIsCertified(true)} className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-green-500 transition-all">Accéder à mon Hub de Gestion</button>
            </div>
          )}
       </div>
    </div>
  );

  return (
    <div className="pb-24 relative">
      {showPayModal && selectedPlan && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl space-y-8 border border-white relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
             <div className="text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Activation Infrastructures</p>
                <h3 className="text-3xl font-black text-slate-800 tracking-tighter">PLAN {selectedPlan.name}</h3>
             </div>

             <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
                <div className="flex justify-between items-center mb-4">
                   <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Montant Mensuel</span>
                   <span className="text-xl font-black text-slate-800">{selectedPlan.price.toLocaleString()} XAF</span>
                </div>
                <div className="space-y-2 border-t border-slate-200 pt-4">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Mode de paiement</p>
                   <div className="flex gap-4">
                      <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black">AIRTEL MONEY</div>
                      <div className="px-4 py-2 bg-slate-100 text-slate-400 rounded-xl text-[10px] font-black">MOOV MONEY</div>
                   </div>
                </div>
             </div>

             <button 
              onClick={executeSubscription}
              disabled={isProcessing === 'PAYMENT'}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-2xl flex items-center justify-center gap-4 transition-all hover:scale-[1.02]"
             >
                {isProcessing === 'PAYMENT' ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'VALIDER & PAYER'}
             </button>
             <button onClick={() => setShowPayModal(false)} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Annuler</button>
          </div>
        </div>
      )}

      {isCertified ? (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
               <h2 className="text-3xl font-black text-slate-800 tracking-tighter italic uppercase">Hub Producteur <span className="text-green-600">SGG+</span></h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1 italic">Souveraineté Alimentaire • AKANDA-HUB</p>
            </div>
            <div className="flex gap-4">
               <div className="bg-slate-200 p-1 rounded-2xl flex">
                  <button onClick={() => setActiveTab('ASSETS')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ASSETS' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>Actifs</button>
                  <button onClick={() => setActiveTab('SUBSCRIPTION')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'SUBSCRIPTION' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500'}`}>Abonnement</button>
               </div>
            </div>
          </div>

          {activeTab === 'ASSETS' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white">
                  <div className="flex items-center justify-between mb-8">
                     <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight italic">📂 Inventaire Biologique</h3>
                     <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase">Données Persistantes DB</span>
                  </div>
                  <div className="space-y-4">
                    {myAssets.length > 0 ? myAssets.map(asset => (
                      <div key={asset.id} className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex justify-between items-center group hover:bg-white hover:shadow-2xl transition-all duration-500 cursor-pointer">
                        <div className="flex gap-8 items-center">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">{asset.type === 'MANIOC' || asset.type === 'BANANE' ? '🌾' : '🐄'}</div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none mb-1">{asset.id} • {asset.location}</p>
                            <p className="text-xl font-black text-slate-800 tracking-tight">{asset.type} ({asset.area || asset.count + ' têtes'})</p>
                          </div>
                        </div>
                        <div className="text-right">
                           <span className="px-5 py-2 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">AUDIT IA VALIDÉ</span>
                           <p className="text-[9px] text-slate-400 mt-2 font-bold uppercase tracking-widest italic">Certifié en Base de Données</p>
                        </div>
                      </div>
                    )) : (
                      <div className="py-20 text-center opacity-30 italic font-black uppercase tracking-widest">Aucun actif enregistré</div>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white relative overflow-hidden group border border-white/10">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-green-500 italic">⚡ ACTIONS TACTIQUES</h4>
                  <div className="space-y-4">
                     <button onClick={handleDroneRequest} disabled={isProcessing === 'DRONE'} className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 justify-center hover:bg-slate-100 transition-all active:scale-95">
                        {isProcessing === 'DRONE' ? <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> : '🚁 SCAN DRONE'}
                     </button>
                     <button className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-500 transition-all">💰 VENDRE TOKENS</button>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Météo Locale (IoT)</p>
                   <div className="flex justify-between items-center p-6 bg-slate-50 rounded-[2rem]">
                      <div>
                         <p className="text-2xl font-black text-slate-800 tracking-tight">28°C</p>
                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Ensoleillé • Ntoum</p>
                      </div>
                      <span className="text-4xl animate-pulse">☀️</span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SUBSCRIPTION' && renderSubscription()}
        </div>
      ) : (step === 'WELCOME' ? renderWelcome() : renderOnboarding())}
      
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-green-600 text-white px-8 py-4 rounded-[2rem] shadow-2xl border border-green-400 font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-10 flex items-center gap-3">
          <span>⛓️</span> {toast}
        </div>
      )}
    </div>
  );
};

export default ProducerHub;
