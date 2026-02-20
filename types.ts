
export enum View {
  DASHBOARD = 'DASHBOARD',
  PRODUCER_HUB = 'PRODUCER_HUB',
  SENTINELLE = 'SENTINELLE',
  MARKETPLACE = 'MARKETPLACE',
  LOGISTICS = 'LOGISTICS',
  SGG_PORTAL = 'SGG_PORTAL',
  BLOCKCHAIN = 'BLOCKCHAIN',
  ADMIN_FINANCE = 'ADMIN_FINANCE',
  MEDIA_KIT = 'MEDIA_KIT',
  BUYER_HUB = 'BUYER_HUB'
}

export interface CropHealthData {
  time: string;
  chlorophyll: number;
  waterStress: number;
}

export interface LivestockAsset {
  id: string;
  owner: string;
  type: 'BOVIN' | 'PORCIN' | 'VOLAILLE';
  status: 'STABLE' | 'ALERTE' | 'MOUVEMENT';
  temp: number;
  lat: number;
  lng: number;
  heartbeat: number;
  lastUpdate: string;
}

export interface SoilSensor {
  id: string;
  location: string;
  moisture: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  battery: number;
}

export interface FarmToken {
  id: string;
  farmerName: string;
  cropType: 'BANANE' | 'MANIOC' | 'VOLAILLE';
  location: string;
  pricePerUnit: number;
  totalTokens: number;
  soldTokens: number;
  expectedHarvest: string;
  yieldProbability: number;
  insuranceLevel: string;
}

export interface TruckRoute {
  id: string;
  driverName: string;
  origin: string;
  destination: string;
  availableCapacity: number;
  temperatureControl: boolean;
  departureTime: string;
  currentLat: number;
  currentLng: number;
  status: 'RETOUR_VIDE' | 'EN_TRANSIT' | 'DISPONIBLE';
  fuelLevel: number;
  engineHealth: number;
  cargoTemp?: number;
  cargoHumidity?: number;
}

export interface Investor {
  id: string;
  name: string;
  type: 'INDIVIDUAL' | 'INSTITUTIONAL';
  joinedDate: string;
  totalInvested: number;
  status: 'ACTIVE' | 'PENDING';
}

export interface BlockchainTx {
  id: string;
  timestamp: string;
  type: 'VALIDATION_DRONE' | 'TOKEN_MINT' | 'SGG_GUARANTEE' | 'LOGISTIC_MATCH' | 'PAYOUT' | 'PREORDER_RESERVATION';
  details: string;
  hash: string;
  status: 'CONFIRMED' | 'PENDING';
}
