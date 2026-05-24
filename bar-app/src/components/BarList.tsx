import { useState, useMemo } from 'react';
import { Search, MapPin, Star, Pencil, Trash2, SortAsc } from 'lucide-react';
import type { Bar } from '../types';

interface Props {
  bars: Bar[];
  onLocate: (bar: Bar) => void;
  onEdit: (bar: Bar) => void;
  onDelete: (id: string) => void;
}

type SortKey = 'date' | 'rating' | 'name' | 'city';

export default function BarList({ bars, onLocate, onEdit, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return bars
      .filter(b =>
        !q ||
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q) ||
        b.tags.some(t => t.includes(q))
      )
      .sort((a, b) => {
        if (sortKey === 'date') return b.visitDate.localeCompare(a.visitDate);
        if (sortKey === 'rating') return b.rating - a.rating;
        if (sortKey === 'name') return a.name.localeCompare(b.name);
        if (sortKey === 'city') return a.city.localeCompare(b.city);
        return 0;
      });
  }, [bars, search, sortKey]);

  const grouped = useMemo(() => {
    const groups: Record<string, Bar[]> = {};
    filtered.forEach(bar => {
      const key = [bar.country, bar.city].filter(Boolean).join(' · ') || '未知位置';
      if (!groups[key]) groups[key] = [];
      groups[key].push(bar);
    });
    return groups;
  }, [filtered]);

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      onDelete(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
    }
  };

  return (
    <div className="list-view">
      <div className="list-toolbar">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="搜索酒吧、城市、标签..."
          />
        </div>
        <div className="sort-box">
          <SortAsc size={16} />
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)}>
            <option value="date">按日期</option>
            <option value="rating">按评分</option>
            <option value="name">按名称</option>
            <option value="city">按城市</option>
          </select>
        </div>
      </div>

      {bars.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🍸</div>
          <p>还没有标记过酒吧</p>
          <p className="empty-hint">在地图上点击任意位置来添加第一家！</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p>没有找到匹配的酒吧</p>
        </div>
      ) : (
        <div className="bar-groups">
          {Object.entries(grouped).map(([location, locationBars]) => (
            <div key={location} className="bar-group">
              <div className="group-header">
                <MapPin size={14} />
                <span>{location}</span>
                <span className="group-count">{locationBars.length}</span>
              </div>
              {locationBars.map(bar => (
                <div key={bar.id} className="bar-card">
                  <div className="bar-card-main" onClick={() => onLocate(bar)}>
                    <div className="bar-card-name">{bar.name}</div>
                    <div className="bar-card-meta">
                      <span className="bar-rating">
                        {[1,2,3,4,5].map(s => (
                          <Star key={s} size={12} className={s <= bar.rating ? 'star-filled' : 'star-empty'} />
                        ))}
                      </span>
                      <span className="bar-date">{bar.visitDate}</span>
                    </div>
                    {bar.tags.length > 0 && (
                      <div className="bar-tags">
                        {bar.tags.map(tag => <span key={tag} className="tag-badge">{tag}</span>)}
                      </div>
                    )}
                    {bar.notes && <p className="bar-notes">{bar.notes}</p>}
                  </div>
                  <div className="bar-card-actions">
                    <button className="icon-btn-sm" onClick={() => onEdit(bar)} title="编辑">
                      <Pencil size={14} />
                    </button>
                    <button
                      className={`icon-btn-sm ${confirmDelete === bar.id ? 'danger' : ''}`}
                      onClick={() => handleDelete(bar.id)}
                      title={confirmDelete === bar.id ? '确认删除' : '删除'}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
