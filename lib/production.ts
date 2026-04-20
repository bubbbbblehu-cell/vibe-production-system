import { db } from './db';

export async function completeProduction(productId: number, quantity: number) {
  const bomItems = await db.bom.where('productId').equals(productId).toArray();

  for (const bomItem of bomItems) {
    const requiredQty = bomItem.quantity * quantity;
    const inventoryRecords = await db.inventory
      .where('materialId')
      .equals(bomItem.materialId)
      .toArray();

    let remaining = requiredQty;

    for (const inv of inventoryRecords) {
      if (remaining <= 0) break;

      if (inv.quantity >= remaining) {
        await db.inventory.update(inv.id!, { quantity: inv.quantity - remaining });
        remaining = 0;
      } else {
        remaining -= inv.quantity;
        await db.inventory.delete(inv.id!);
      }
    }

    if (remaining > 0) {
      throw new Error(`物料不足: ${bomItem.materialId}`);
    }
  }

  const material = await db.materials.get(productId);
  if (material?.category === 'semi') {
    const today = new Date().toISOString();
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + (material.shelfLife || 4));

    await db.inventory.add({
      materialId: productId,
      quantity: quantity * (material.yieldRate || 1),
      arrivalDate: today,
      expiryDate: expiryDate.toISOString()
    });
  }

  return { success: true };
}
