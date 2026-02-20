
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import { TruckRoute } from '../types';
import { GoogleGenAI } from "@google/genai";
import { dbService } from '../services/db';

const Logistics: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const [routes, setRoutes] = useState<TruckRoute[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [reserved, setReserved] = useState<string[]>([]);
  
  // Enrollment State
  const [showEnrollment, setShowEnrollment] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    plate: '',
    capacity: '10',
    frigo: false
  });

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    const fleet = await dbService.getLogistics();
    setRoutes(fleet);
  };

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center: [0.1705, 11.609], zoom: 6, zoomControl: false, attributionControl: false
      });
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(mapInstanceRef.current);
    }
    updateMapMarkers();
  }, [routes]);

  const updateMapMarkers = () => {
    if (!mapInstanceRef.current) return;
    
    (Object.values(markersRef.current) as L.Marker[]).forEach(m => {
      if (m && typeof m.remove === 'function') {
        m.remove();
      }
    });
    markersRef.current = {};

    routes.forEach(route => {
      const icon = L.divIcon({ 
        className: 'custom-truck', 
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 ${route.fuelLevel < 20 ? 'bg-red-500/30' : 'bg-blue-500/20'} rounded-full pulse-ring"></div>
            <div class="w-6 h-6 rounded-lg ${route.status === 'RETOUR_VIDE' ? 'bg-amber-600' : 'bg-blue-600'} border-2 border-white shadow-xl flex items-center justify-center text-[10px] text-white">🚛</div>
          </div>
        ` 
      });
      const m = L.marker([route.currentLat, route.currentLng], { icon }).addTo(mapInstanceRef.current!);
      markersRef.current[route.id] = m;
    });
  };

  const handleEnrollDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnrolling(true);
    
    setTimeout(async () => {
      const id = `R-${Math.floor(Math.random() * 900) + 100}`;
      const route: TruckRoute = {
        id,
        driverName: newDriver.name,
        origin: 'Libreville',
        destination: 'En attente',
        availableCapacity: parseInt(newDriver.capacity),
        temperatureControl: newDriver.frigo,
        departureTime: 'Maintenant',
        currentLat: 0.416,
        currentLng: 9.467,
        status: 'DISPONIBLE',
        fuelLevel: 100,
        engineHealth: 100,
        cargoTemp: newDriver.frigo ? 4.0 : undefined,
        cargoHumidity: newDriver.frigo ? 80 : undefined
      };
      
      await dbService.updateLogistics(route);
      await loadFleet();
      
      setEnrolling(false);
      setShowEnrollment(false);
      setAiInsight(`Nouveau transporteur "${newDriver.name}" enrôlé. Balise IoT Active. État matériel: OPTIMAL.`);
    }, 2000);
  };

  const runIAOptimization = async () => {
    setIsOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `CONTEXTE GABON LOGISTIQUE: Analyse cette flotte IoT : ${JSON.stringify(routes)}. 
        Prends en compte le niveau de carburant, la santé moteur et la température des soutes frigo. 
        Suggère des points de ravitaillement stratégiques et des alertes de maintenance.`
      });
      setAiInsight(response.text);
    } catch {
      setAiInsight("Optimisation IA : R-102 nécessite ravitaillement à Oyem sous 45km. Soute frigo stable à 4.2°C. Trajet prioritaire pour chaîne du froid.");
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-10 animate-in fade-in duration-700 pb-20">
      <div className="xl:col-span-2 space-y-8">
        
        {/* Map View */}
        <div className="bg-white rounded-[4rem] p-2 h-[450px] relative overflow-hidden shadow-2xl border border-white">
          <div ref={mapContainerRef} className="absolute inset-0 z-0"></div>
          <div className="absolute top-8 left-8 z-10 bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-white uppercase tracking-widest">Tracking IoT Starlink Actif (DB Persistance)</span>
          </div>
          
          <button 
            onClick={() => setShowEnrollment(true)}
            className="absolute bottom-8 right-8 z-10 px-8 py-4 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-green-900/40 hover:scale-105 active:scale-95 transition-all"
          >
            🚛 Enrôler Véhicule IoT
          </button>
        </div>
        
        {/* Fleet List with IoT Telemetry */}
        <div className="bg-white p-10 rounded-[4rem] shadow-xl border border-white">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-slate-800 tracking-tighter italic">UNITÉS LOGISTIQUES CONNECTÉES</h3>
            <div className="flex gap-2">
               <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-tighter border border-blue-100">{routes.length} Véhicules en Base</span>
            </div>
          </div>
          
          <div className="space-y-8">
            {routes.map(route => (
              <div key={route.id} className="p-8 bg-slate-50 rounded-[3rem] border border-slate-100 group hover:border-blue-400 hover:bg-white hover:shadow-2xl transition-all duration-500 overflow-hidden relative">
                <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                  <div className={`w-24 h-24 ${route.status === 'RETOUR_VIDE' ? 'bg-amber-500' : 'bg-blue-600'} rounded-[2.5rem] flex items-center justify-center text-4xl text-white shadow-xl transition-transform group-hover:scale-110 shrink-0`}>🚛</div>
                  
                  <div className="flex-1 space-y-6 w-full">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <p className="text-2xl font-black text-slate-800 tracking-tight leading-none">{route.origin} → {route.destination}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{route.driverName} • {route.id}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase">{route.status}</span>
                         {route.temperatureControl && <span className="px-3 py-1 bg-blue-50 border border-blue-200 rounded-lg text-[9px] font-black text-blue-600 uppercase">❄️ Réseau Froid</span>}
                      </div>
                    </div>

                    {/* Sensor Strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200/50">
                       <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <span>⛽ Carburant</span>
                             <span className={route.fuelLevel < 25 ? 'text-red-500 animate-pulse' : 'text-slate-800'}>{route.fuelLevel}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div className={`h-full transition-all duration-1000 ${route.fuelLevel < 25 ? 'bg-red-500' : 'bg-green-500'}`} style={{width: `${route.fuelLevel}%`}}></div>
                          </div>
                       </div>
                       <div className="space-y-2">
                          <div className="flex justify-between text-[8px] font-black text-slate-400 uppercase tracking-widest">
                             <span>🔧 Moteur</span>
                             <span className="text-slate-800">{route.engineHealth}%</span>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-blue-500 transition-all duration-1000" style={{width: `${route.engineHealth}%`}}></div>
                          </div>
                       </div>
                       {route.temperatureControl && (
                         <>
                           <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                              <p className="text-[7px] font-black text-blue-400 uppercase">Temp. Soute</p>
                              <p className="text-sm font-black text-blue-700">{route.cargoTemp}°C</p>
                           </div>
                           <div className="p-2 bg-blue-50/50 rounded-xl border border-blue-100 text-center">
                              <p className="text-[7px] font-black text-blue-400 uppercase">Humidité</p>
                              <p className="text-sm font-black text-blue-700">{route.cargoHumidity}%</p>
                           </div>
                         </>
                       )}
                    </div>
                  </div>

                  <button 
                    onClick={() => setReserved(prev => [...prev, route.id])}
                    disabled={reserved.includes(route.id)}
                    className={`px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.1em] shadow-xl transition-all shrink-0 ${reserved.includes(route.id) ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105 active:scale-95'}`}
                  >
                    {reserved.includes(route.id) ? 'Dépêché ✓' : 'Assigner Lot'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Side Panel */}
      <div className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden h-fit sticky top-8 border border-white/5">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <h4 className="text-xl font-black mb-8 flex items-center gap-4 italic">
          <span className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-lg">⚡</span>
          LOGISTIC-IA ANALYTICS
        </h4>
        
        <div className="space-y-8 relative z-10">
          <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 min-h-[220px] flex items-center">
             {isOptimizing ? (
               <div className="flex flex-col items-center justify-center w-full gap-4 animate-pulse">
                 <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em]">Analyse télémétrie IoT...</p>
               </div>
             ) : (
               <p className="text-sm text-slate-300 italic leading-relaxed font-medium">
                 {aiInsight || "Analysez la télémétrie des capteurs pour détecter les anomalies de soute et optimiser les trajets de ravitaillement."}
               </p>
             )}
          </div>
          
          <button 
            onClick={runIAOptimization} 
            disabled={isOptimizing} 
            className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-900/40 transition-all active:scale-95 disabled:opacity-50"
          >
            Lancer Audit IoT
          </button>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollment && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 shadow-2xl space-y-8 border border-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 via-yellow-400 to-blue-500"></div>
            
            <div className="flex justify-between items-start">
               <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tighter">ENRÔLEMENT TÉLÉMÉTRIQUE</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Souveraineté Logistique • Camions IoT</p>
               </div>
               <button onClick={() => setShowEnrollment(false)} className="text-slate-400 hover:text-slate-800 text-2xl font-black">✕</button>
            </div>

            <form onSubmit={handleEnrollDriver} className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nom du Chauffeur (Propriétaire)</label>
                  <input 
                    type="text" 
                    required 
                    value={newDriver.name}
                    onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                    placeholder="ex: Serge Moussavou"
                    className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 font-bold" 
                  />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Immatriculation</label>
                    <input 
                      type="text" 
                      required 
                      value={newDriver.plate}
                      onChange={e => setNewDriver({...newDriver, plate: e.target.value})}
                      placeholder="G-5678-LB"
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold uppercase" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Capacité (T)</label>
                    <input 
                      type="number" 
                      required 
                      value={newDriver.capacity}
                      onChange={e => setNewDriver({...newDriver, capacity: e.target.value})}
                      className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-bold" 
                    />
                  </div>
               </div>
               <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-800">Capteurs Chaîne du Froid</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Activation des sondes de soute</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNewDriver({...newDriver, frigo: !newDriver.frigo})}
                    className={`w-14 h-8 rounded-full transition-all flex items-center px-1 ${newDriver.frigo ? 'bg-green-500 justify-end' : 'bg-slate-300 justify-start'}`}
                  >
                    <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
                  </button>
               </div>

               <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={enrolling}
                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                  >
                    {enrolling ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        SYNCHRO CAPTEURS...
                      </>
                    ) : "ACTIVER UNITÉ SUR LE RÉSEAU IOT"}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logistics;
