'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: '中控台', path: '/', icon: '🎛️' },
  { name: '供应链输入', path: '/supply', icon: '📦' },
  { name: '智能排程', path: '/schedule', icon: '📊' },
  { name: 'BI 决策', path: '/bi', icon: '📈' },
  { name: '车间执行', path: '/workshop', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Vibe 生产系统</h1>
        <p className="text-sm text-gray-500 mt-1">Local-First 模式</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
        数据存储：浏览器本地
      </div>
    </aside>
  );
}
