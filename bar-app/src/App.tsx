import { useState } from 'react';
import Header from './components/Header';
import MapView from './components/MapView';
import BarList from './components/BarList';
import BarForm from './components/BarForm';
import { useBars } from './hooks/useBars';
import type { Bar, View } from './types';

export default function App() {
  const { bars, addBar, updateBar, deleteBar } = useBars();
  const [view, setView] = useState<View>('map');
  const [pendingCoords, setPendingCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [editingBar, setEditingBar] = useState<Bar | null>(null);
  const [selectedBarId, setSelectedBarId] = useState<string | null>(null);

  const handleMapClick = (lat: number, lng: number) => {
    if (editingBar) return;
    setPendingCoords({ lat, lng });
  };

  const handleSave = (bar: Bar) => {
    if (editingBar) {
      updateBar(bar.id, bar);
    } else {
      addBar(bar);
    }
    setPendingCoords(null);
    setEditingBar(null);
  };

  const handleEdit = (bar: Bar) => {
    setEditingBar(bar);
    setPendingCoords({ lat: bar.lat, lng: bar.lng });
    setView('map');
  };

  const handleLocate = (bar: Bar) => {
    setSelectedBarId(bar.id);
    setView('map');
    setTimeout(() => setSelectedBarId(null), 3000);
  };

  const handleClose = () => {
    setPendingCoords(null);
    setEditingBar(null);
  };

  return (
    <div className="app">
      <Header view={view} onViewChange={setView} totalBars={bars.length} />

      <main className="app-main">
        <div className={`map-wrapper ${view === 'map' ? 'visible' : 'hidden'}`}>
          <MapView
            bars={bars}
            onMapClick={handleMapClick}
            onBarClick={bar => {
              setEditingBar(bar);
              setPendingCoords({ lat: bar.lat, lng: bar.lng });
            }}
            selectedBarId={selectedBarId}
          />
          <div className="map-hint">点击地图任意位置来标记酒吧</div>
        </div>

        {view === 'list' && (
          <BarList
            bars={bars}
            onLocate={handleLocate}
            onEdit={handleEdit}
            onDelete={deleteBar}
          />
        )}
      </main>

      {pendingCoords && (
        <BarForm
          lat={pendingCoords.lat}
          lng={pendingCoords.lng}
          initialData={editingBar}
          onSave={handleSave}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
