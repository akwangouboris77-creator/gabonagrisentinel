
import React, { useState, useEffect } from 'react';
import { dbService, DBAsset, DBOrder } from '../services/db';

const BuyerHub: React.FC = () => {
  const [assets, setAssets] = useState<DBAsset[]>([]);
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<DBAsset | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'EXPLORE' | 'MY_ORDERS'>('EXPLORE');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allAssets = await dbService.getAssets();
    setAssets(allAssets.filter(a => a.maturity !== undefined));
    const allOrders = await dbService.getOrders();
    setOrders(allOrders);
  };

  const handleReservation = async (asset: DBAsset) => {
    setIsProcessing(true);
    const amount = (asset.estimatedYield || 1) * (asset.pricePerTon || 0);
    const discount = amount * 0.1; // 10% de remise pour pré-paiement
    const totalToPay = amount - discount;

    const newOrder: DBOrder = {
      id: `ORD-${Date.now()}`,
      buyerName: 'Acheteur Souverain',
      assetId: asset.id,
      cropType: asset.type,
      quantity: asset.estimatedYield || 0,
      totalPaid: totalToPay,
      status: 'PAID_ADVANCE',
      date: new Date().toLocaleDateString()
    };

    await dbService.addOrder(newOrder);
    await loadData();
    setIsProcessing(false);
    setSelectedAsset(null);
    setToast(`Réservation confirmée ! ${totalToPay.toLocaleString()} XAF payés en avance pour ${asset.id}. Remise de 10% appliquée.`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {toast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-slate-900 text-white px-8 py-4 rounded-[2rem] shadow-2xl border border-green-500 font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-10 flex items-center gap-3">
          <span className="text-xl">🛡️</span> {toast}
        </div>
      )}

      {/* Hero Centrale d'Achat */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-amber-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
             <span className="px-4 py-1.5 bg-amber-500 rounded-xl text-[10px] font-black uppercase tracking-widest">Off-take Agreement Portal</span>
             <div className="bg-white/10 p-1 rounded-xl flex">
                <button onClick={() => setActiveTab('EXPLORE')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'EXPLORE' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Catalogue Récoltes</button>
                <button onClick={() => setActiveTab('MY_ORDERS')} className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === 'MY_ORDERS' ? 'bg-white text-slate-900' : 'text-slate-400'}`}>Mes Réservations</button>
             </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-none mb-4">
            Sécurisez vos <span className="text-amber-500">Approvisionnements</span>
          </h2>
          <p className="text-slate-400 max-w-2xl font-medium italic">
            Réservez les récoltes en cours de croissance. Pré-payez pour bénéficier de remises exclusives et garantir la souveraineté alimentaire de vos rayons.
          </p>
        </div>
      </div>

      {activeTab === 'EXPLORE' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white">
              <h3 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight italic flex items-center justify-between">
                🌾 Récoltes Futures Disponibles
                <span className="text-[9px] bg-slate-100 px-4 py-1.5 rounded-full text-slate-500 font-black uppercase tracking-widest italic italic">Audité par Drone IA</span>
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                {assets.map(asset => (
                  <div 
                    key={asset.id} 
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group hover:shadow-2xl hover:border-amber-200 ${selectedAsset?.id === asset.id ? 'bg-amber-50 border-amber-200 ring-2 ring-amber-500/20' : 'bg-slate-50 border-slate-100 hover:bg-white'}`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                          {asset.type === 'MANIOC' || asset.type === 'BANANE' ? '🌾' : '🐄'}
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-none">{asset.id} • {asset.location}</p>
                          <p className="text-2xl font-black text-slate-800 tracking-tighter">{asset.type} ({asset.estimatedYield} Tonnes Est.)</p>
                          <div className="flex items-center gap-4 mt-3">
                             <div className="flex items-center gap-2">
                                <span className="text-[9px] font-black text-slate-500 uppercase italic">Maturité:</span>
                                <span className="text-sm font-black text-amber-600">{asset.maturity}%</span>
                             </div>
                             <div className="w-32 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${asset.maturity}%` }}></div>
                             </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs font-black text-slate-400 uppercase mb-1">Prix de Sortie de Champ</p>
                         <p className="text-2xl font-black text-slate-900">{asset.pricePerTon?.toLocaleString()} <span className="text-sm">XAF/T</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl border border-white sticky top-24">
                <h4 className="text-xl font-black mb-8 flex items-center gap-3 uppercase tracking-tighter italic">🛡️ Contrat d' <span className="text-amber-500">Off-take</span></h4>
                
                {selectedAsset ? (
                  <div className="space-y-8 animate-in slide-in-from-right-10">
                    <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-white/10 text-white">
                        <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-2">Valeur du Lot Réservable</p>
                        <p className="text-4xl font-black tracking-tighter">{((selectedAsset.estimatedYield || 0) * (selectedAsset.pricePerTon || 0)).toLocaleString()} XAF</p>
                    </div>

                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 px-2">
                          <span>Producteur</span>
                          <span className="text-slate-800">{selectedAsset.owner}</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 px-2">
                          <span>Avantage Pré-paiement</span>
                          <span className="text-green-600">-10% de remise</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400 px-2">
                          <span>Logistique G-AS</span>
                          <span className="text-slate-800">Assignation Prioritaire</span>
                       </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100">
                       <button 
                        onClick={() => handleReservation(selectedAsset)}
                        disabled={isProcessing}
                        className="w-full py-6 bg-amber-500 text-slate-900 rounded-[2rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-amber-900/20 hover:bg-amber-400 transition-all active:scale-95 flex items-center justify-center gap-4"
                       >
                          {isProcessing ? 'INITIALISATION SÉQUESTRE...' : 'RÉSERVER & PAYER EN AVANCE'}
                       </button>
                       <p className="text-[8px] text-slate-400 mt-4 text-center font-bold uppercase tracking-widest leading-relaxed">
                         Les fonds sont bloqués sur la Blockchain BCEG et libérés au producteur lors du chargement logistique audité par IoT.
                       </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-20 text-center opacity-20">
                    <span className="text-6xl block mb-6 animate-pulse">📝</span>
                    <p className="text-xs font-black uppercase tracking-[0.3em] max-w-[150px] mx-auto">Choisissez une récolte pour simuler le contrat</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-10 space-y-8">
           <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white overflow-hidden">
             <h3 className="text-2xl font-black text-slate-800 mb-10 uppercase italic">Mes Engagements d'Achat Future</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map(order => (
                  <div key={order.id} className="p-8 bg-slate-900 rounded-[3rem] text-white border border-white/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                     <div className="flex justify-between items-start mb-6">
                        <div>
                           <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">{order.id}</p>
                           <h4 className="text-xl font-black tracking-tight">{order.cropType} • {order.quantity} T</h4>
                        </div>
                        <span className="px-4 py-1.5 bg-green-600 rounded-full text-[9px] font-black uppercase italic shadow-lg">PAYÉ</span>
                     </div>
                     <div className="space-y-4 border-t border-white/5 pt-6">
                        <div className="flex justify-between text-[10px] font-bold">
                           <span className="text-slate-400 uppercase">Montant Pré-payé</span>
                           <span className="font-black text-white">{order.totalPaid.toLocaleString()} XAF</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                           <span className="text-slate-400 uppercase">Statut Logistique</span>
                           <span className="text-amber-500 uppercase tracking-tighter">En attente de maturité</span>
                        </div>
                     </div>
                     <button className="w-full mt-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[9px] font-black uppercase transition-all border border-white/10 italic">
                        Voir Preuve Blockchain
                     </button>
                  </div>
                ))}
             </div>
             {orders.length === 0 && (
               <div className="py-24 text-center opacity-20 italic font-black uppercase tracking-widest">Aucune réservation active</div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHub;
