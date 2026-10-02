'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { 
  Heart, 
  Share2, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Award, 
  ArrowUpRight, 
  TrendingUp,
  Layers,
  ShieldCheck,
  Camera,
  Clock
} from 'lucide-react';

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDonate?: (ngoId: string) => void;
  onSelectNGO?: (ngoSlug: string) => void;
  onViewImpactChain?: (post: Post) => void;
}

type ReactionType = 'heart' | 'hands' | 'light' | 'clap';

export default function FeedCard({ 
  post, 
  onLike, 
  onDonate, 
  onSelectNGO,
  onViewImpactChain 
}: FeedCardProps) {
  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(null);
  const [likesCount, setLikesCount] = useState(post.likes_count || 12);
  const [copied, setCopied] = useState(false);

  const toggleReaction = (type: ReactionType) => {
    if (activeReaction === type) {
      setActiveReaction(null);
      setLikesCount((prev) => Math.max(0, prev - 1));
    } else {
      if (!activeReaction) {
        setLikesCount((prev) => prev + 1);
      }
      setActiveReaction(type);
      onLike?.(post.id);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const badgeConfig = {
    past_impact: {
      label: 'Verified Ground Impact',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    upcoming_event: {
      label: 'Upcoming Community Drive',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    story: {
      label: 'Beneficiary Story',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
  }[post.activity_type] || {
    label: 'Community Update',
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <article className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden">
      
      {/* Post Header: NGO Info */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => post.ngo && onSelectNGO?.(post.ngo.slug)}
            className="cursor-pointer relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shrink-0 hover:opacity-90 transition-opacity shadow-2xs"
          >
            <Image
              src={post.ngo?.logo_url || 'https://images.unsplash.com/photo-1541802645635-11f2286a7482?w=160&auto=format&fit=crop'}
              alt={post.ngo?.name || 'NGO'}
              fill
              className="object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => post.ngo && onSelectNGO?.(post.ngo.slug)}
                className="font-bold text-slate-900 hover:text-emerald-600 transition-colors text-base text-left"
              >
                {post.ngo?.name || 'Community NGO'}
              </button>
              {post.ngo?.verified && (
                <span title="Verified Transparent NGO (Platform Reviewed)" className="text-emerald-600">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {post.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {new Date(post.event_date).toLocaleDateString('en-IN', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Transparency Score Tag */}
        {post.ngo?.transparency_score && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Score: <strong className="text-slate-900">{post.ngo.transparency_score}</strong>/100</span>
          </div>
        )}
      </div>

      {/* Post Activity Badges & Traceability Tags */}
      <div className="px-4 sm:px-5 pb-2 flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full border ${badgeConfig.bg}`}>
          {badgeConfig.label}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          <Camera className="w-3 h-3 text-slate-400" />
          <span>Photos Verified</span>
        </span>
        <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>GPS Geotagged</span>
        </span>
      </div>

      {/* Title & Body */}
      <div className="px-4 sm:px-5 pb-3">
        <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Post Image */}
      {post.media_url && (
        <div className="relative w-full h-72 sm:h-96 bg-slate-100 overflow-hidden group">
          <Image
            src={post.media_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-101 transition-transform duration-300"
          />
          {/* Ground Stamp Overlay */}
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/20">
            <Clock className="w-3 h-3 text-amber-300" />
            <span>Field Dispatch Stamp • {post.location}</span>
          </div>
        </div>
      )}

      {/* Impact Metric Banner */}
      {post.people_reached > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-4 sm:px-5 py-3 border-y border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Reported Ground Metric</span>
              <span className="text-sm font-extrabold text-emerald-800">
                {post.people_reached.toLocaleString('en-IN')} {post.metrics_label}
              </span>
            </div>
          </div>

          {/* Quick trigger to open Impact Chain */}
          <button
            type="button"
            onClick={() => onViewImpactChain?.(post)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-bold transition-all shadow-2xs hover:shadow-xs"
            title="Inspect where funds came from and what invoices generated this impact"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Trace Chain</span>
          </button>
        </div>
      )}

      {/* Action Footer */}
      <div className="px-4 sm:px-5 py-3.5 flex items-center justify-between bg-white border-t border-slate-100">
        
        {/* Social Reactions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Heart reaction */}
          <button
            type="button"
            onClick={() => toggleReaction('heart')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeReaction === 'heart'
                ? 'bg-rose-50 text-rose-600 border border-rose-200'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Love this impact"
          >
            <Heart className={`w-4 h-4 ${activeReaction === 'heart' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{likesCount}</span>
          </button>

          {/* Hands gratitude reaction */}
          <button
            type="button"
            onClick={() => toggleReaction('hands')}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              activeReaction === 'hands' ? 'bg-amber-50 border border-amber-200 scale-110' : 'hover:bg-slate-100'
            }`}
            title="Grateful"
          >
            <span>🙌</span>
          </button>

          {/* Inspired reaction */}
          <button
            type="button"
            onClick={() => toggleReaction('light')}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              activeReaction === 'light' ? 'bg-purple-50 border border-purple-200 scale-110' : 'hover:bg-slate-100'
            }`}
            title="Inspiring"
          >
            <span>💡</span>
          </button>

          {/* Kudos reaction */}
          <button
            type="button"
            onClick={() => toggleReaction('clap')}
            className={`p-1.5 rounded-xl text-xs transition-colors ${
              activeReaction === 'clap' ? 'bg-emerald-50 border border-emerald-200 scale-110' : 'hover:bg-slate-100'
            }`}
            title="Well done"
          >
            <span>👏</span>
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors ml-1"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{copied ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Support & Chain Actions */}
        <div className="flex items-center gap-2">
          {post.ngo_id && (
            <button
              type="button"
              onClick={() => onDonate?.(post.ngo_id)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/90 px-3 py-1.5 rounded-xl transition-colors border border-emerald-200/60"
            >
              <span>Support NGO</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

    </article>
  );
}
