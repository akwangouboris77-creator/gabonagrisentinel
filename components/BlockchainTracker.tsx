
import React, { useState, useEffect } from 'react';
import { BlockchainTx } from '../types';
import DataFlowSchema from './DataFlowSchema';

const mockTxs: BlockchainTx[] = [
  { id: 'TX-9921', timestamp: 'Il y a 2m', type: 'VALIDATION_DRONE', details: 'Ferme Akanda : Preuve de vie validée (Manioc)', hash: '0x77a...2b1', status: 'CONFIRMED' },
  { id: 'TX-9920', timestamp: 'Il y a 5m', type: 'TOKEN_MINT', details: 'Émission 500 Tokens "Banane Or" (Ntoum)', hash: '0x88b...3c2', status: 'CONFIRMED' },
  { id: 'TX-9919', timestamp: 'Il y a 12m', type: 'SGG_GUARANTEE', details: 'Garantie Risque Zéro émise pour INV-2025-01', hash: '0x99c...4d3', status: 'CONFIRMED' },
  { id: 'TX-9918', timestamp: 'Il y a 18m', type: 'LOGISTIC_MATCH', details: 'Camion R-102 couplé à Récolte Zone B', hash: '0xaa1...5e4', status: 'CONFIRMED' },
];

const BlockchainTracker: React.FC = () => {
  const [txs, setTxs] = useState(mockTxs);
  const [selectedTx, setSelectedTx] = useState<BlockchainTx | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const newTx: BlockchainTx = {
        id: `TX-${Math.floor(Math.random() * 9000) + 1000}`,
        timestamp: 'À l\'instant',
        type: ['VALIDATION_DRONE', 'TOKEN_MINT', 'SGG_GUARANTEE', 'LOGISTIC_MATCH'][Math.floor(Math.random() * 4)] as any,
        details: 'Nouvel événement réseau capturé par Sentinelle...',
        hash: `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 5)}`,
        status: 'CONFIRMED'
      };
      setTxs(prev => [newTx, ...prev.slice(0, 9)]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700 relative">
      <div id="blockchain-content" className="space-y-6">
        {selectedTx && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-in fade-in">
          <div className="bg-slate-900 w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl space-y-8 border border-white/10 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>
             <button onClick={() => setSelectedTx(null)} className="absolute top-8 right-8 text-slate-400 hover:text-white transition-colors">✕</button>
             
             <div className="text-center">
                <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.4em] mb-2">Preuve de Validité Blockchain</p>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase italic">{selectedTx.type.replace('_', ' ')}</h3>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-1 italic">ID: {selectedTx.id}</p>
             </div>

             <div className="space-y-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Hash de Transaction</p>
                   <p className="text-xs font-mono text-green-400 break-all">{selectedTx.hash}f7e8a9b0c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6s7t8u9v0w1x2y3z</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Horodatage</p>
                      <p className="text-xs font-black text-white">{selectedTx.timestamp}</p>
                   </div>
                   <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                      <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Statut Réseau</p>
                      <p className="text-xs font-black text-green-500 italic uppercase">{selectedTx.status} ✓</p>
                   </div>
                </div>
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                   <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Détails de l'Événement</p>
                   <p className="text-xs font-medium text-slate-300 italic leading-relaxed">"{selectedTx.details}"</p>
                </div>
             </div>

             <div className="pt-4">
                <button onClick={() => setSelectedTx(null)} className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] transition-all">Fermer l'Explorateur</button>
             </div>
          </div>
        </div>
      )}

      <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-green-500/20 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-green-500">⛓️</span> Registre Inaltérable
            </h2>
            <p className="text-green-500/50 text-xs font-mono mt-1 tracking-widest uppercase">Nodes: Libreville, Port-Gentil, Franceville</p>
          </div>
          <div className="px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/30">
            <span className="text-green-500 font-mono text-sm animate-pulse">● RÉSEAU OPÉRATIONNEL</span>
          </div>
        </div>

        <div className="space-y-3">
          {txs.map((tx) => (
            <div 
              key={tx.id} 
              onClick={() => setSelectedTx(tx)}
              className="group bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-green-500/30 p-5 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${
                  tx.type === 'VALIDATION_DRONE' ? 'bg-blue-500/20 text-blue-400' :
                  tx.type === 'TOKEN_MINT' ? 'bg-yellow-500/20 text-yellow-400' :
                  tx.type === 'SGG_GUARANTEE' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'
                }`}>
                  {tx.type === 'VALIDATION_DRONE' ? '🚁' : tx.type === 'TOKEN_MINT' ? '💎' : tx.type === 'SGG_GUARANTEE' ? '🛡️' : '🚛'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{tx.id}</span>
                    <span className="text-[10px] text-green-500/50 font-mono">{tx.hash}</span>
                  </div>
                  <p className="text-white text-sm font-bold">{tx.details}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-medium mb-1">{tx.timestamp}</p>
                <span className="px-2 py-0.5 rounded-md bg-green-500/10 text-[9px] font-black text-green-500 uppercase tracking-widest border border-green-500/20">
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <div className="flex items-center justify-between mb-8">
            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
              La technologie Blockchain garantit qu'aucune donnée de récolte ne peut être falsifiée.
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const mermaidCode = `graph LR
    A[🛰️ CAPTURE] -->|Preuve de Vie| B[🧠 VALIDATION]
    B -->|Audit IA & Consensus| C[⛓️ REGISTRE]
    C -->|Hachage Inaltérable| D[💎 VALEUR]`;
                  navigator.clipboard.writeText(mermaidCode);
                  alert("Code Mermaid copié !");
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
              >
                📋 Copier Mermaid
              </button>
              <button 
                onClick={() => {
                  const element = document.getElementById('blockchain-content');
                  // @ts-ignore
                  if (typeof html2pdf !== 'undefined' && element) {
                    const opt = {
                      margin: 10,
                      filename: 'Registre_National_Blockchain_Agri_Sentinel.pdf',
                      image: { type: 'jpeg', quality: 0.98 },
                      html2canvas: { scale: 2 },
                      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    };
                    // @ts-ignore
                    html2pdf().set(opt).from(element).save();
                  } else {
                    window.print();
                  }
                }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[9px] font-black text-slate-400 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2"
              >
                📥 Exporter PDF
              </button>
            </div>
          </div>

          <DataFlowSchema />
        </div>
      </div>
    </div>
    </div>
  );
};

export default BlockchainTracker;
