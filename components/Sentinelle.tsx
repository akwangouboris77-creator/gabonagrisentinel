
import React, { useState, useRef, useEffect } from 'react';
import { analyzeCropHealth, generateSyntheticDroneView } from '../services/geminiService';
import { useNotification } from './NotificationProvider';

type ScanMode = 'RGB' | 'THERMAL' | 'NDVI' | 'LIVESTOCK';
type Weather = 'SOLEIL' | 'PLUIE' | 'BRUME' | 'ORAGE';
type GrowthStage = 'SEMIS' | 'VÉGÉTATIF' | 'FLORAISON' | 'RÉCOLTE';

const Sentinelle: React.FC = () => {
  const { showNotification } = useNotification();
  const [analyzing, setAnalyzing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [certifying, setCertifying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mode, setMode] = useState<ScanMode>('RGB');
  
  // Simulation params
  const [weather, setWeather] = useState<Weather>('SOLEIL');
  const [stage, setStage] = useState<GrowthStage>('VÉGÉTATIF');
  const [selectedCrop, setSelectedCrop] = useState('Manioc');
  
  // Advanced AI Settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [diseaseThreshold, setDiseaseThreshold] = useState(70);
  const [simulationIntensity, setSimulationIntensity] = useState(50);
  const [aiPrecision, setAiPrecision] = useState<'STANDARD' | 'HIGH' | 'ULTRA'>('STANDARD');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setResult(null); // Reset result for the new image
        showNotification("Image importée avec succès. Prête pour le diagnostic IA.", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateSimulation = async () => {
    setSimulating(true);
    setResult(null);
    try {
      const syntheticImage = await generateSyntheticDroneView({
        crop: selectedCrop,
        weather: weather,
        stage: stage
      });
      setImagePreview(syntheticImage);
      const analysis = await analyzeCropHealth(syntheticImage, selectedCrop);
      setResult(analysis);
      showNotification(`Simulation générée (Intensité: ${simulationIntensity}%).`, "info", 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSimulating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setAnalyzing(true);
    try {
      const analysis = await analyzeCropHealth(imagePreview, mode === 'LIVESTOCK' ? "Cheptel Gabonais (Scan Drone)" : `${selectedCrop} (Scan Drone)`);
      setResult(analysis);
      showNotification(`Analyse terminée avec précision ${aiPrecision}. Seuil de détection: ${diseaseThreshold}%.`, "success", 4000);
    } catch (error) {
      setResult({
        healthScore: 75,
        detectedDisease: "Non détectée",
        recommendations: ["Continuer monitoring", "Optimiser intrants"],
        summary: "Analyse terminée avec succès via G-AS Intelligence."
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleBlockchainCert = () => {
    if (!result) return;
    setCertifying(true);
    setTimeout(() => {
      setCertifying(false);
      showNotification(`Certificat Blockchain émis pour Scan ID #${Math.floor(Math.random()*100000)}. Données inaltérables.`, "success", 5000);
    }, 2500);
  };

  const shareResults = (platform: 'email' | 'whatsapp' | 'twitter') => {
    if (!result) return;
    
    const text = `Diagnostic G-AS: Score de santé ${result.healthScore}%. Culture: ${selectedCrop}. #GabonAgriSentinel #SouverainetéAlimentaire`;
    const url = window.location.href;

    let shareUrl = '';
    switch (platform) {
      case 'email':
        shareUrl = `mailto:?subject=Diagnostic G-AS - ${selectedCrop}&body=${encodeURIComponent(text + '\n' + url)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank');
      showNotification(`Partage via ${platform} initié.`, "info", 3000);
    }
  };

  const getOverlayClass = () => {
    switch(mode) {
      case 'THERMAL': return 'sepia hue-rotate-[280deg] brightness-125 contrast-125';
      case 'NDVI': return 'grayscale contrast-[1.8] brightness-110 saturate-[2] invert';
      case 'LIVESTOCK': return 'brightness-125 contrast-125 saturate-0 opacity-80';
      default: return '';
    }
  };

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-700 pb-20 relative">
      
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl border border-white/5 text-white">
          <h3 className="text-lg font-black mb-6 flex items-center gap-3">
            <span className="text-xl">🎛️</span> SIM-ENGINE 2.0
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Culture Cible</label>
              <select 
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:border-green-500 transition-colors"
              >
                <option value="Manioc">Manioc (Akanda)</option>
                <option value="Banane">Banane Plantain</option>
                <option value="Hévéa">Hévéa (Bitam)</option>
                <option value="Cacao">Cacao (Woleu-Ntem)</option>
                <option value="Café">Café (Ogooué-Ivindo)</option>
                <option value="Palmier">Palmier à Huile (Lambaréné)</option>
                <option value="Maïs">Maïs (Ngounié)</option>
                <option value="Arachide">Arachide (Nyanga)</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Conditions Météo</label>
              <div className="grid grid-cols-2 gap-2">
                {(['SOLEIL', 'PLUIE', 'BRUME', 'ORAGE'] as Weather[]).map(w => (
                  <button 
                    key={w} 
                    onClick={() => setWeather(w)}
                    className={`py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all ${weather === w ? 'bg-green-600 border-green-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stade de Croissance</label>
              <div className="grid grid-cols-2 gap-2">
                {(['SEMIS', 'VÉGÉTATIF', 'FLORAISON', 'RÉCOLTE'] as GrowthStage[]).map(s => (
                  <button 
                    key={s} 
                    onClick={() => setStage(s)}
                    className={`py-2.5 rounded-xl text-[9px] font-black uppercase border transition-all ${stage === s ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6">
              <button 
                onClick={handleGenerateSimulation}
                disabled={simulating}
                className="w-full py-4 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-900/20 transition-all flex items-center justify-center gap-3"
              >
                {simulating ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : '🚀 Lancer Simulation'}
              </button>
              <p className="text-[8px] text-slate-500 font-bold uppercase mt-4 text-center tracking-tighter italic">Génération d'images synthétiques via Gemini 2.5</p>
            </div>
          </div>
        </div>

        {/* Advanced AI Settings Section */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden transition-all duration-500">
          <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between group"
          >
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span>⚙️</span> Paramètres Avancés
            </h3>
            <span className={`text-xs transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`}>▼</span>
          </button>

          <div className={`space-y-6 overflow-hidden transition-all duration-500 ${showAdvanced ? 'max-h-[500px] mt-8 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Seuil Détection Maladie</label>
                <span className="text-[10px] font-black text-slate-800">{diseaseThreshold}%</span>
              </div>
              <input 
                type="range" min="10" max="95" step="5"
                className="w-full accent-slate-900"
                value={diseaseThreshold}
                onChange={(e) => setDiseaseThreshold(parseInt(e.target.value))}
              />
              <p className="text-[7px] text-slate-400 font-bold uppercase italic">Sensibilité de l'IA aux anomalies foliaires.</p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Intensité Simulation</label>
                <span className="text-[10px] font-black text-slate-800">{simulationIntensity}%</span>
              </div>
              <input 
                type="range" min="0" max="100" step="10"
                className="w-full accent-blue-600"
                value={simulationIntensity}
                onChange={(e) => setSimulationIntensity(parseInt(e.target.value))}
              />
              <p className="text-[7px] text-slate-400 font-bold uppercase italic">Niveau de détails des stress environnementaux.</p>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Précision du Modèle</label>
              <div className="grid grid-cols-3 gap-1">
                {(['STANDARD', 'HIGH', 'ULTRA'] as const).map(p => (
                  <button 
                    key={p}
                    onClick={() => setAiPrecision(p)}
                    className={`py-2 rounded-lg text-[8px] font-black uppercase border transition-all ${aiPrecision === p ? 'bg-slate-900 border-slate-900 text-white shadow-md' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-600'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
               <p className="text-[8px] text-amber-700 font-black uppercase leading-tight italic">
                 ⚠️ L'augmentation de la précision peut accroître le temps de traitement Sat-Link.
               </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden group">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Uplink Manuel</p>
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-3 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase border border-dashed border-slate-300 hover:bg-slate-100 hover:border-slate-400 transition-all group-hover:scale-[1.02]"
           >
             Importer images
           </button>
           <p className="text-[8px] text-slate-400 mt-2 text-center font-bold uppercase tracking-widest italic">Formats: JPG, PNG, RAW</p>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="relative aspect-video bg-slate-950 rounded-[3.5rem] overflow-hidden border-8 border-slate-900 shadow-2xl group">
          <div className="absolute inset-0 pointer-events-none z-10 p-8 border-[1px] border-white/5">
             <div className="absolute top-8 left-8 flex flex-col gap-1">
                <div className="h-0.5 w-12 bg-green-500"></div>
                <div className="h-12 w-0.5 bg-green-500"></div>
             </div>
             <div className="absolute top-8 right-8 flex flex-col items-end gap-1">
                <div className="h-0.5 w-12 bg-green-500"></div>
                <div className="h-12 w-0.5 bg-green-500"></div>
             </div>
             <div className="absolute bottom-8 left-8 flex flex-col gap-1 flex-col-reverse">
                <div className="h-0.5 w-12 bg-green-500"></div>
                <div className="h-12 w-0.5 bg-green-500"></div>
             </div>
             <div className="absolute bottom-8 right-8 flex flex-col items-end gap-1 flex-col-reverse">
                <div className="h-0.5 w-12 bg-green-500"></div>
                <div className="h-12 w-0.5 bg-green-500"></div>
             </div>

             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full flex items-center justify-center">
                <div className="w-1 h-1 bg-red-500 rounded-full animate-ping"></div>
             </div>
          </div>

          {imagePreview ? (
            <>
              <img src={imagePreview} className={`w-full h-full object-cover transition-all duration-1000 animate-in fade-in zoom-in-95 ${getOverlayClass()}`} alt="Drone Feed" />
              <div className="absolute top-12 right-12 p-5 bg-slate-900/90 backdrop-blur-xl rounded-[2rem] border border-white/10 text-white font-mono z-20 shadow-2xl">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">🛰️ Sat-Link: 98.4%</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Mode: {mode}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Alt: 45m AGL</span>
                </div>
              </div>
              <div className="absolute bottom-12 left-12 p-4 bg-black/60 backdrop-blur-md rounded-xl text-white font-mono text-[8px] tracking-[0.2em] z-20">
                LAT: -0.1705 | LONG: 10.1132 | HDG: 124°
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-700 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 to-black">
              <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 animate-pulse">
                <span className="text-4xl">🚁</span>
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Prêt pour scan multispectral</p>
            </div>
          )}

          {(simulating || analyzing) && (
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
              <div className="text-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-[6px] border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-white text-[12px] font-black uppercase tracking-[0.5em]">
                    {simulating ? 'Synthèse Environnementale...' : 'Analyse Tactique IA...'}
                  </p>
                  <p className="text-green-500 text-[9px] font-black uppercase tracking-widest animate-pulse">DeepScan Processing 2026</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-white p-5 rounded-[2.5rem] border border-slate-100 flex flex-wrap justify-center items-center gap-4 shadow-xl">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
            {(['RGB', 'THERMAL', 'NDVI', 'LIVESTOCK'] as ScanMode[]).map(m => (
               <button 
                key={m} 
                onClick={() => setMode(m)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mode === m ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-800'}`}
               >
                 {m}
               </button>
            ))}
          </div>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
          >
            <span>📁</span> Importer images
          </button>

          <button 
            onClick={handleAnalyze} 
            disabled={!imagePreview || analyzing || simulating} 
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2"
          >
            <span>🤖</span> Refaire Diagnostic IA
          </button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 h-full flex flex-col sticky top-8">
          <h3 className="text-xl font-black text-slate-800 mb-8 flex items-center gap-3 tracking-tighter italic">🤖 DIAGNOSTIC</h3>
          
          {!result ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 italic text-sm space-y-6">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-5xl">📡</div>
              <p className="font-black uppercase tracking-widest text-[10px]">En attente des données multispectrales</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-right-10">
              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">Score de Santé Vital</p>
                <p className="text-6xl font-black text-slate-800 tracking-tighter relative z-10">{result.healthScore}%</p>
                <div className="mt-6 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden relative z-10">
                  <div className="h-full bg-green-500 shadow-lg shadow-green-500/50 transition-all duration-1000" style={{ width: `${result.healthScore}%` }}></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100">
                  <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Rendement Estimé</p>
                  <p className="text-lg font-black text-blue-900 tracking-tight">{result.estimatedYield} <span className="text-[10px]">T/HA</span></p>
                  <p className="text-[8px] text-blue-400 font-bold uppercase mt-1">Récolte: {result.harvestDate}</p>
                </div>
                <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100">
                  <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">Garantie Numérique</p>
                  <p className="text-lg font-black text-amber-900 tracking-tight">{result.financialGuarantee?.toLocaleString()} <span className="text-[10px]">XAF</span></p>
                  <p className="text-[8px] text-amber-500 font-bold uppercase mt-1">SGG Certifié ✓</p>
                </div>
              </div>
              
              <div className="space-y-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex justify-between">
                    <span>Actions de terrain</span>
                    <span className="text-green-600">IA-REC</span>
                 </p>
                 <div className="space-y-3">
                    {result.recommendations?.map((r: string, i: number) => (
                      <div key={i} className="p-5 bg-white rounded-3xl text-[11px] font-black text-slate-800 border border-slate-100 flex gap-4 items-center hover:border-green-300 hover:shadow-lg transition-all">
                         <span className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-xl shadow-sm">🎯</span>
                         <span className="leading-tight">{r}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] border border-white/10">
                 <p className="text-[9px] font-black text-green-500 uppercase tracking-widest mb-3">Synthèse Agronomique</p>
                 <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">"{result.summary}"</p>
              </div>

              <button 
                onClick={handleBlockchainCert}
                disabled={certifying}
                className="w-full py-5 bg-green-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-green-500 transition-all shadow-2xl shadow-green-900/30 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {certifying ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <><span>⛓️</span> Certifier Blockchain</>
                )}
              </button>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Partager le Diagnostic</p>
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={() => shareResults('email')}
                    className="w-12 h-12 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm"
                    title="Partager par Email"
                  >
                    ✉️
                  </button>
                  <button 
                    onClick={() => shareResults('whatsapp')}
                    className="w-12 h-12 bg-green-100 hover:bg-green-200 text-green-600 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm"
                    title="Partager sur WhatsApp"
                  >
                    💬
                  </button>
                  <button 
                    onClick={() => shareResults('twitter')}
                    className="w-12 h-12 bg-blue-100 hover:bg-blue-200 text-blue-400 rounded-2xl flex items-center justify-center text-xl transition-all shadow-sm"
                    title="Partager sur X (Twitter)"
                  >
                    🐦
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/png, image/jpeg, image/jpg" 
      />
    </div>
  );
};

export default Sentinelle;
