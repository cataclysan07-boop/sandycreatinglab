import { useState } from 'react';
import { CATEGORIES } from '../data/digest';

const IMPORTANCE_LABELS = { high: '重点关注', medium: '值得了解', low: '扩展阅读' };
const TREND_ICONS = { up: '↑', down: '↓', neutral: '→' };
const TREND_COLORS = { up: '#10b981', down: '#ef4444', neutral: '#94a3b8' };

export default function DigestCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const cat = CATEGORIES[item.category];

  return (
    <article
      className="rounded-2xl border transition-all duration-200 cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: expanded ? cat.color + '30' : 'rgba(255,255,255,0.06)',
      }}
      onClick={() => setExpanded(!expanded)}>

      {/* Card header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Index */}
            <span className="text-2xl font-black tabular-nums leading-none"
              style={{ color: 'rgba(255,255,255,0.08)' }}>
              {String(index).padStart(2, '0')}
            </span>

            {/* Category badge */}
            <span className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: cat.bg, color: cat.color }}>
              {cat.icon} {cat.label}
            </span>

            {/* Importance badge */}
            {item.importance === 'high' && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
                ● 重点
              </span>
            )}
          </div>

          {/* Right meta */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xs font-bold tabular-nums"
              style={{ color: TREND_COLORS[item.trend] }}>
              {TREND_ICONS[item.trend]}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}>
              {item.impactScore}
            </span>
            <button
              className="text-sm transition-all cursor-pointer"
              style={{ color: bookmarked ? '#f59e0b' : 'rgba(255,255,255,0.2)' }}
              onClick={e => { e.stopPropagation(); setBookmarked(!bookmarked); }}>
              {bookmarked ? '★' : '☆'}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-white font-semibold leading-snug mb-3 group-hover:text-white/90 transition-colors"
          style={{ fontSize: '15px' }}>
          {item.title}
        </h3>

        {/* Summary preview */}
        <p className="text-white/50 leading-relaxed" style={{ fontSize: '13px' }}>
          {expanded ? item.summary : item.summary.slice(0, 80) + '...'}
        </p>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5" onClick={e => e.stopPropagation()}>
          {/* Insight box */}
          <div className="rounded-xl p-4 mb-4"
            style={{ background: cat.bg, borderLeft: `3px solid ${cat.color}` }}>
            <div className="text-xs font-semibold mb-1.5" style={{ color: cat.color }}>
              高管洞察
            </div>
            <p className="leading-relaxed" style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
              {item.insight}
            </p>
          </div>

          {/* Tags + meta */}
          <div className="flex items-center justify-between">
            <div className="flex gap-1.5 flex-wrap">
              {item.tags.map(tag => (
                <span key={tag} className="px-2 py-0.5 rounded text-xs"
                  style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                  #{tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 text-xs flex-shrink-0"
              style={{ color: 'rgba(255,255,255,0.3)' }}>
              <span>{item.source}</span>
              <span>{item.readTime}分钟阅读</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom expand hint */}
      {!expanded && (
        <div className="px-5 pb-4 flex items-center justify-between">
          <div className="flex gap-1.5 flex-wrap">
            {item.tags.slice(0, 2).map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded text-xs"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}>
                #{tag}
              </span>
            ))}
          </div>
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            {item.source} · {item.readTime}min
          </span>
        </div>
      )}
    </article>
  );
}
