'use client';

import { useEffect, useState } from 'react';
import { calculateAllATP, ATPResult } from '@/lib/atp';

export default function BIPage() {
  const [atpResults, setAtpResults] = useState<ATPResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadATP();
  }, []);

  const loadATP = async () => {
    setLoading(true);
    const results = await calculateAllATP();
    setAtpResults(results);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">BI 决策</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">BI 决策 - 剩余配套分析</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">产品</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">可生产数量</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">瓶颈物料</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {atpResults.map((result) => (
              <tr key={result.productId}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{result.productName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-2xl font-bold ${
                    result.availableQuantity === 0 ? 'text-red-600' :
                    result.availableQuantity < 10 ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    {result.availableQuantity}
                  </span>
                  <span className="text-gray-500 ml-2">杯</span>
                </td>
                <td className="px-6 py-4">
                  {result.bottleneck ? (
                    <div className="text-sm">
                      <div className="font-medium text-red-600">{result.bottleneck.materialName}</div>
                      <div className="text-gray-500">
                        需要: {result.bottleneck.required} / 可用: {result.bottleneck.available.toFixed(2)}
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-400">无瓶颈</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  {result.availableQuantity === 0 ? (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">缺料</span>
                  ) : result.availableQuantity < 10 ? (
                    <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">库存低</span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">充足</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={loadATP}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        刷新数据
      </button>
    </div>
  );
}
