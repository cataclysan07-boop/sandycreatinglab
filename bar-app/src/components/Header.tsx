import { Map, List, Beer } from 'lucide-react';
import type { View } from '../types';

interface Props {
  view: View;
  onViewChange: (v: View) => void;
  totalBars: number;
}

export default function Header({ view, onViewChange, totalBars }: Props) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <Beer size={22} className="brand-icon" />
        <span className="brand-name">BarMark</span>
        {totalBars > 0 && <span className="bar-count">{totalBars}</span>}
      </div>
      <nav className="header-nav">
        <button
          className={`nav-btn ${view === 'map' ? 'active' : ''}`}
          onClick={() => onViewChange('map')}
        >
          <Map size={16} />
          <span>地图</span>
        </button>
        <button
          className={`nav-btn ${view === 'list' ? 'active' : ''}`}
          onClick={() => onViewChange('list')}
        >
          <List size={16} />
          <span>列表</span>
        </button>
      </nav>
    </header>
  );
}
