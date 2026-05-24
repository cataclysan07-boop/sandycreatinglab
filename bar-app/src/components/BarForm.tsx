import { useState } from 'react';
import { X, Star, MapPin } from 'lucide-react';
import type { Bar } from '../types';

const PRESET_TAGS = ['鸡尾酒', '精酿啤酒', '清吧', '烈酒', '现场音乐', '天台', '深夜营业', '复古风格', '海景', 'LGBTQ+'];

interface Props {
  lat: number;
  lng: number;
  initialData?: Bar | null;
  onSave: (bar: Bar) => void;
  onClose: () => void;
}

export default function BarForm({ lat, lng, initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name ?? '');
  const [country, setCountry] = useState(initialData?.country ?? '');
  const [city, setCity] = useState(initialData?.city ?? '');
  const [address, setAddress] = useState(initialData?.address ?? '');
  const [rating, setRating] = useState(initialData?.rating ?? 0);
  const [visitDate, setVisitDate] = useState(initialData?.visitDate ?? new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState(initialData?.notes ?? '');
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? []);
  const [hoverRating, setHoverRating] = useState(0);

  const toggleTag = (tag: string) =>
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      id: initialData?.id ?? crypto.randomUUID(),
      name: name.trim(),
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      lat,
      lng,
      rating,
      visitDate,
      notes: notes.trim(),
      tags,
      createdAt: initialData?.createdAt ?? new Date().toISOString(),
    });
  };

  return (
    <div className="bar-form-overlay" onClick={onClose}>
      <div className="bar-form" onClick={e => e.stopPropagation()}>
        <div className="bar-form-header">
          <div className="bar-form-title">
            <MapPin size={18} className="pin-icon" />
            <h2>{initialData ? '编辑酒吧' : '标记新酒吧'}</h2>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="bar-form-body">
          <div className="form-group">
            <label>酒吧名称 *</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Bar Bossa"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>国家</label>
              <input value={country} onChange={e => setCountry(e.target.value)} placeholder="e.g. 日本" />
            </div>
            <div className="form-group">
              <label>城市</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. 东京" />
            </div>
          </div>

          <div className="form-group">
            <label>地址</label>
            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="街道地址（可选）" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>探店日期</label>
              <input type="date" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
            </div>
            <div className="form-group">
              <label>评分</label>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star
                    key={s}
                    size={24}
                    className={`star ${s <= (hoverRating || rating) ? 'filled' : ''}`}
                    onClick={() => setRating(s)}
                    onMouseEnter={() => setHoverRating(s)}
                    onMouseLeave={() => setHoverRating(0)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>标签</label>
            <div className="tag-grid">
              {PRESET_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  className={`tag-chip ${tags.includes(tag) ? 'active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>探店笔记</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="记录你的感受、推荐酒款、氛围..."
              rows={4}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>取消</button>
            <button type="submit" className="btn-primary">保存</button>
          </div>
        </form>
      </div>
    </div>
  );
}
