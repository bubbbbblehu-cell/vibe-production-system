import Dexie, { Table } from 'dexie';

export interface Material {
  id?: number;
  name: string;
  unit: string;
  category: 'raw' | 'semi' | 'finished';
  shelfLife?: number; // 保质期（小时）
  yieldRate?: number; // 出品率（用于半成品加工）
}

export interface Inventory {
  id?: number;
  materialId: number;
  quantity: number;
  arrivalDate?: string;
  expiryDate?: string;
  supplier?: string;
}

export interface BOMItem {
  id?: number;
  productId: number;
  materialId: number;
  quantity: number;
  unit: string;
}

export interface ProductionTask {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  duration: number; // 分钟
}

export interface Product {
  id?: number;
  name: string;
  category: string;
}

class ProductionDB extends Dexie {
  materials!: Table<Material>;
  inventory!: Table<Inventory>;
  bom!: Table<BOMItem>;
  tasks!: Table<ProductionTask>;
  products!: Table<Product>;

  constructor() {
    super('ProductionDB');
    this.version(1).stores({
      materials: '++id, name, category',
      inventory: '++id, materialId, arrivalDate',
      bom: '++id, productId, materialId',
      tasks: '++id, productId, scheduledDate, status',
      products: '++id, name'
    });
  }
}

export const db = new ProductionDB();
