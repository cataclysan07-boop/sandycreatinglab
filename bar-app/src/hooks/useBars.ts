import { useState, useEffect } from 'react';
import type { Bar } from '../types';

const STORAGE_KEY = 'bar-discovery-bars';

export function useBars() {
  const [bars, setBars] = useState<Bar[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bars));
  }, [bars]);

  const addBar = (bar: Bar) => setBars(prev => [...prev, bar]);

  const updateBar = (id: string, updates: Partial<Bar>) =>
    setBars(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));

  const deleteBar = (id: string) =>
    setBars(prev => prev.filter(b => b.id !== id));

  return { bars, addBar, updateBar, deleteBar };
}
