import { db, BOMItem, Inventory, Material } from './db';

export interface ATPResult {
  productId: number;
  productName: string;
  availableQuantity: number;
  bottleneck?: {
    materialId: number;
    materialName: string;
    required: number;
    available: number;
  };
}

export async function calculateATP(productId: number): Promise<ATPResult> {
  const product = await db.products.get(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  const bomItems = await db.bom.where('productId').equals(productId).toArray();

  if (bomItems.length === 0) {
    return {
      productId,
      productName: product.name,
      availableQuantity: 0
    };
  }

  let minQuantity = Infinity;
  let bottleneckMaterial: ATPResult['bottleneck'];

  for (const bomItem of bomItems) {
    const material = await db.materials.get(bomItem.materialId);
    const inventoryRecords = await db.inventory
      .where('materialId')
      .equals(bomItem.materialId)
      .toArray();

    const totalAvailable = inventoryRecords.reduce((sum, inv) => {
      if (inv.expiryDate) {
        const expiry = new Date(inv.expiryDate);
        if (expiry < new Date()) return sum;
      }
      return sum + inv.quantity;
    }, 0);

    const possibleQuantity = Math.floor(totalAvailable / bomItem.quantity);

    if (possibleQuantity < minQuantity) {
      minQuantity = possibleQuantity;
      bottleneckMaterial = {
        materialId: bomItem.materialId,
        materialName: material?.name || 'Unknown',
        required: bomItem.quantity,
        available: totalAvailable
      };
    }
  }

  return {
    productId,
    productName: product.name,
    availableQuantity: minQuantity === Infinity ? 0 : minQuantity,
    bottleneck: minQuantity < 100 ? bottleneckMaterial : undefined
  };
}

export async function calculateAllATP(): Promise<ATPResult[]> {
  const products = await db.products.toArray();
  const results = await Promise.all(
    products.map(p => calculateATP(p.id!))
  );
  return results;
}
