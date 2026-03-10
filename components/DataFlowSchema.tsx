
import React from 'react';

const DataFlowSchema: React.FC<{ light?: boolean }> = ({ light }) => {
  const steps = [
    {
      id: 'sensor',
      icon: '🛰️',
      title: 'Capteurs',
      desc: 'IoT & Drones (Preuve de Vie)',
      color: 'blue'
    },
    {
      id: 'ai',
      icon: '🧠',
      title: 'IA Sentinelle',
      desc: 'Audit & Estimation Rendement',
      color: 'purple'
    },
    {
      id: 'blockchain',
      icon: '⛓️',
      title: 'Blockchain',
      desc: 'Certification Inaltérable',
      color: 'green'
    },
    {
      id: 'investor',
      icon: '💎',
      title: 'Investisseur',
      desc: 'Financement & ROI Sécurisé',
      color: 'yellow'
    }
  ];

  return (
    <div className={`p-8 rounded-[3rem] ${light ? 'bg-white border border-slate-100 shadow-xl' : 'bg-slate-950 border border-white/5 shadow-2xl'} relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {/* Connecting Line */}
        <div className={`hidden md:block absolute top-1/2 left-0 w-full h-0.5 ${light ? 'bg-slate-100' : 'bg-white/5'} -translate-y-1/2 z-0`}></div>
        
        {steps.map((step, idx) => (
          <div key={step.id} className="relative z-10 flex flex-col items-center text-center group w-full max-w-[200px]">
            <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg
              ${step.color === 'blue' ? 'bg-blue-500/20 text-blue-400' : 
                step.color === 'purple' ? 'bg-purple-500/20 text-purple-400' : 
                step.color === 'green' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}
            `}>
              {step.icon}
            </div>
            <h4 className={`text-[11px] font-black uppercase tracking-widest mb-2 ${light ? 'text-slate-800' : 'text-white'}`}>
              {idx + 1}. {step.title}
            </h4>
            <p className="text-[9px] text-slate-500 font-bold leading-tight uppercase tracking-tighter">
              {step.desc}
            </p>
            
            {/* Arrow for mobile */}
            {idx < steps.length - 1 && (
              <div className="md:hidden mt-4 text-slate-300 text-xl animate-bounce">↓</div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Flux de données certifié SGG</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Latence: 24ms (Starlink)</span>
        </div>
      </div>
    </div>
  );
};

export default DataFlowSchema;
