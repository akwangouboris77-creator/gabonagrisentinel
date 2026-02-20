
import { View, BlockchainTx, LivestockAsset, TruckRoute } from '../types';

const DB_NAME = 'GABON_AGRI_SENTINEL_DB';
const DB_VERSION = 3; 

export interface DBTranche {
  id: string;
  label: string;
  amount: number;
  condition: string;
  status: 'PENDING' | 'LOCKED' | 'PAID';
}

export interface DBCredit {
  id: string;
  farmer: string;
  amount: number;
  type: 'AGRICULTURE' | 'ÉLEVAGE';
  progress: number;
  riskScore: number;
  collateralValue: string;
  monitoring: string;
  tranches: DBTranche[];
}

export interface DBLedgerEntry {
  id: string;
  date: string;
  description: string;
  gross: number;
  fee: number;
  net: number;
  type: string;
}

export interface DBAsset {
  id: string;
  type: 'MANIOC' | 'BANANE' | 'BOVIN' | 'VOLAILLE';
  status: 'SAIN' | 'ALERTE' | 'STABLE';
  area?: string;
  count?: number;
  location: string;
  owner?: string;
  maturity?: number; // % de maturité pour les acheteurs
  estimatedYield?: number; // tonnes estimées
  pricePerTon?: number;
}

export interface DBOrder {
  id: string;
  buyerName: string;
  assetId: string;
  cropType: string;
  quantity: number;
  totalPaid: number;
  status: 'RESERVED' | 'PAID_ADVANCE' | 'DELIVERED';
  date: string;
}

export class DatabaseService {
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('credits')) {
          db.createObjectStore('credits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('ledger')) {
          db.createObjectStore('ledger', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('assets')) {
          db.createObjectStore('assets', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('logistics')) {
          db.createObjectStore('logistics', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('orders')) {
          db.createObjectStore('orders', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        
        const transaction = (event.target as any).transaction as IDBTransaction;
        
        // Seed Assets for Buyers
        const assetStore = transaction.objectStore('assets');
        assetStore.put({ 
          id: 'LOT-NTOUM-01', type: 'MANIOC', status: 'SAIN', area: '10 Ha', 
          location: 'Ntoum', maturity: 65, estimatedYield: 45, pricePerTon: 350000, owner: 'Coop Ntoum' 
        });
        assetStore.put({ 
          id: 'LOT-BITAM-02', type: 'BANANE', status: 'STABLE', area: '5 Ha', 
          location: 'Bitam', maturity: 40, estimatedYield: 20, pricePerTon: 550000, owner: 'Ferme Bitam' 
        });
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onerror = () => reject(request.error);
    });
  }

  async performTransaction<T>(
    storeName: string, 
    mode: IDBTransactionMode, 
    action: (store: IDBObjectStore) => IDBRequest
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.db) return reject("DB not initialized");
      const transaction = this.db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = action(store);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getCredits(): Promise<DBCredit[]> { return this.performTransaction('credits', 'readonly', (store) => store.getAll()); }
  async updateCredit(credit: DBCredit): Promise<void> { return this.performTransaction('credits', 'readwrite', (store) => store.put(credit)); }
  async addLedgerEntry(entry: DBLedgerEntry): Promise<void> { return this.performTransaction('ledger', 'readwrite', (store) => store.add(entry)); }
  async getLedger(): Promise<DBLedgerEntry[]> { return this.performTransaction('ledger', 'readonly', (store) => store.getAll()); }
  async getAssets(): Promise<DBAsset[]> { return this.performTransaction('assets', 'readonly', (store) => store.getAll()); }
  async addAsset(asset: DBAsset): Promise<void> { return this.performTransaction('assets', 'readwrite', (store) => store.put(asset)); }
  async getLogistics(): Promise<TruckRoute[]> { return this.performTransaction('logistics', 'readonly', (store) => store.getAll()); }
  async updateLogistics(route: TruckRoute): Promise<void> { return this.performTransaction('logistics', 'readwrite', (store) => store.put(route)); }
  
  // Orders logic
  async getOrders(): Promise<DBOrder[]> { return this.performTransaction('orders', 'readonly', (store) => store.getAll()); }
  async addOrder(order: DBOrder): Promise<void> { return this.performTransaction('orders', 'readwrite', (store) => store.add(order)); }
}

export const dbService = new DatabaseService();
