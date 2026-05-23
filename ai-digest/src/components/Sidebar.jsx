import { CATEGORIES } from '../data/digest';

export default function Sidebar({ items }) {
  const categoryCount = Object.entries(CATEGORIES).map(([key, cat]) => ({
    ...cat,
    count: items.filter(i => i.category === key).length,
    avgScore: (items.filter(i => i.category === key).reduce((s, i) => s + i.impactScore, 0) /
      (items.filter(i => i.category === key).length || 1)).toFixed(1),
  }));

  const topItems = [...items].sort((a, b) => b.impactScore - a.impactScore).slice(0, 3);

  return (
    <aside className="space-y-4">
      {/* Stats card */}
      <div className="rounded-2xl p-4 border border-white/5"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">今日概览</div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: '精选条目', value: items.length },
            { label: '重点关注', value: items.filter(i => i.importance === 'high').length },
            { label: '平均影响', value: (items.reduce((s, i) => s + i.impactScore, 0) / items.length).toFixed(1) },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <div className="text-xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-white/30 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl p-4 border border-white/5"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">分类分布</div>
        <div className="space-y-2.5">
          {categoryCount.map(cat => (
            <div key={cat.id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs" style={{ color: cat.color }}>
                  {cat.icon} {cat.label}
                </span>
                <span className="text-xs text-white/30">{cat.count}条</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${(cat.count / items.length) * 100}%`, background: cat.color, opacity: 0.7 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top picks */}
      <div className="rounded-2xl p-4 border border-white/5"
        style={{ background: 'rgba(255,255,255,0.03)' }}>
        <div className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">影响力 TOP 3</div>
        <div className="space-y-3">
          {topItems.map((item, i) => {
            const cat = CATEGORIES[item.category];
            return (
              <div key={item.id} className="flex gap-2.5">
                <span className="text-lg font-black leading-none flex-shrink-0 mt-0.5"
                  style={{ color: ['#f59e0b', '#94a3b8', '#cd7c3a'][i] }}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-white/70 leading-snug" style={{ fontSize: '12px' }}>
                    {item.title.length > 30 ? item.title.slice(0, 30) + '...' : item.title}
                  </p>
                  <span className="text-xs mt-0.5 inline-block" style={{ color: cat.color }}>
                    {cat.label} · {item.impactScore}分
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trend summary */}
      <div className="rounded-2xl p-4 border"
        style={{ background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: '#818cf8' }}>本周主题词</div>
        <div className="flex flex-wrap gap-1.5">
          {['AI Native组织', '判断力', '人机协作', 'ROI分化', '决策韧性', 'Agent OS'].map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: 'rgba(99,102,241,0.15)', color: '#a5b4fc' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}
