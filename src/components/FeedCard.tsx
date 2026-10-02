'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { Heart, Share2, MapPin, Calendar, CheckCircle2, Award, ArrowUpRight, TrendingUp } from 'lucide-react';

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDonate?: (ngoId: string) => void;
  onSelectNGO?: (ngoSlug: string) => void;
}

export default function FeedCard({ post, onLike, onDonate, onSelectNGO }: FeedCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [copied, setCopied] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikesCount((prev) => prev + 1);
      onLike?.(post.id);
    } else {
      setLiked(false);
      setLikesCount((prev) => Math.max(0, prev - 1));
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const badgeConfig = {
    past_impact: {
      label: 'Verified Past Impact',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    upcoming_event: {
      label: 'Upcoming Community Event',
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
    <article className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow overflow-hidden">
      
      {/* Post Header: NGO Info */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div 
            onClick={() => post.ngo && onSelectNGO?.(post.ngo.slug)}
            className="cursor-pointer relative w-12 h-12 rounded-full overflow-hidden border border-slate-200 shrink-0 hover:opacity-90 transition-opacity"
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
                className="font-semibold text-slate-900 hover:text-emerald-600 transition-colors text-base text-left"
              >
                {post.ngo?.name || 'Community NGO'}
              </button>
              {post.ngo?.verified && (
                <span title="Verified Transparent NGO" className="text-emerald-600">
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
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Score: <strong className="text-slate-900">{post.ngo.transparency_score}</strong>/100</span>
          </div>
        )}
      </div>

      {/* Post Activity Badge */}
      <div className="px-4 sm:px-5 pb-2">
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeConfig.bg}`}>
          {badgeConfig.label}
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
        <div className="relative w-full h-72 sm:h-96 bg-slate-100 overflow-hidden">
          <Image
            src={post.media_url}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Impact Metric Banner */}
      {post.people_reached > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white px-4 sm:px-5 py-3 border-y border-emerald-100/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs text-slate-500 font-medium block">Audited Impact Metric</span>
              <span className="text-sm font-bold text-emerald-800">
                {post.people_reached.toLocaleString('en-IN')} {post.metrics_label}
              </span>
            </div>
          </div>

          <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
            Proof Logged
          </span>
        </div>
      )}

      {/* Action Footer */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              liked
                ? 'bg-rose-50 text-rose-600'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{likesCount}</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-400" />
            <span>{copied ? 'Copied Link!' : 'Share'}</span>
          </button>
        </div>

        {/* Donate / Support Button */}
        {post.ngo_id && (
          <button
            onClick={() => onDonate?.(post.ngo_id)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg transition-colors"
          >
            <span>Support Cause</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </article>
  );
}
