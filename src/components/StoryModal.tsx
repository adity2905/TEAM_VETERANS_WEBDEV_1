'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, MapPin, Clock, ChevronLeft, ChevronRight, IndianRupee, Users, ShieldCheck, Heart, Share2 
} from 'lucide-react';
import { StoryItem, STORIES_DATA } from './ImpactStoriesBar';

interface StoryModalProps {
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onDonate?: (fundraiserId: string) => void;
  onVolunteer?: (volunteerId: string) => void;
}

export default function StoryModal({
  initialIndex,
  isOpen,
  onClose,
  onDonate,
  onVolunteer,
}: StoryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setHasLiked(false);
    setCopied(false);
  }, [initialIndex, isOpen]);

  if (!isOpen || STORIES_DATA.length === 0) return null;

  const currentStory = STORIES_DATA[currentIndex] || STORIES_DATA[0];

  const handleNext = () => {
    if (currentIndex < STORIES_DATA.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setHasLiked(false);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setHasLiked(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none">
      
      {/* Navigation Arrow Left */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center transition"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container */}
      <div className="relative w-full max-w-sm sm:max-w-md h-[82vh] max-h-[720px] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col justify-between border border-white/10">
        
        {/* Background Image */}
        <img
          src={currentStory.coverImage}
          alt={currentStory.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90 pointer-events-none" />

        {/* Top Header & Progress Indicators */}
        <div className="relative z-10 p-4 space-y-3">
          
          {/* Segmented Progress Bars */}
          <div className="flex gap-1.5">
            {STORIES_DATA.map((s, idx) => (
              <div
                key={s.id}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className={`h-full bg-white rounded-full transition-all duration-300 ${
                    idx < currentIndex
                      ? 'w-full'
                      : idx === currentIndex
                      ? 'w-full animate-pulse'
                      : 'w-0'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* Author NGO info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentStory.ngoLogo}
                alt={currentStory.ngoName}
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-md"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm text-white drop-shadow-sm">
                    {currentStory.ngoName}
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-300">
                  <span className="flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    {currentStory.timeAgo}
                  </span>
                  <span>•</span>
                  <span className="bg-emerald-500/30 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase">
                    {currentStory.tag}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Mid Tap Zones for mobile skip */}
        <div className="absolute inset-y-20 inset-x-0 z-0 flex">
          <div className="w-1/2 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-1/2 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Details & Direct Actions */}
        <div className="relative z-10 p-5 space-y-3.5">
          
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-lg w-fit">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{currentStory.location}</span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white leading-snug drop-shadow-sm">
              {currentStory.title}
            </h3>
            <p className="text-xs text-slate-200 mt-1.5 line-clamp-3 leading-relaxed drop-shadow-xs">
              {currentStory.description}
            </p>
          </div>

          {/* Metrics Capsule */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs text-white font-medium flex items-center justify-between">
            <span className="text-slate-300 text-[11px]">Ground Output:</span>
            <span className="font-bold text-emerald-300">{currentStory.metricsPreview}</span>
          </div>

          {/* Interactive Action Bar */}
          <div className="flex items-center gap-2 pt-1">
            {currentStory.fundraiserId && onDonate && (
              <button
                onClick={() => {
                  onClose();
                  onDonate(currentStory.fundraiserId!);
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 transition"
              >
                <IndianRupee className="w-4 h-4" />
                Support This Effort
              </button>
            )}

            {currentStory.volunteerId && onVolunteer && (
              <button
                onClick={() => {
                  onClose();
                  onVolunteer(currentStory.volunteerId!);
                }}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30 transition"
              >
                <Users className="w-4 h-4" />
                Join Team
              </button>
            )}

            <button
              onClick={() => setHasLiked(!hasLiked)}
              className={`p-2.5 rounded-xl backdrop-blur-md border transition ${
                hasLiked 
                  ? 'bg-rose-500 text-white border-rose-400' 
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition"
              title="Share story"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>

          {copied && (
            <p className="text-[11px] text-emerald-400 text-center animate-pulse">
              ✓ Story link copied to clipboard!
            </p>
          )}

        </div>

      </div>

      {/* Navigation Arrow Right */}
      {currentIndex < STORIES_DATA.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 text-white items-center justify-center transition"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

    </div>
  );
}
