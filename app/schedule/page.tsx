'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/db';
import { calculateATP } from '@/lib/atp';
import { addDays } from 'date-fns';

interface Task {
  id?: number;
  productId: number;
  productName: string;
  quantity: number;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  duration: number;
}

export default function SchedulePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const allProducts = await db.products.toArray();
    const allTasks = await db.tasks.toArray();
    setProducts(allProducts);
    setTasks(allTasks);
  };

  const handleAddTask = async () => {
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    const atpResult = await calculateATP(selectedProduct);

    if (atpResult.availableQuantity < quantity) {
      alert(`库存不足！当前可生产: ${atpResult.availableQuantity} 份\n瓶颈物料: ${atpResult.bottleneck?.materialName || '未知'}`);
      return;
    }

    await db.tasks.add({
      productId: selectedProduct,
      productName: product?.name || '',
      quantity,
      scheduledDate: selectedDate,
      scheduledTime: '09:00',
      status: 'pending',
      duration: 30
    });

    await loadData();
    alert('排程成功！');
  };

  const getDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(addDays(new Date(), i));
    }
    return days;
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">智能排程</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">新增排程</h2>
        <div className="grid grid-cols-4 gap-4">
          <select
            value={selectedProduct || ''}
            onChange={(e) => setSelectedProduct(Number(e.target.value))}
            className="px-3 py-2 border rounded"
          >
            <option value="">选择产品</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="数量"
            className="px-3 py-2 border rounded"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded"
          />

          <button
            onClick={handleAddTask}
            disabled={!selectedProduct}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300"
          >
            添加排程
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">未来 7 天排程</h2>
        </div>
        <div className="flex">
          {getDays().map((day, idx) => (
            <div key={idx} className="flex-1 min-w-[150px] border-r last:border-r-0">
              <div className="p-3 bg-gray-50 border-b font-medium text-center">
                {day.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                <div className="text-xs text-gray-500">{day.toLocaleDateString('zh-CN', { weekday: 'short' })}</div>
              </div>
              <div className="p-2 space-y-2 min-h-[300px]">
                {tasks
                  .filter(t => t.scheduledDate === day.toISOString().split('T')[0])
                  .map(task => (
                    <div
                      key={task.id}
                      className={`p-2 rounded text-sm ${
                        task.status === 'completed' ? 'bg-green-100' :
                        task.status === 'in_progress' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}
                    >
                      <div className="font-medium">{task.productName}</div>
                      <div className="text-xs text-gray-600">{task.quantity} 份</div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
