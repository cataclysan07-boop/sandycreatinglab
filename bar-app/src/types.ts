export interface Bar {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  visitDate: string;
  notes: string;
  tags: string[];
  createdAt: string;
}

export type View = 'map' | 'list';
