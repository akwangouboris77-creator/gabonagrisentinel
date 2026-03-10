
import React from 'react';
import { Language, t } from '../services/i18n';
import DataFlowSchema from './DataFlowSchema';

interface BusinessPlanProps {
  lang: Language;
}

const BusinessPlan: React.FC<BusinessPlanProps> = ({ lang }) => {
  const [isExporting, setIsExporting] = React.useState(false);

  const budgetData = [
    { item: "Infrastructure Starlink & IoT", cost: "450,000,000", desc: "Déploiement de 500 nœuds de connectivité rurale." },
    { item: "Flotte Drone Sentinelle v4", cost: "280,000,000", desc: "200 unités avec capteurs multispectraux." },
    { item: "Développement Blockchain & IA", cost: "150,000,000", desc: "Maintenance du registre souverain et modèles IA." },
    { item: "Fonds de Garantie SGG", cost: "1,200,000,000", desc: "Couverture des risques pour les petits producteurs." },
    { item: "Logistique & Hubs Froids", cost: "320,000,000", desc: "Sécurisation de la chaîne de valeur." }
  ];

  const handleExport = () => {
    setIsExporting(true);
    const element = document.getElementById('business-plan-content');
    
    // @ts-ignore
    if (typeof html2pdf !== 'undefined' && element) {
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'Business_Plan_Agri_Sentinel_2026.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          logging: false,
          letterRendering: true
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      
      // @ts-ignore
      html2pdf().set(opt).from(element).save().then(() => {
        setIsExporting(false);
      }).catch((err: any) => {
        console.error("Export error", err);
        setIsExporting(false);
        window.print();
      });
    } else {
      window.print();
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-green-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="inline-block px-4 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-[10px] font-black text-green-400 uppercase tracking-[0.3em] mb-4">
              Document Confidentiel • G-AS 2026
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
              BUSINESS <span className="text-green-500 text-outline-white">PLAN</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest mt-4 text-sm">
              Partenariat Stratégique Bancaire & Souveraineté Alimentaire
            </p>
          </div>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50"
          >
            {isExporting ? (
              <><div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin"></div> GÉNÉRATION...</>
            ) : (
              <>📥 EXPORTER LE DOSSIER (PDF)</>
            )}
          </button>
        </div>
      </div>

      <div id="business-plan-content" className="space-y-12">
        {/* Executive Summary */}
        <section className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black">01</div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Résumé Exécutif</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <p className="text-slate-600 font-medium leading-relaxed">
              Gabon Agri-Sentinel (G-AS) est la première plateforme nationale de titrisation agricole basée sur l'IA et la Blockchain. Notre mission est de transformer le risque agricole en actif financier liquide et sécurisé pour les banques gabonaises.
            </p>
            <p className="text-slate-600 font-medium leading-relaxed">
              En intégrant la **Société de Garantie du Gabon (SGG)** au cœur du processus, nous offrons une couverture de risque à 100% sur le gage biologique, permettant aux banques de prêter massivement au secteur agricole sans exposition directe.
            </p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Objectifs Clés 2026</h4>
            <div className="space-y-3">
              {[
                "Financement de 5,000 petits producteurs",
                "Réduction de 40% des importations alimentaires",
                "Taux de défaut inférieur à 2% (IA Monitoring)",
                "Certification Blockchain de 100% des récoltes"
              ].map((obj, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  <span className="text-[11px] font-black text-slate-700 uppercase">{obj}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Flow Visualization */}
      <section className="space-y-6">
        <div className="flex items-center gap-4 ml-4">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-xl font-black">02</div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Architecture de Confiance</h3>
        </div>
        <DataFlowSchema light />
        <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest italic">
          Ce flux garantit la transparence totale pour le banquier : de la graine au remboursement.
        </p>
      </section>

      {/* Financials & Budget */}
      <section className="bg-slate-950 p-12 rounded-[3.5rem] shadow-2xl border border-white/5 text-white space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500 text-white rounded-2xl flex items-center justify-center text-xl font-black">03</div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Budget Prévisionnel (FCFA)</h3>
        </div>
        
        <div className="overflow-hidden rounded-3xl border border-white/10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Poste d'Investissement</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Montant (FCFA)</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Impact Stratégique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {budgetData.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="p-6">
                    <p className="text-xs font-black uppercase">{row.item}</p>
                    <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">{row.desc}</p>
                  </td>
                  <td className="p-6 font-black text-green-400 text-sm">{row.cost}</td>
                  <td className="p-6">
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{width: `${80 + i * 4}%`}}></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-white/10">
                <td className="p-6 text-xs font-black uppercase">Total Investissement Phase 1</td>
                <td className="p-6 font-black text-white text-lg">2,400,000,000</td>
                <td className="p-6 text-[9px] font-black text-green-400 uppercase tracking-widest">ROI Social & Financier Garanti</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </section>

      {/* Strategic Partnership for Banks */}
      <section className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 space-y-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500 text-white rounded-2xl flex items-center justify-center text-xl font-black">04</div>
          <h3 className="text-2xl font-black uppercase tracking-tighter italic">Pourquoi les Banques ?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
            <div className="text-3xl">🛡️</div>
            <h4 className="text-xs font-black uppercase tracking-tight">Zéro Risque de Crédit</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">
              Le mécanisme de garantie SGG couplé au monitoring IA assure un remboursement prioritaire sur les ventes certifiées.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
            <div className="text-3xl">📊</div>
            <h4 className="text-xs font-black uppercase tracking-tight">Data-Driven Lending</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">
              Accédez à des tableaux de bord en temps réel sur la santé des cultures financées. Plus besoin d'experts terrain coûteux.
            </p>
          </div>
          <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-4">
            <div className="text-3xl">🌍</div>
            <h4 className="text-xs font-black uppercase tracking-tight">Conformité ESG</h4>
            <p className="text-[10px] text-slate-500 font-medium leading-relaxed uppercase">
              Répondez aux exigences de finance durable et d'inclusion financière tout en générant des marges saines.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <div className="bg-green-600 p-12 rounded-[3.5rem] text-white text-center space-y-6 shadow-2xl shadow-green-900/20">
        <h3 className="text-3xl font-black uppercase tracking-tighter italic">Bâtissons l'Indépendance du Gabon</h3>
        <p className="text-green-100 font-bold uppercase tracking-widest text-xs max-w-2xl mx-auto">
          Nous invitons les institutions financières à rejoindre le consortium G-AS pour sécuriser le futur alimentaire de la nation.
        </p>
        <div className="flex justify-center gap-4">
          <button className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            Prendre Contact (SGG)
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default BusinessPlan;
