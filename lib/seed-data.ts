import { db } from './db';

export async function seedDatabase() {
  await db.materials.clear();
  await db.inventory.clear();
  await db.bom.clear();
  await db.products.clear();
  await db.tasks.clear();

  // 原料
  const materials = await db.materials.bulkAdd([
    { name: '草莓', unit: 'kg', category: 'raw', shelfLife: 48 },
    { name: '鲜牛乳', unit: 'L', category: 'raw', shelfLife: 72 },
    { name: '咖啡豆', unit: 'kg', category: 'raw', shelfLife: 720 },
    { name: '厚椰乳', unit: 'L', category: 'raw', shelfLife: 168 },
    { name: '芒果', unit: 'kg', category: 'raw', shelfLife: 72 },
    { name: '西米', unit: 'kg', category: 'raw', shelfLife: 8760 },
    { name: '椰奶', unit: 'L', category: 'raw', shelfLife: 168 },
    { name: '柠檬', unit: '颗', category: 'raw', shelfLife: 120 },
    { name: '红西柚', unit: '颗', category: 'raw', shelfLife: 168 },
    { name: '燕麦奶', unit: 'L', category: 'raw', shelfLife: 168 },
    { name: '可可粉', unit: 'kg', category: 'raw', shelfLife: 8760 },
    { name: '炼乳', unit: 'L', category: 'raw', shelfLife: 2160 },
    { name: '冰块', unit: 'kg', category: 'raw', shelfLife: 720 },
    { name: '绿茶叶', unit: 'kg', category: 'raw', shelfLife: 4320 },
    { name: '纯净水', unit: 'L', category: 'raw', shelfLife: 8760 },
    { name: '奶盖粉', unit: 'kg', category: 'raw', shelfLife: 4320 },
  ], { allKeys: true });

  // 半成品
  const semiMaterials = await db.materials.bulkAdd([
    { name: '草莓切块', unit: 'kg', category: 'semi', shelfLife: 4, yieldRate: 0.85 },
    { name: '草莓原汁', unit: 'L', category: 'semi', shelfLife: 4, yieldRate: 0.6 },
    { name: '咖啡液', unit: 'L', category: 'semi', shelfLife: 2, yieldRate: 0.15 },
    { name: '绿茶汤', unit: 'L', category: 'semi', shelfLife: 4, yieldRate: 0.2 },
    { name: '柠檬切片', unit: '片', category: 'semi', shelfLife: 2, yieldRate: 8 },
    { name: '红西柚粒', unit: 'kg', category: 'semi', shelfLife: 4, yieldRate: 0.7 },
    { name: '芒果泥', unit: 'kg', category: 'semi', shelfLife: 4, yieldRate: 0.75 },
    { name: '芝士奶盖', unit: 'L', category: 'semi', shelfLife: 4, yieldRate: 1.2 },
  ], { allKeys: true });

  // 产品
  const products = await db.products.bulkAdd([
    { name: '招牌草莓奶昔', category: '奶昔' },
    { name: '清爽草莓果汁', category: '果汁' },
    { name: '厚乳拿铁', category: '咖啡' },
    { name: '生椰拿铁', category: '咖啡' },
    { name: '杨枝甘露', category: '甜品' },
    { name: '柠檬霸气萃', category: '茶饮' },
    { name: '满杯红柚', category: '茶饮' },
    { name: '燕麦拿铁', category: '咖啡' },
    { name: '可可冰沙', category: '冰沙' },
    { name: '芝芝莓莓', category: '特调' },
  ], { allKeys: true });

  // BOM 配方
  await db.bom.bulkAdd([
    // 1. 招牌草莓奶昔
    { productId: 1, materialId: 17, quantity: 0.15, unit: 'kg' }, // 草莓切块
    { productId: 1, materialId: 2, quantity: 0.2, unit: 'L' }, // 鲜牛乳

    // 2. 清爽草莓果汁
    { productId: 2, materialId: 18, quantity: 0.1, unit: 'L' }, // 草莓原汁
    { productId: 2, materialId: 15, quantity: 0.15, unit: 'L' }, // 纯净水

    // 3. 厚乳拿铁
    { productId: 3, materialId: 19, quantity: 0.05, unit: 'L' }, // 咖啡液
    { productId: 3, materialId: 2, quantity: 0.25, unit: 'L' }, // 鲜牛乳

    // 4. 生椰拿铁
    { productId: 4, materialId: 19, quantity: 0.05, unit: 'L' }, // 咖啡液
    { productId: 4, materialId: 4, quantity: 0.2, unit: 'L' }, // 厚椰乳

    // 5. 杨枝甘露
    { productId: 5, materialId: 23, quantity: 0.12, unit: 'kg' }, // 芒果泥
    { productId: 5, materialId: 6, quantity: 0.03, unit: 'kg' }, // 西米
    { productId: 5, materialId: 7, quantity: 0.15, unit: 'L' }, // 椰奶

    // 6. 柠檬霸气萃
    { productId: 6, materialId: 21, quantity: 3, unit: '片' }, // 柠檬切片
    { productId: 6, materialId: 20, quantity: 0.25, unit: 'L' }, // 绿茶汤

    // 7. 满杯红柚
    { productId: 7, materialId: 22, quantity: 0.15, unit: 'kg' }, // 红西柚粒
    { productId: 7, materialId: 20, quantity: 0.2, unit: 'L' }, // 绿茶汤

    // 8. 燕麦拿铁
    { productId: 8, materialId: 19, quantity: 0.05, unit: 'L' }, // 咖啡液
    { productId: 8, materialId: 10, quantity: 0.25, unit: 'L' }, // 燕麦奶

    // 9. 可可冰沙
    { productId: 9, materialId: 11, quantity: 0.03, unit: 'kg' }, // 可可粉
    { productId: 9, materialId: 12, quantity: 0.05, unit: 'L' }, // 炼乳
    { productId: 9, materialId: 13, quantity: 0.3, unit: 'kg' }, // 冰块

    // 10. 芝芝莓莓
    { productId: 10, materialId: 18, quantity: 0.1, unit: 'L' }, // 草莓原汁
    { productId: 10, materialId: 24, quantity: 0.08, unit: 'L' }, // 芝士奶盖
  ]);

  // 初始库存
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db.inventory.bulkAdd([
    // 充足的原料
    { materialId: 3, quantity: 10, arrivalDate: today.toISOString(), supplier: '咖啡供应商' },
    { materialId: 6, quantity: 5, arrivalDate: today.toISOString(), supplier: '干货批发' },
    { materialId: 11, quantity: 2, arrivalDate: today.toISOString(), supplier: '干货批发' },
    { materialId: 12, quantity: 3, arrivalDate: today.toISOString(), supplier: '乳品供应商' },
    { materialId: 13, quantity: 50, arrivalDate: today.toISOString(), supplier: '制冰厂' },
    { materialId: 14, quantity: 3, arrivalDate: today.toISOString(), supplier: '茶叶供应商' },
    { materialId: 15, quantity: 100, arrivalDate: today.toISOString(), supplier: '水厂' },
    { materialId: 16, quantity: 2, arrivalDate: today.toISOString(), supplier: '乳品供应商' },

    // 瓶颈原料：牛奶仅剩 2L
    { materialId: 2, quantity: 2, arrivalDate: today.toISOString(), supplier: '乳品供应商' },

    // 明天到货：草莓 50kg
    { materialId: 1, quantity: 50, arrivalDate: tomorrow.toISOString(), supplier: '水果批发' },

    // 其他原料适量
    { materialId: 4, quantity: 10, arrivalDate: today.toISOString(), supplier: '椰奶供应商' },
    { materialId: 5, quantity: 20, arrivalDate: today.toISOString(), supplier: '水果批发' },
    { materialId: 7, quantity: 8, arrivalDate: today.toISOString(), supplier: '椰奶供应商' },
    { materialId: 8, quantity: 30, arrivalDate: today.toISOString(), supplier: '水果批发' },
    { materialId: 9, quantity: 20, arrivalDate: today.toISOString(), supplier: '水果批发' },
    { materialId: 10, quantity: 10, arrivalDate: today.toISOString(), supplier: '植物奶供应商' },
  ]);

  console.log('数据初始化完成！');
}
