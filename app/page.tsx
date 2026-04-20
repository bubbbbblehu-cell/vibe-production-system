'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { seedDatabase } from '@/lib/seed-data';

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [dataStats, setDataStats] = useState({ products: 0, materials: 0, inventory: 0 });

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    const productCount = await db.products.count();
    const materialCount = await db.materials.count();
    const inventoryCount = await db.inventory.count();

    setDataStats({ products: productCount, materials: materialCount, inventory: inventoryCount });
    setIsInitialized(productCount > 0);
  };

  const handleInitialize = async () => {
    await seedDatabase();
    await checkDatabase();
  };

  const handleExport = async () => {
    const data = {
      products: await db.products.toArray(),
      materials: await db.materials.toArray(),
      inventory: await db.inventory.toArray(),
      bom: await db.bom.toArray(),
      tasks: await db.tasks.toArray(),
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vibe-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const data = JSON.parse(text);

    await db.products.clear();
    await db.materials.clear();
    await db.inventory.clear();
    await db.bom.clear();
    await db.tasks.clear();

    await db.products.bulkAdd(data.products);
    await db.materials.bulkAdd(data.materials);
    await db.inventory.bulkAdd(data.inventory);
    await db.bom.bulkAdd(data.bom);
    await db.tasks.bulkAdd(data.tasks);

    await checkDatabase();
    alert('数据导入成功！');
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">中控台</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">产品数</div>
          <div className="text-3xl font-bold text-blue-600">{dataStats.products}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">物料数</div>
          <div className="text-3xl font-bold text-green-600">{dataStats.materials}</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-sm text-gray-500">库存记录</div>
          <div className="text-3xl font-bold text-purple-600">{dataStats.inventory}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">数据管理</h2>

        {!isInitialized ? (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-800 mb-3">系统未初始化，请先加载测试数据</p>
            <button
              onClick={handleInitialize}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              初始化测试数据
            </button>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800">系统已就绪</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            导出数据 (JSON)
          </button>

          <label className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 cursor-pointer">
            导入数据 (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
