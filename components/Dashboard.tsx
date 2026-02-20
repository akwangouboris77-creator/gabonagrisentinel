
import React, { useState, useRef, useEffect } from 'react';
import * as L from 'leaflet';
import { provinces } from '../data/provinces';

interface StarlinkStats {
  latency: number;
  bandwidth: string;
  status: 'OPTIMAL' | 'DEGRADED' | 'SEARCHING';
}

interface SmsLog {
  id: string;
  target: string;
  message: string;
  status: 'SENDING' | 'SENT' | 'DELIVERED';
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [starlink, setStarlink] = useState<StarlinkStats>({ latency: 22, bandwidth: '450 Mbps', status: 'OPTIMAL' });
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [smsLogs, setSmsLogs] = useState<SmsLog[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [-0.803, 11.609],
        zoom: 6.5,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapInstanceRef.current);

      provinces.forEach(p => {
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-lg pulse-ring"></div>`
        });
        L.marker([p.lat, p.lng], { icon }).addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div class="p-2">
              <b class="font-black uppercase text-[10px] text-slate-800">${p.name}</b><br/>
              <p class="text-[8px] uppercase font-bold text-slate-400 mt-1">Capital: ${p.capital}</p>
              <p class="text-[8px] uppercase font-black text-green-600 mt-1">Sols: ${p.soilType}</p>
              <p class="text-[8px] uppercase font-bold text-blue-500">Focus: ${p.mainCrops.join(', ')}</p>
            </div>
          `);
      });
    }

    const interval = setInterval(() => {
      setStarlink(prev => ({
        ...prev,
        latency: Math.floor(Math.random() * 5) + 20 
      }));
    }, 4000);

    return () => {
      clearInterval(interval);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleBroadcastSms = () => {
    setIsSendingSms(true);
    const newSms: SmsLog = {
      id: `SMS-${Math.floor(Math.random() * 9000) + 1000}`,
      target: "Producteurs Ogooué-Ivindo",
      message: "ALERTE G-AS : Stress hydrique détecté. Activez l'irrigation prioritaire. SGG en support.",
      status: 'SENDING',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setSmsLogs(prev => [newSms, ...prev].slice(0, 3));

    // Simulation d'envoi progressif
    setTimeout(() => {
      setSmsLogs(prev => prev.map(s => s.id === newSms.id ? {...s, status: 'SENT'} : s));
      setTimeout(() => {
        setSmsLogs(prev => prev.map(s => s.id === newSms.id ? {...s, status: 'DELIVERED'} : s));
        setIsSendingSms(false);
        setNotification("Broadcast SMS terminé. 124 producteurs notifiés.");
        setTimeout(() => setNotification(null), 4000);
      }, 1500);
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 relative">
      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-slate-900 text-white px-8 py-4 rounded-full border border-green-500 shadow-2xl font-black text-[10px] uppercase tracking-widest animate-in slide-in-from-top-10 flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          {notification}
        </div>
      )}

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-4">
           <div className="bg-slate-900 rounded-[2rem] p-1 border border-white/10 flex items-center pr-6 shadow-2xl">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl mr-4 shadow-lg shadow-blue-900/40 animate-pulse">📡</div>
              <div>
                <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Starlink G-AS Nodes v4</p>
                <div className="flex items-center gap-3">
                   <span className="text-white font-black text-sm">{starlink.latency}ms</span>
                   <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{width: '98%'}}></div>
                   </div>
                   <span className="text-[9px] text-green-500 font-bold uppercase">Backbone Souverain</span>
                </div>
              </div>
           </div>
           
           <div className="hidden lg:flex bg-white rounded-[2rem] p-4 border border-slate-100 shadow-sm items-center gap-4">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Connectivité Nationale: {starlink.bandwidth}</p>
           </div>
        </div>

        <div className="bg-slate-900 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/5 italic">
          🛰️ MISSION CONTROL: SOUVERAINETÉ ALIMENTAIRE 2026
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-[3.5rem] p-2 shadow-2xl border border-white min-h-[600px] relative overflow-hidden">
           <div ref={mapContainerRef} className="w-full h-full rounded-[3.2rem] z-0"></div>
           <div className="absolute top-8 left-8 z-10 space-y-3">
              <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-slate-100">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest italic text-center">Réseau Géo-Agro National</h3>
                <p className="text-[9px] text-green-600 font-bold uppercase mt-1 tracking-tighter">● 9 Provinces Sous Monitoring IA</p>
              </div>
              <div className="bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl shadow-2xl border border-white/10 text-white">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Flotte Drone Sentinelle</p>
                <p className="text-xs font-black">214 Unités en Opération</p>
              </div>
           </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
              <h4 className="text-sm font-black text-green-400 uppercase tracking-widest mb-6 italic">Audit Agronome Majeur</h4>
              <div className="space-y-6">
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
                    <div>
                      <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Alerte Prioritaire (OIV)</p>
                      <p className="text-xs font-bold leading-relaxed italic text-slate-300">"Stress hydrique détecté dans l'Ogooué-Ivindo sur les cultures de cacao. Activation des protocoles d'irrigation intelligente."</p>
                    </div>
                    
                    <button 
                      onClick={handleBroadcastSms}
                      disabled={isSendingSms}
                      className="w-full py-3 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 hover:bg-blue-500 transition-all active:scale-95"
                    >
                      {isSendingSms ? (
                         <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> DIFFUSION...</>
                      ) : (
                         <>📱 NOTIFIER PRODUCTEURS (SMS)</>
                      )}
                    </button>
                 </div>
                 
                 {smsLogs.length > 0 && (
                   <div className="space-y-2 animate-in slide-in-from-top-4">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Logs SMS Broadcast</p>
                      {smsLogs.map(log => (
                        <div key={log.id} className="p-2 bg-white/5 border border-white/5 rounded-lg flex items-center justify-between">
                           <div className="truncate flex-1 pr-2">
                             <p className="text-[8px] text-white font-bold truncate">{log.target}</p>
                           </div>
                           <div className="flex items-center gap-2">
                             <span className={`text-[7px] font-black uppercase ${log.status === 'DELIVERED' ? 'text-green-500' : 'text-blue-400'}`}>
                                {log.status}
                             </span>
                           </div>
                        </div>
                      ))}
                   </div>
                 )}

                 <div className="space-y-2">
                    <div className="flex justify-between text-[9px] font-black uppercase text-slate-500">
                       <span>Souveraineté (Manioc)</span>
                       <span className="text-green-500">94.1%</span>
                    </div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-green-500" style={{width: '94.1%'}}></div>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-green-500 transition-all active:scale-95 shadow-green-900/40">
                    Générer Bilan National IA
                 </button>
              </div>
           </div>

           <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col justify-between h-44">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Registre Blockchain BCEG</h5>
              <div className="space-y-4">
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Blocs Validés / h</span>
                    <span className="font-black text-slate-800">1,242</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-bold">
                    <span className="text-slate-500 uppercase">Intégrité Réseau</span>
                    <span className="text-green-600 font-black">CERTIFIÉ</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
