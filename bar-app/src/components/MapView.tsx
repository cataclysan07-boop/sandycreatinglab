import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Bar } from '../types';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const visitedIcon = L.divIcon({
  html: `<div class="map-pin visited">🍸</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -38],
});

interface Props {
  bars: Bar[];
  onMapClick: (lat: number, lng: number) => void;
  onBarClick: (bar: Bar) => void;
  selectedBarId?: string | null;
}

export default function MapView({ bars, onMapClick, onBarClick, selectedBarId }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    mapRef.current = L.map(containerRef.current).setView([20, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapRef.current);

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentIds = new Set(bars.map(b => b.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    bars.forEach(bar => {
      if (markersRef.current.has(bar.id)) {
        markersRef.current.get(bar.id)!.setLatLng([bar.lat, bar.lng]);
      } else {
        const marker = L.marker([bar.lat, bar.lng], { icon: visitedIcon })
          .addTo(map)
          .bindPopup(`
            <div class="map-popup">
              <strong>${bar.name}</strong>
              <div class="popup-meta">${[bar.city, bar.country].filter(Boolean).join(', ')}</div>
              <div class="popup-rating">${'★'.repeat(bar.rating)}${'☆'.repeat(5 - bar.rating)}</div>
            </div>
          `);
        marker.on('click', () => onBarClick(bar));
        markersRef.current.set(bar.id, marker);
      }
    });
  }, [bars]);

  useEffect(() => {
    if (!selectedBarId || !mapRef.current) return;
    const bar = bars.find(b => b.id === selectedBarId);
    if (!bar) return;
    mapRef.current.flyTo([bar.lat, bar.lng], 14, { duration: 1 });
    markersRef.current.get(selectedBarId)?.openPopup();
  }, [selectedBarId]);

  return <div ref={containerRef} className="map-container" />;
}
