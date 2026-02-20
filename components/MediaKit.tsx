
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

type AssetType = 'IMAGE' | 'VIDEO';

interface GeneratedAsset {
  id: string;
  type: AssetType;
  url: string;
  title: string;
  desc: string;
  timestamp: number;
}

const MediaKit: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AssetType>('IMAGE');
  const [isGenerating, setIsGenerating] = useState(false);
  const [assets, setAssets] = useState<GeneratedAsset[]>([]);
  const [selectedStyle, setSelectedStyle] = useState('Réalité Terrain');
  const [loadingMessage, setLoadingMessage] = useState("");

  const styles = [
    { 
      name: 'Réalité Terrain', 
      icon: '📸', 
      prompt: 'High-end professional agricultural photography, morning light over Gabonese plantations, cinematic depth, 8k photorealistic, proving crop viability' 
    },
    { 
      name: 'Rendu Technique', 
      icon: '📐', 
      prompt: 'Technical isometric architectural rendering of an IoT sensor station in a cassava field, digital data overlays, white minimalist tech style, 8k' 
    },
    { 
      name: 'Souveraineté (ESG)', 
      icon: '🇬🇦', 
      prompt: 'Inspirational cinematic view of Gabonese modern agriculture, national flag colors subtly integrated in landscape, social impact theme, high-quality professional lighting' 
    },
  ];

  const videoPrompts = [
    { 
      title: "Audit Drone (Gage)", 
      context: "A tactical multispectral drone scan over a large scale banana plantation in Gabon, showing heatmaps and health analysis overlays, professional drone cinematography" 
    },
    { 
      title: "Sécurisation IoT", 
      context: "A smart truck fleet with sensor-lit containers driving through a controlled logistics corridor, displaying real-time temperature and fuel data holograms" 
    },
    { 
      title: "Infrastructure G-AS", 
      context: "A futuristic central monitoring hub in Libreville with Gabonese experts analyzing large satellite and drone maps, high-tech collaborative environment" 
    }
  ];

  const messages = [
    "Initialisation du moteur de rendu institutionnel...",
    "Calibration des paramètres de souveraineté...",
    "Génération des preuves visuelles pour dossier bancaire...",
    "Optimisation du rendu photoréaliste (Gabon-Pro)...",
    "Finalisation de l'actif certifié G-AS..."
  ];

  useEffect(() => {
    let msgIndex = 0;
    let interval: any;
    if (isGenerating && activeTab === 'VIDEO') {
      setLoadingMessage(messages[0]);
      interval = setInterval(() => {
        msgIndex = (msgIndex + 1) % messages.length;
        setLoadingMessage(messages[msgIndex]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating, activeTab]);

  const handleSelectKey = async () => {
    try {
      if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
        await window.aistudio.openSelectKey();
      }
    } catch (e) {
      console.error("Erreur lors de l'ouverture du sélecteur de clé", e);
    }
  };

  const handleGenerateImage = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const style = styles.find(s => s.name === selectedStyle);
      const prompt = `GABON AGRI-SENTINEL INSTITUTIONAL: ${style?.prompt}. 8k resolution, professional grade for bank investment decks.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const url = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            const newAsset: GeneratedAsset = {
              id: Date.now().toString(),
              type: 'IMAGE',
              url,
              title: `Visuel ${selectedStyle}`,
              desc: "Généré pour Business Plan & Dossier de Crédit.",
              timestamp: Date.now()
            };
            setAssets(prev => [newAsset, ...prev]);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Erreur image:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateVideo = async (videoPreset: typeof videoPrompts[0]) => {
    setIsGenerating(true);
    try {
      if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: `GABON AGRI-SENTINEL PROFESSIONAL AUDIT: ${videoPreset.context}. Cinematic, detailed, slow movement, realistic.`,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await videoResponse.blob();
        const url = URL.createObjectURL(blob);
        
        const newAsset: GeneratedAsset = {
          id: Date.now().toString(),
          type: 'VIDEO',
          url,
          title: videoPreset.title,
          desc: "Clip de preuve technologique pour audit bancaire.",
          timestamp: Date.now()
        };
        setAssets(prev => [newAsset, ...prev]);
      }
    } catch (error: any) {
      console.error("Erreur vidéo:", error);
      if (error.message?.includes("Requested entity was not found")) {
        alert("Problème de clé API. Veuillez sélectionner une clé valide d'un projet payant.");
        await handleSelectKey();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadAsset = async (asset: GeneratedAsset) => {
    const link = document.createElement('a');
    link.href = asset.url;
    link.download = `${asset.title.replace(/\s+/g, '_')}_${asset.id}.${asset.type === 'IMAGE' ? 'png' : 'mp4'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4 tracking-tighter uppercase italic">KIT <span className="text-blue-500">BANQUES & INVESTISSEURS</span></h2>
            <p className="text-slate-400 font-medium italic leading-relaxed">
              Générez des visuels certifiés et des clips de preuve pour vos dossiers de financement (BGFIBank, BICIG, BGD). Démontrez la robustesse de votre exploitation par l'image de précision.
            </p>
          </div>
          <div className="flex bg-white/5 p-1.5 rounded-[2rem] border border-white/10 backdrop-blur-md">
            <button 
              onClick={() => setActiveTab('IMAGE')} 
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'IMAGE' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
            >
              Images Pruebas
            </button>
            <button 
              onClick={() => setActiveTab('VIDEO')} 
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'VIDEO' ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'}`}
            >
              Audit Vidéo
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 italic">Paramètres Crédit</h3>
            
            {activeTab === 'IMAGE' ? (
              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Style Documentaire</p>
                {styles.map(s => (
                  <button
                    key={s.name}
                    onClick={() => setSelectedStyle(s.name)}
                    className={`w-full p-5 rounded-2xl border flex items-center gap-4 transition-all ${selectedStyle === s.name ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-white'}`}
                  >
                    <span className="text-2xl">{s.icon}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                  </button>
                ))}
                <button
                  onClick={handleGenerateImage}
                  disabled={isGenerating}
                  className="w-full mt-6 py-5 bg-blue-600 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-blue-500 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Générer Preuve Visuelle'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Audit Tactique (Veo 3.1)</p>
                {videoPrompts.map((vp, i) => (
                  <button
                    key={i}
                    onClick={() => handleGenerateVideo(vp)}
                    disabled={isGenerating}
                    className="w-full p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left group hover:bg-white hover:border-blue-500 transition-all shadow-sm"
                  >
                    <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{vp.title}</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Simuler Audit 5s →</p>
                  </button>
                ))}
                <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                   <p className="text-[8px] font-bold text-blue-700 uppercase leading-relaxed italic">Note: Le rendu cinématique nécessite une clé API payante du projet SGG-Core.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-3">
          {isGenerating ? (
            <div className="bg-slate-900 p-24 rounded-[3.5rem] flex flex-col items-center justify-center text-center gap-8 border border-white/5 shadow-2xl animate-pulse">
               <div className="relative">
                  <div className="w-24 h-24 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-3xl">🛡️</div>
               </div>
               <div>
                  <p className="text-white text-xl font-black uppercase tracking-[0.4em]">{activeTab === 'IMAGE' ? 'Synthèse Probante IA...' : 'Rendu Audit Cinématique...'}</p>
                  <p className="text-blue-500 text-xs font-black uppercase mt-2 tracking-widest italic">{loadingMessage || "Traitement du dossier de financement"}</p>
               </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {assets.filter(a => a.type === activeTab).map((asset) => (
                <div key={asset.id} className="bg-white rounded-[3rem] overflow-hidden shadow-xl border border-slate-100 group animate-in zoom-in-95">
                  <div className="aspect-video relative overflow-hidden bg-slate-900">
                    {asset.type === 'IMAGE' ? (
                      <img src={asset.url} alt={asset.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    ) : (
                      <video src={asset.url} controls className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-20">
                      <button 
                        onClick={() => downloadAsset(asset)}
                        className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-2"
                      >
                        📥 Exporter pour BP
                      </button>
                    </div>
                  </div>
                  <div className="p-8 flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-slate-800 uppercase tracking-tight">{asset.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 italic">{asset.desc}</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-300">REF: G-AS-{asset.id.slice(-4)}</span>
                  </div>
                </div>
              ))}
              
              {assets.filter(a => a.type === activeTab).length === 0 && (
                <div className="col-span-full py-40 text-center opacity-20 border-2 border-dashed border-slate-200 rounded-[3.5rem]">
                  <span className="text-8xl mb-6 block">{activeTab === 'IMAGE' ? '📜' : '🏢'}</span>
                  <p className="text-xl font-black uppercase tracking-[0.4em]">Bibliothèque de Preuves Vide</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest mt-2 italic">Générez des actifs pour enrichir votre dossier financier</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-slate-900 p-12 rounded-[3.5rem] text-white relative overflow-hidden shadow-2xl border border-white/5">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
         <div className="max-w-4xl">
            <h3 className="text-2xl font-black uppercase tracking-tighter mb-6 flex items-center gap-3 italic">
              <span className="text-blue-500">🛡️</span> GUIDE D'INTÉGRATION BANCAIRE
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-[11px] font-bold leading-relaxed opacity-90 italic uppercase tracking-tighter">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-blue-400 mb-2">Section: Étude de Marché</p>
                  <p>Utilisez les **Réalités Terrain** pour démontrer la maturité de vos cultures et le professionnalisme de vos équipes.</p>
               </div>
               <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-blue-400 mb-2">Section: Maîtrise des Risques</p>
                  <p>Insérez les **Rendus Techniques** et clips d'**Audit Drone** pour rassurer sur la protection du gage biologique par la SGG.</p>
               </div>
               <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-blue-400 mb-2">Section: Impact National</p>
                  <p>Les visuels **Souveraineté (ESG)** facilitent l'accès aux lignes de crédit bonifiées (CDC, Fonds Souverains).</p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default MediaKit;
