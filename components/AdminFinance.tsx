
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ENTITIES' | 'PAYOUTS' | 'FUNDRAISING'>('OVERVIEW');
  const [investors] = useState<Investor[]>(() => [
    { id: 'FGIS-001', name: 'Fonds Gabonais d\'Investissements Stratégiques', type: 'INSTITUTIONAL', joinedDate: '12/01/2026', totalInvested: 1200000000, status: 'ACTIVE' },
    { id: 'BGFI-002', name: 'BGFIBank Gabon S.A.', type: 'INSTITUTIONAL', joinedDate: '01/03/2026', totalInvested: 500000000, status: 'ACTIVE' },
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
        {(['OVERVIEW', 'ENTITIES', 'PAYOUTS', 'FUNDRAISING'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-8 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab === 'OVERVIEW' ? '📊 Trésorerie' : tab === 'ENTITIES' ? '🏛️ Acteurs' : tab === 'PAYOUTS' ? '💸 Règlements' : '🏦 Financement PAT'}
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
    </div>
  );
};

export default AdminFinance;
