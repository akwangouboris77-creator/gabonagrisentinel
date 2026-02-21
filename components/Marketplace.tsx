
import React, { useState } from 'react';
import { FarmToken } from '../types';

const initialTokens: (FarmToken & { img: string, tags: string[], riskLevel: 'LOW' | 'MED' | 'HIGH' })[] = [
  { 
    id: 'T-001', farmerName: 'Ferme Akanda', cropType: 'MANIOC', location: 'Akanda, Estuaire',
    pricePerUnit: 450, totalTokens: 1000, soldTokens: 650, expectedHarvest: 'Juillet 2026',
    yieldProbability: 94, insuranceLevel: 'Full (SGG)', riskLevel: 'LOW',
    img: 'https://images.unsplash.com/photo-1590332892746-814989679093?auto=format&fit=crop&q=80&w=400',
    tags: ['Souveraineté', 'Bio'] 
  },
  { 
    id: 'T-003', farmerName: 'Aviculture Ntoum', cropType: 'VOLAILLE', location: 'Ntoum, Estuaire',
    pricePerUnit: 2500, totalTokens: 500, soldTokens: 150, expectedHarvest: 'Mars 2026',
    yieldProbability: 97, insuranceLevel: 'Premium', riskLevel: 'LOW',
    img: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&q=80&w=400',
    tags: ['Cycle Court'] 
  },
  { 
    id: 'T-005', farmerName: 'Ranch Nyanga', cropType: 'VOLAILLE', location: 'Tchibanga',
    pricePerUnit: 1500, totalTokens: 2000, soldTokens: 1800, expectedHarvest: 'Août 2026',
    yieldProbability: 82, insuranceLevel: 'Standard', riskLevel: 'MED',
    img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400',
    tags: ['Exportation'] 
  }
];

type PaymentMethod = 'AIRTEL' | 'MOOV' | 'WALLET' | 'BANK' | 'CARD';

const Marketplace: React.FC = () => {
  const [role, setRole] = useState<'INVESTOR' | 'FARMER'>('INVESTOR');
  const [view, setView] = useState<'EXPLORE' | 'PORTFOLIO'>('EXPLORE');
  const [selectedToken, setSelectedToken] = useState<typeof initialTokens[0] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('AIRTEL');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'SELECT' | 'CONFIRM' | 'SUCCESS'>('SELECT');
  const [notification, setNotification] = useState<{msg: string, type: 'success' | 'info'} | null>(null);
  
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '' });
  const [cardErrors, setCardErrors] = useState({ number: '', expiry: '' });

  const totalCost = selectedToken ? selectedToken.pricePerUnit * quantity : 0;

  const validateCard = () => {
    let isValid = true;
    const errors = { number: '', expiry: '' };

    if (!/^\d{16}$/.test(cardDetails.number.replace(/\s/g, ''))) {
      errors.number = "Numéro de carte invalide (16 chiffres requis)";
      isValid = false;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(cardDetails.expiry)) {
      errors.expiry = "Format MM/AA requis";
      isValid = false;
    }

    setCardErrors(errors);
    return isValid;
  };

  const handlePurchaseClick = (token: typeof initialTokens[0]) => {
    setSelectedToken(token);
    setPaymentStep('SELECT');
    setQuantity(1);
    setCardDetails({ number: '', expiry: '', cvc: '' });
    setCardErrors({ number: '', expiry: '' });
  };

  const executePayment = async () => {
    if (paymentMethod === 'CARD' && !validateCard()) return;

    setIsProcessing(true);
    // Simulation d'un délai bancaire/blockchain réel
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsProcessing(false);
    setPaymentStep('SUCCESS');
    setNotification({
      msg: `Transaction Blockchain validée par BCEG. Vos tokens sont sécurisés.`,
      type: 'success'
    });
    setTimeout(() => setNotification(null), 5000);
  };

  const renderPaymentModal = () => {
    if (!selectedToken) return null;

    return (
      <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-xl rounded-[4rem] overflow-hidden shadow-2xl relative border border-white">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500"></div>
          
          {paymentStep !== 'SUCCESS' && (
            <button 
              onClick={() => setSelectedToken(null)} 
              className="absolute top-8 right-8 text-slate-400 hover:text-slate-800 transition-colors z-20"
            >
              ✕
            </button>
          )}

          <div className="p-12">
            {paymentStep === 'SELECT' && (
              <div className="space-y-8 animate-in slide-in-from-bottom-6">
                <div className="text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-2">Terminal de Paiement Souverain</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">INVESTIR DANS {selectedToken.cropType}</h3>
                </div>

                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Prix Unitaire</p>
                      <p className="text-xl font-black text-slate-800">{selectedToken.pricePerUnit.toLocaleString()} XAF</p>
                   </div>
                   <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200">
                      <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black">-</button>
                      <span className="text-lg font-black w-8 text-center">{quantity}</span>
                      <button onClick={() => setQuantity(q => q+1)} className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black">+</button>
                   </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Mode de Règlement</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { id: 'AIRTEL', name: 'Airtel Money', icon: '🔴' },
                      { id: 'MOOV', name: 'Moov Money', icon: '🔵' },
                      { id: 'WALLET', name: 'G-AS Wallet', icon: '🛡️' },
                      { id: 'CARD', name: 'Carte Bancaire', icon: '💳' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                        className={`p-5 rounded-2xl border-2 flex items-center gap-3 transition-all ${paymentMethod === m.id ? 'bg-slate-900 border-slate-900 text-white shadow-xl' : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'}`}
                      >
                        <span className="text-xl">{m.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest">{m.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                   <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">Total à Décaisser</p>
                      <p className="text-3xl font-black text-slate-800">{totalCost.toLocaleString()} <span className="text-sm">XAF</span></p>
                   </div>
                   <button 
                    onClick={() => setPaymentStep('CONFIRM')}
                    className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                   >
                     Continuer →
                   </button>
                </div>
              </div>
            )}

            {paymentStep === 'CONFIRM' && (
              <div className="space-y-8 animate-in slide-in-from-right-10">
                <div className="text-center">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-2">Validation de Sécurité</p>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">CONFIRMEZ VOTRE APPUI</h3>
                </div>

                {paymentMethod === 'CARD' ? (
                  <div className="space-y-4 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                    <div className="space-y-2">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Numéro de Carte</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        className={`w-full px-6 py-4 bg-white border rounded-2xl text-sm font-bold focus:outline-none transition-all ${cardErrors.number ? 'border-red-500' : 'border-slate-200'}`}
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})}
                      />
                      {cardErrors.number && <p className="text-[8px] text-red-500 font-black uppercase ml-2">{cardErrors.number}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">Expiration</label>
                        <input 
                          type="text" 
                          placeholder="MM/AA"
                          className={`w-full px-6 py-4 bg-white border rounded-2xl text-sm font-bold focus:outline-none transition-all ${cardErrors.expiry ? 'border-red-500' : 'border-slate-200'}`}
                          value={cardDetails.expiry}
                          onChange={(e) => {
                            let val = e.target.value.replace(/\D/g, '');
                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2, 4);
                            setCardDetails({...cardDetails, expiry: val.slice(0, 5)});
                          }}
                        />
                        {cardErrors.expiry && <p className="text-[8px] text-red-500 font-black uppercase ml-2">{cardErrors.expiry}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-2">CVC</label>
                        <input 
                          type="password" 
                          placeholder="***"
                          maxLength={3}
                          className="w-full px-6 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '')})}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-blue-50 rounded-[3rem] border border-blue-100 text-center space-y-2">
                    <p className="text-sm font-bold text-blue-900 italic">"Vous vous apprêtez à acquérir {quantity} tokens de {selectedToken.cropType}. Vos fonds seront placés sous séquestre SGG."</p>
                  </div>
                )}

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 px-2">
                      <span>Réseau de Sortie</span>
                      <span className="text-slate-800">{paymentMethod}</span>
                   </div>
                   <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400 px-2">
                      <span>Frais Blockchain</span>
                      <span className="text-blue-600">150 XAF (Frais de Gaz)</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-black uppercase text-slate-900 px-2 pt-2 border-t border-slate-100">
                      <span>Total Final</span>
                      <span>{(totalCost + 150).toLocaleString()} XAF</span>
                   </div>
                </div>

                <button 
                  onClick={executePayment}
                  disabled={isProcessing}
                  className="w-full py-6 bg-green-600 text-white rounded-[2.5rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl shadow-green-900/40 flex items-center justify-center gap-4 hover:bg-green-500 transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {paymentMethod === 'CARD' ? 'VALIDATION BANCAIRE...' : 'INITIALISATION USSD...'}
                    </>
                  ) : (
                    <>🚀 PAYER {totalCost.toLocaleString()} XAF</>
                  )}
                </button>
                <button onClick={() => setPaymentStep('SELECT')} className="w-full text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-800 transition-colors">Retour aux options</button>
              </div>
            )}

            {paymentStep === 'SUCCESS' && (
              <div className="text-center space-y-10 py-10 animate-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-green-500 text-white rounded-[2.5rem] flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-green-900/30 animate-bounce">✓</div>
                <div>
                   <h3 className="text-4xl font-black text-slate-800 tracking-tighter">INVESTISSEMENT VALIDÉ</h3>
                   <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-2 italic">Réf: G-AS-{Math.floor(Math.random()*900000)} • Certifié par BCEG</p>
                </div>
                <div className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 max-w-sm mx-auto">
                   <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                     "Vos tokens ont été mintés et sont désormais visibles dans votre portefeuille. La SGG garantit la valeur de votre actif jusqu'à la récolte."
                   </p>
                </div>
                <div className="flex flex-col gap-4">
                  <button 
                    onClick={() => { setSelectedToken(null); setView('PORTFOLIO'); }}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl"
                  >
                    Voir mon Portefeuille
                  </button>
                  <button className="text-[10px] font-black text-green-600 uppercase tracking-widest flex items-center justify-center gap-2">
                    📥 Télécharger Certificat PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20 relative">
      {renderPaymentModal()}
      
      {notification && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[10000] px-10 py-5 rounded-[2.5rem] shadow-2xl font-black text-xs animate-in slide-in-from-top-10 flex items-center gap-4 border backdrop-blur-xl ${notification.type === 'success' ? 'bg-green-600/90 border-green-400 text-white' : 'bg-blue-600/90 border-blue-400 text-white'}`}>
          <span className="text-xl">{notification.type === 'success' ? '⛓️' : 'ℹ️'}</span>
          <span className="uppercase tracking-widest leading-tight">{notification.msg}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-green-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex flex-wrap gap-4 mb-10">
            <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
              <button onClick={() => setRole('INVESTOR')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'INVESTOR' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Investisseur</button>
              <button onClick={() => setRole('FARMER')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${role === 'FARMER' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>Agriculteur</button>
            </div>
            {role === 'INVESTOR' && (
              <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <button onClick={() => setView('EXPLORE')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'EXPLORE' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>Explorer</button>
                <button onClick={() => setView('PORTFOLIO')} className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'PORTFOLIO' ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>Mon Portefeuille</button>
              </div>
            )}
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-none italic uppercase">
            {role === 'INVESTOR' ? (view === 'EXPLORE' ? "Financez la Souveraineté." : "Vos Actifs Certifiés.") : "Tokenisez votre Futur."}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-2xl italic font-medium">
            {role === 'INVESTOR' 
              ? "Accédez à des opportunités agricoles auditées par drone et garanties par l'État gabonais via la SGG." 
              : "Transformez vos hectares en titres liquides sur le registre national de la BCEG."}
          </p>
        </div>
      </div>

      {role === 'INVESTOR' && view === 'EXPLORE' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {initialTokens.map((token) => (
            <div key={token.id} className="bg-white rounded-[4rem] shadow-sm border border-slate-100 overflow-hidden group transition-all hover:shadow-2xl hover:-translate-y-2">
              <div className="h-72 relative overflow-hidden">
                <img src={token.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" alt={token.cropType} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute top-8 left-8 flex gap-3">
                  <div className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm">{token.id}</div>
                  <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-sm ${token.riskLevel === 'LOW' ? 'bg-green-600 text-white' : 'bg-amber-500 text-white'}`}>RISQUE {token.riskLevel}</div>
                </div>
                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                   <div>
                      <p className="text-[10px] font-black uppercase text-green-400 mb-1 tracking-widest italic">Localisation</p>
                      <p className="text-sm font-black">{token.location}</p>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-green-400 mb-1 tracking-widest italic">Récolte</p>
                      <p className="text-sm font-black">{token.expectedHarvest}</p>
                   </div>
                </div>
              </div>
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                   <div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{token.cropType}</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{token.farmerName}</p>
                   </div>
                   <div className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-sm font-black shadow-xl">
                      <span className="text-[7px] text-slate-400 uppercase leading-none mb-1">IA</span>
                      {token.yieldProbability}%
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">Prix / Token</p>
                      <p className="text-2xl font-black text-slate-800">{token.pricePerUnit.toLocaleString()} <span className="text-[10px] text-slate-400">XAF</span></p>
                   </div>
                   <div className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white transition-colors">
                      <p className="text-[8px] font-black text-slate-400 uppercase mb-2">ROI Projeté</p>
                      <p className="text-2xl font-black text-green-600">+15.4%</p>
                   </div>
                </div>

                <button 
                  onClick={() => handlePurchaseClick(token)}
                  className="w-full py-6 bg-slate-900 text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
                >
                  💳 ACHETER TOKENS
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reste du contenu (Portefeuille, Farmer Hub) ici ... */}
    </div>
  );
};

export default Marketplace;
