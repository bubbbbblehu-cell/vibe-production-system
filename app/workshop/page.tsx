'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { completeProduction } from '@/lib/production';

interface Product {
  id?: number;
  name: string;
  category: string;
}

export default function WorkshopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const allProducts = await db.products.toArray();
    setProducts(allProducts);
  };

  const handleComplete = async () => {
    if (!selectedProduct) return;

    setLoading(true);
    try {
      await completeProduction(selectedProduct, quantity);
      alert(`完工成功！生产了 ${quantity} 份`);
      setQuantity(1);
    } catch (error: any) {
      alert(`完工失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">车间执行</h1>

      <div className="bg-white rounded-lg shadow p-8">
        <div className="max-w-md mx-auto space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              选择产品
            </label>
            <select
              value={selectedProduct || ''}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">请选择...</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              生产数量
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleComplete}
            disabled={!selectedProduct || loading}
            className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? '处理中...' : '✓ 完工'}
          </button>
        </div>
      </div>
    </div>
  );
}
