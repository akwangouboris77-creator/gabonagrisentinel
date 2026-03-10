
import React from 'react';
import { Language, t } from '../services/i18n';

interface UserGuideProps {
  lang: Language;
}

const UserGuide: React.FC<UserGuideProps> = ({ lang }) => {
  const sections = [
    {
      title: "🚀 Introduction",
      content: "Gabon Agri-Sentinel (G-AS) est une infrastructure numérique souveraine conçue pour transformer l'agriculture gabonaise. Elle connecte les producteurs, les investisseurs, les banques et les acheteurs via un écosystème sécurisé par la Blockchain et audité par Intelligence Artificielle (Drones)."
    },
    {
      title: "👨‍🌾 Espace Producteur (Hub)",
      content: "C'est ici que tout commence. En tant que producteur, vous pouvez :\n\n• **Enrôlement** : Inscrivez votre exploitation en scannant votre Agrément PME.\n• **Audit Drone** : Demandez un survol pour certifier la santé de vos cultures.\n• **Abonnement** : Choisissez un pack (Familial, PME, Industriel) pour accéder aux services Starlink et IoT.\n• **Tokenisation** : Transformez vos récoltes futures en 'Tokens' pour obtenir un financement immédiat."
    },
    {
      title: "🚁 Sentinelle (IA Drone)",
      content: "Le cœur technologique de G-AS. Utilisez cet outil pour :\n\n• **Diagnostic IA** : Analysez des images de drones pour détecter les maladies ou le stress hydrique.\n• **Simulation** : Testez des scénarios de croissance selon la météo.\n• **Certification** : Émettez un certificat blockchain inaltérable prouvant la valeur de votre production."
    },
    {
      title: "💎 Marché des Tokens (Investisseurs)",
      content: "Permet aux citoyens et institutions de financer directement la souveraineté alimentaire :\n\n• **Achat de Tokens** : Achetez des parts de récoltes futures (Manioc, Banane, Volaille).\n• **Garantie SGG** : Chaque investissement est protégé par la Société de Garantie du Gabon.\n• **ROI** : Recevez votre retour sur investissement lors de la vente finale de la récolte."
    },
    {
      title: "🚛 Hub Logistique IoT",
      content: "Gère le transport sécurisé des produits :\n\n• **Tracking Temps-Réel** : Suivez les camions via Starlink.\n• **Chaîne du Froid** : Monitoring constant de la température des soutes frigo.\n• **Audit IoT** : L'IA optimise les trajets et prévient les pannes."
    },
    {
      title: "🏦 Portail SGG / BCEG (Banques)",
      content: "Outil de supervision pour les institutions financières :\n\n• **Gage Biologique** : Utilisez les audits drones comme garantie pour débloquer des crédits.\n• **Décaissement Split** : Paiement automatique sécurisé (Producteur + Frais Plateforme).\n• **Grand Livre** : Historique transparent de toutes les compensations."
    },
    {
      title: "🛒 Centrale d'Achat (Acheteurs)",
      content: "Pour les supermarchés et exportateurs :\n\n• **Off-take Agreements** : Réservez des récoltes entières avant même qu'elles ne soient mûres.\n• **Remise Pré-paiement** : Bénéficiez de 10% de réduction en payant en avance.\n• **Traçabilité** : Certitude sur l'origine et la qualité des produits."
    },
    {
      title: "⛓️ Registre National (Blockchain)",
      content: "Le journal de bord inaltérable de l'agriculture gabonaise. Chaque action (scan, vente, transport) est enregistrée pour garantir une transparence totale et prévenir la fraude."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700 pb-24">
      <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/10">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-green-500/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-6">
            Mode d' <span className="text-green-500">Emploi</span>
          </h2>
          <p className="text-slate-400 max-w-2xl font-medium italic text-lg">
            Guide complet pour maîtriser l'infrastructure Gabon Agri-Sentinel et participer à la révolution agricole nationale.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, index) => (
          <div key={index} className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all group">
            <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight italic flex items-center gap-3">
              {section.title}
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-line italic">
              {section.content}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-10 rounded-[3.5rem] border border-blue-100 text-center">
        <h4 className="text-xl font-black text-blue-900 uppercase tracking-tighter mb-4 italic">Besoin d'assistance en direct ?</h4>
        <p className="text-sm text-blue-700 font-medium italic mb-8 max-w-2xl mx-auto">
          Utilisez l'Assistant Live (icône 🤖 en bas à droite) pour poser vos questions techniques ou opérationnelles en temps réel.
        </p>
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="px-10 py-4 bg-blue-600 text-white rounded-[2rem] font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-blue-500 transition-all"
        >
          Retour en haut
        </button>
      </div>
    </div>
  );
};

export default UserGuide;
