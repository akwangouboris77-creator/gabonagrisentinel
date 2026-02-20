
import React, { useState, useEffect } from 'react';
import { BlockchainTx } from '../types';

const mockTxs: BlockchainTx[] = [
  { id: 'TX-9921', timestamp: 'Il y a 2m', type: 'VALIDATION_DRONE', details: 'Ferme Akanda : Preuve de vie validée (Manioc)', hash: '0x77a...2b1', status: 'CONFIRMED' },
  { id: 'TX-9920', timestamp: 'Il y a 5m', type: 'TOKEN_MINT', details: 'Émission 500 Tokens "Banane Or" (Ntoum)', hash: '0x88b...3c2', status: 'CONFIRMED' },
  { id: 'TX-9919', timestamp: 'Il y a 12m', type: 'SGG_GUARANTEE', details: 'Garantie Risque Zéro émise pour INV-2025-01', hash: '0x99c...4d3', status: 'CONFIRMED' },
  { id: 'TX-9918', timestamp: 'Il y a 18m', type: 'LOGISTIC_MATCH', details: 'Camion R-102 couplé à Récolte Zone B', hash: '0xaa1...5e4', status: 'CONFIRMED' },
];

const BlockchainTracker: React.FC = () => {
  const [txs, setTxs] = useState(mockTxs);

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
    <div className="space-y-6 animate-in fade-in duration-700">
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
            <div key={tx.id} className="group bg-slate-900/50 hover:bg-slate-900 border border-white/5 hover:border-green-500/30 p-5 rounded-2xl transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
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
          <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">
            La technologie Blockchain garantit qu'aucune donnée de récolte ne peut être falsifiée.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BlockchainTracker;
