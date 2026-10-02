'use client';

import React from 'react';

export interface StoryItem {
  id: string;
  ngoName: string;
  ngoLogo: string;
  coverImage: string;
  tag: string;
  title: string;
  description: string;
  timeAgo: string;
  location: string;
  metricsPreview: string;
  fundraiserId?: string;
  volunteerId?: string;
}

export const STORIES_DATA: StoryItem[] = [
  {
    id: 's-1',
    ngoName: 'Annapurna Seva',
    ngoLogo: 'https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop&q=80',
    tag: 'Live Field Dispatch',
    title: 'Van-02 Mobilizing for Dharavi Night Distribution',
    description: '3,200 freshly prepared warm khichdi and boiled egg packets loaded. 28 youth volunteers heading out to railway transit shelters now!',
    timeAgo: '28m ago',
    location: 'Dharavi Transit Shelter, Mumbai',
    metricsPreview: '3,200 Hot Meals Ready',
    fundraiserId: 'fund-1',
  },
  {
    id: 's-2',
    ngoName: 'Vidya Vikas',
    ngoLogo: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop&q=80',
    tag: 'Classroom Live',
    title: 'Solar Coding Lab Inaugurated in Channapatna',
    description: '65 high school girls launched their first Python games! Solar battery is holding up beautifully through rural power cuts.',
    timeAgo: '2h ago',
    location: 'Channapatna High School, Karnataka',
    metricsPreview: '65 Girls Learning Code',
    fundraiserId: 'fund-2',
  },
  {
    id: 's-3',
    ngoName: 'Prakriti Earth',
    ngoLogo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop&q=80',
    tag: 'Miyawaki Forest',
    title: 'Sapling Digging Complete for Sunday Plantation',
    description: '2,000 native neem and peepal saplings delivered to the Rohini bypass site. Ready for weekend volunteer squad.',
    timeAgo: '4h ago',
    location: 'Sector 23 Rohini, New Delhi',
    metricsPreview: '2,000 Native Saplings',
    volunteerId: 'vol-3',
  },
  {
    id: 's-4',
    ngoName: 'Jeev Raksha',
    ngoLogo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=160&auto=format&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&auto=format&fit=crop&q=80',
    tag: 'Trauma Clinic',
    title: 'Sheru Took His First Steps Today!',
    description: 'Rescued from highway fracture 3 weeks ago, Sheru is finally walking after orthopedic therapy. Healing beautifully!',
    timeAgo: '5h ago',
    location: 'Jeev Raksha Hospital, Pune',
    metricsPreview: '1 Miracle Recovery',
  },
];

interface ImpactStoriesBarProps {
  onOpenStory?: (index: number) => void;
  onSelectStory?: (index: number) => void;
}

export default function ImpactStoriesBar({ onOpenStory, onSelectStory }: ImpactStoriesBarProps) {
  const handleStoryClick = (idx: number) => {
    if (onSelectStory) onSelectStory(idx);
    else if (onOpenStory) onOpenStory(idx);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3.5 mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <span>Live Field Dispatches</span>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              Today
            </span>
          </h3>
        </div>
        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
          Tap circle to view live ground story
        </span>
      </div>

      {/* Horizontal Story Rings */}
      <div className="flex items-center gap-4 overflow-x-auto pb-1 scrollbar-none">
        {STORIES_DATA.map((story, idx) => (
          <button
            key={story.id}
            onClick={() => handleStoryClick(idx)}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
          >
            {/* Story Ring */}
            <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-emerald-500 to-teal-400 group-hover:scale-105 transition-transform duration-200 shadow-xs">
              <div className="p-0.5 bg-white rounded-full">
                <img
                  src={story.ngoLogo}
                  alt={story.ngoName}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white text-[9px] font-bold px-1 py-0.2 rounded-full border border-white">
                LIVE
              </span>
            </div>

            {/* Label */}
            <div className="text-center max-w-[80px]">
              <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 truncate block leading-tight">
                {story.ngoName}
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                {story.timeAgo}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
