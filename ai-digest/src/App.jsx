import { useState } from 'react';
import Header from './components/Header';
import DigestCard from './components/DigestCard';
import Sidebar from './components/Sidebar';
import AIAssistant from './components/AIAssistant';
import { DIGEST_DATA } from './data/digest';
import './index.css';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('index');

  const filtered = DIGEST_DATA.headlines.filter(item =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'impact') return b.impactScore - a.impactScore;
    return a.id - b.id;
  });

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0f' }}>
      <Header
        data={DIGEST_DATA}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {/* Page title row */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-white font-black leading-none mb-1" style={{ fontSize: '28px' }}>
              今日AI要情
            </h1>
            <p className="text-white/40 text-sm">
              {filtered.length} 条精选 · 为管理层视角策划
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/30">排序</span>
            {[
              { id: 'index', label: '编辑推荐' },
              { id: 'impact', label: '影响力' },
            ].map(s => (
              <button key={s.id}
                onClick={() => setSortBy(s.id)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer"
                style={{
                  background: sortBy === s.id ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                  color: sortBy === s.id ? '#818cf8' : 'rgba(255,255,255,0.4)',
                  border: `1px solid ${sortBy === s.id ? 'rgba(99,102,241,0.3)' : 'transparent'}`,
                }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Main feed */}
          <div className="space-y-3">
            {sorted.map((item) => (
              <DigestCard key={item.id} item={item} index={item.id} />
            ))}

            {sorted.length === 0 && (
              <div className="text-center py-16" style={{ color: 'rgba(255,255,255,0.2)' }}>
                该分类暂无内容
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <Sidebar items={DIGEST_DATA.headlines} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-center" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>
            高管AI日报 · MVP原型 · 每个工作日 07:00 推送
          </p>
          <p className="text-center mt-1" style={{ color: 'rgba(255,255,255,0.1)', fontSize: '12px' }}>
            内容由AI筛选 + 编辑策划 · 不构成投资建议
          </p>
        </footer>
      </main>
      <AIAssistant />
    </div>
  );
}
