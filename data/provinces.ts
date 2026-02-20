
export interface Province {
  id: string;
  name: string;
  capital: string;
  lat: number;
  lng: number;
  soilType: string;
  mainCrops: string[];
}

export const provinces: Province[] = [
  { id: 'EST', name: 'Estuaire', capital: 'Libreville', lat: 0.416, lng: 9.467, soilType: 'Ferralsols acides', mainCrops: ['Manioc', 'Banane', 'Maraîchage'] },
  { id: 'WNT', name: 'Woleu-Ntem', capital: 'Oyem', lat: 1.593, lng: 11.583, soilType: 'Sols humifères fertiles', mainCrops: ['Cacao', 'Hévéa', 'Pomme de terre'] },
  { id: 'OGM', name: 'Ogooué-Maritime', capital: 'Port-Gentil', lat: -0.717, lng: 8.783, soilType: 'Sols hydromorphes sablonneux', mainCrops: ['Maraîchage', 'Noix de coco'] },
  { id: 'HOG', name: 'Haut-Ogooué', capital: 'Franceville', lat: -1.633, lng: 13.583, soilType: 'Plateaux latéritiques', mainCrops: ['Maïs', 'Soja', 'Canne à sucre'] },
  { id: 'NGN', name: 'Nyanga', capital: 'Tchibanga', lat: -2.850, lng: 11.000, soilType: 'Savanes herbeuses fertiles', mainCrops: ['Riz', 'Bovin', 'Arachide'] },
  { id: 'MOG', name: 'Moyen-Ogooué', capital: 'Lambaréné', lat: -0.700, lng: 10.233, soilType: 'Sols alluvionnaires', mainCrops: ['Banane', 'Pêche continentale'] },
  { id: 'NGO', name: 'Ngounié', capital: 'Mouila', lat: -1.867, lng: 11.550, soilType: 'Sols de plaine fertiles', mainCrops: ['Palmier à huile', 'Manioc'] },
  { id: 'OIV', name: 'Ogooué-Ivindo', capital: 'Makokou', lat: 0.567, lng: 12.867, soilType: 'Forêts denses, sols riches', mainCrops: ['Cacao', 'Café'] },
  { id: 'OLO', name: 'Ogooué-Lolo', capital: 'Koula-Moutou', lat: -1.133, lng: 12.433, soilType: 'Sols argilo-sableux', mainCrops: ['Manioc', 'Maïs'] },
];
