import { useState } from 'react';
import { CATEGORIES } from '../data/digest';

export default function Header({ data, activeCategory, onCategoryChange }) {
  const [subscribed, setSubscribed] = useState(false);

  const allCategories = [
    { id: 'all', label: '全部', color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', icon: '✦' },
    ...Object.values(CATEGORIES),
  ];

  return (
    <header style={{ background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a0f 100%)' }}
      className="border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              AI
            </div>
            <div>
              <div className="text-white font-semibold text-sm leading-none">高管AI日报</div>
              <div className="text-white/40 text-xs mt-0.5">Executive AI Digest</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-white/60 text-xs">{data.date} {data.weekday}</div>
              <div className="text-white/30 text-xs">第 {data.edition} 期</div>
            </div>
            <button
              onClick={() => setSubscribed(!subscribed)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer"
              style={{
                background: subscribed ? 'rgba(99,102,241,0.15)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: subscribed ? '#818cf8' : 'white',
                border: subscribed ? '1px solid rgba(99,102,241,0.3)' : 'none',
              }}>
              {subscribed ? '✓ 已订阅' : '每日订阅'}
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {allCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex-shrink-0"
              style={{
                background: activeCategory === cat.id ? cat.bg : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat.id ? cat.color : 'rgba(255,255,255,0.4)',
                border: `1px solid ${activeCategory === cat.id ? cat.color + '40' : 'transparent'}`,
              }}>
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
