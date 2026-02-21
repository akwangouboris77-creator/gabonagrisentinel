
import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
// Fix: Removed the undefined 'Provider' member from the import list
import { Investor } from '../types';

const chartData = [
  { name: 'Jan', commissions: 1200000, saas: 800000, api: 2500000, total: 4500000 },
  { name: 'Fév', commissions: 1500000, saas: 900000, api: 2800000, total: 5200000 },
  { name: 'Mar', commissions: 2800000, saas: 1500000, api: 4600000, total: 8900000 },
  { name: 'Avr', commissions: 4100000, saas: 2100000, api: 6200000, total: 12400000 },
  { name: 'Mai', commissions: 5200000, saas: 3100000, api: 7500000, total: 15800000 },
  { name: 'Juin', commissions: 7800000, saas: 4200000, api: 10000000, total: 22000000 },
];

const AdminFinance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'PAYOUTS' | 'FUNDRAISING' | 'PARTNERSHIP'>('OVERVIEW');
  const [investors] = useState<Investor[]>(() => [
    { id: 'FGIS-001', name: 'Fonds Gabonais d\'Investissements Stratégiques', type: 'INSTITUTIONAL', joinedDate: '12/01/2026', totalInvested: 1200000000, status: 'ACTIVE' },
    { id: 'BGFI-002', name: 'BGFIBank Gabon S.A.', type: 'INSTITUTIONAL', joinedDate: '01/03/2026', totalInvested: 500000000, status: 'ACTIVE' },
    { id: 'BECEG-003', name: 'BECEG - Banque d\'État', type: 'INSTITUTIONAL', joinedDate: '20/02/2026', totalInvested: 0, status: 'PENDING' },
  ]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-white/10 p-4 rounded-2xl shadow-2xl text-[10px] font-black uppercase tracking-widest text-white">
          <p className="mb-2 text-slate-400">{label} 2026</p>
          <div className="space-y-1">
            <p className="text-blue-400">Prélèvements Crédits (2.5%): {payload[0].value.toLocaleString()} XAF</p>
            <p className="text-green-400">Abonnements Producteurs: {payload[1].value.toLocaleString()} XAF</p>
            <p className="text-purple-400">Licences État/API: {payload[2].value.toLocaleString()} XAF</p>
            <div className="pt-2 mt-2 border-t border-white/10">
              <p className="text-white text-xs">Total: {(payload[0].value + payload[1].value + payload[2].value).toLocaleString()} XAF</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-24">
      <div className="flex bg-slate-200 p-1.5 rounded-[2.5rem] w-fit overflow-x-auto no-scrollbar max-w-full">
        {(['OVERVIEW', 'ENTITIES', 'PAYOUTS', 'FUNDRAISING', 'PARTNERSHIP'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-8 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab === 'OVERVIEW' ? '📊 Trésorerie' : tab === 'ENTITIES' ? '🏛️ Acteurs' : tab === 'PAYOUTS' ? '💸 Règlements' : tab === 'FUNDRAISING' ? '🏦 Financement PAT' : '🤝 Dossier BECEG'}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-6">
          <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="relative z-10 text-center md:text-left">
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-4">Flux de Trésorerie Infrastructure G-AS</p>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-2">1.82 Mrds <span className="text-xl text-slate-400">XAF</span></h2>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">Capitaux prélevés sur flux de crédit validés</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Prélèvements à la Source', val: '124M', color: 'bg-blue-500', icon: '🏦' },
              { label: 'Abonnements Directs', val: '48.2M', color: 'bg-green-500', icon: '🌱' },
              { label: 'Hub Logistique', val: '32.1M', color: 'bg-amber-500', icon: '🚛' },
              { label: 'Licences Institutionnelles', val: '125M', color: 'bg-purple-500', icon: '🏢' }
            ].map((s, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative group overflow-hidden">
                <div className={`absolute top-0 right-0 w-20 h-20 ${s.color}/5 rounded-full blur-2xl -mr-10 -mt-10`}></div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{s.icon}</span>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                </div>
                <p className="text-2xl font-black text-slate-800">{s.val} <span className="text-[10px] text-slate-400 font-bold">XAF</span></p>
              </div>
            ))}
          </div>

          <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-white">
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic mb-8">Structure des Revenus G-AS (Système BCEG-Split)</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/></linearGradient>
                    <linearGradient id="colorSaas" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/></linearGradient>
                    <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/></linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="commissions" stackId="1" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorComm)" />
                  <Area type="monotone" dataKey="saas" stackId="1" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorSaas)" />
                  <Area type="monotone" dataKey="api" stackId="1" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorApi)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'PARTNERSHIP' && (
        <div className="space-y-10 animate-in slide-in-from-right-10">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-white">
            <div className="flex justify-between items-start mb-12">
              <div>
                <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Business Plan Stratégique</h3>
                <p className="text-blue-600 text-xs font-black uppercase tracking-widest">Partenariat G-AS x BECEG • Version 1.0</p>
              </div>
              <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest italic shadow-xl">
                Confidentiel Bancaire
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 01. Vision & Objectifs
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                    Digitaliser la chaîne de valeur agricole gabonaise pour débloquer 500 Mrds XAF de financements d'ici 2030. G-AS agit comme le tiers de confiance technologique entre la BECEG et les exploitants.
                  </p>
                </section>
                <section>
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span> 02. Le Gage Biologique
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed font-medium italic">
                    Utilisation de drones multispectraux pour auditer la santé des cultures. Ce "gage" remplace l'hypothèque immobilière traditionnelle, permettant aux petits producteurs d'accéder au crédit.
                  </p>
                </section>
              </div>
              <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Modèle de Revenus (BCEG-Split)</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Commission Transactionnelle', val: '2.5%', desc: 'Prélevé sur chaque décaissement de crédit' },
                    { label: 'Licence de Monitoring', val: '15M / an', desc: 'Payé par la banque pour l\'accès au dashboard' },
                    { label: 'Frais d\'Audit Drone', val: '250k / vol', desc: 'Facturé par hectare audité pour validation de tranche' }
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white rounded-2xl shadow-sm">
                      <div>
                        <p className="text-[10px] font-black text-slate-900 uppercase">{m.label}</p>
                        <p className="text-[8px] text-slate-400 font-bold uppercase italic">{m.desc}</p>
                      </div>
                      <p className="text-lg font-black text-blue-600">{m.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white shadow-2xl border border-white/10">
            <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10">Plan de Trésorerie Prévisionnel (H1 2026)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Poste de Flux</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Mars</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Avril</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Mai</th>
                    <th className="pb-6 text-[10px] font-black text-slate-400 uppercase">Juin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="group">
                    <td className="py-6 text-[11px] font-black text-blue-400 uppercase italic">Encaissements (Commissions)</td>
                    <td className="py-6 text-sm font-bold">2.8M</td>
                    <td className="py-6 text-sm font-bold">4.1M</td>
                    <td className="py-6 text-sm font-bold">5.2M</td>
                    <td className="py-6 text-sm font-bold">7.8M</td>
                  </tr>
                  <tr>
                    <td className="py-6 text-[11px] font-black text-green-400 uppercase italic">Encaissements (SaaS/API)</td>
                    <td className="py-6 text-sm font-bold">6.1M</td>
                    <td className="py-6 text-sm font-bold">8.3M</td>
                    <td className="py-6 text-sm font-bold">10.6M</td>
                    <td className="py-6 text-sm font-bold">14.2M</td>
                  </tr>
                  <tr>
                    <td className="py-6 text-[11px] font-black text-red-400 uppercase italic">Décaissements (Ops/Drone)</td>
                    <td className="py-6 text-sm font-bold">(4.2M)</td>
                    <td className="py-6 text-sm font-bold">(4.5M)</td>
                    <td className="py-6 text-sm font-bold">(5.1M)</td>
                    <td className="py-6 text-sm font-bold">(6.8M)</td>
                  </tr>
                  <tr className="bg-white/5">
                    <td className="py-6 px-4 text-[11px] font-black text-white uppercase">Solde de Trésorerie Net</td>
                    <td className="py-6 text-sm font-black text-blue-400">4.7M</td>
                    <td className="py-6 text-sm font-black text-blue-400">7.9M</td>
                    <td className="py-6 text-sm font-black text-blue-400">10.7M</td>
                    <td className="py-6 text-sm font-black text-blue-400">15.2M</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-10 p-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
              <p className="text-[10px] font-bold text-blue-300 leading-relaxed italic uppercase tracking-tight">
                Note: Les projections de trésorerie sont basées sur un taux de pénétration de 12% du portefeuille agri de la BECEG au premier semestre. Toutes les valeurs sont exprimées en XAF.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFinance;
