'use client';

import React, { useState } from 'react';
import { NGO } from '@/types';
import { DataService } from '@/lib/dataService';
import { X, PlusCircle, Image as ImageIcon, Sparkles } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngos: NGO[];
  onPostCreated?: () => void;
}

const SAMPLE_IMAGES = [
  { label: 'Food Aid', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop' },
  { label: 'Classroom', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop' },
  { label: 'Tree Planting', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop' },
  { label: 'Animal Care', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&auto=format&fit=crop' },
];

export default function CreatePostModal({
  isOpen,
  onClose,
  ngos,
  onPostCreated,
}: CreatePostModalProps) {
  const [ngoId, setNgoId] = useState(ngos[0]?.id || 'ngo-1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activityType, setActivityType] = useState<'past_impact' | 'upcoming_event' | 'story'>('past_impact');
  const [location, setLocation] = useState('Mumbai, Maharashtra');
  const [peopleReached, setPeopleReached] = useState<number>(100);
  const [metricsLabel, setMetricsLabel] = useState('People Reached');
  const [mediaUrl, setMediaUrl] = useState(SAMPLE_IMAGES[0].url);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    try {
      await DataService.createPost({
        ngo_id: ngoId,
        title,
        content,
        activity_type: activityType,
        location,
        people_reached: Number(peopleReached) || 0,
        metrics_label: metricsLabel,
        media_url: mediaUrl,
        event_date: new Date().toISOString().split('T')[0],
      });

      onPostCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold">Publish Activity or Impact Proof</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Posting as Verified NGO
              </label>
              <select
                value={ngoId}
                onChange={(e) => setNgoId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {ngos.map((ngo) => (
                  <option key={ngo.id} value={ngo.id}>
                    {ngo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Post Category
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="past_impact">Verified Past Impact</option>
                <option value="upcoming_event">Upcoming Community Event</option>
                <option value="story">Beneficiary Story</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headline / Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Free Medical Health Checkup Camp for 400 Villagers"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Impact Story / Details
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the action taken, resources used, and community outcome..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Impact Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number Reached
              </label>
              <input
                type="number"
                min="0"
                value={peopleReached}
                onChange={(e) => setPeopleReached(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Metric Label
              </label>
              <input
                type="text"
                placeholder="e.g. Meals / Patients / Trees"
                value={metricsLabel}
                onChange={(e) => setMetricsLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Quick Preset Image Chooser */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proof Photo (URL or One-Click Demo Sample)
            </label>
            <input
              type="url"
              value={mediaUrl}
              onChange={(e) => setMediaUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-2 focus:ring-2 focus:ring-emerald-500"
            />
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Presets:
              </span>
              {SAMPLE_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setMediaUrl(img.url)}
                  className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                    mediaUrl === img.url
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                      : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Posting...' : 'Publish to Verified Feed'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
