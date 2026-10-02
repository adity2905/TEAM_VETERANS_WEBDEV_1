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
  Clock,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Users,
  ExternalLink,
  Navigation,
  Send,
  Bookmark,
  Sparkles,
  Check,
  FileCheck
} from 'lucide-react';

interface FeedCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onDonate?: (ngoId: string) => void;
  onSelectNGO?: (ngoSlug: string) => void;
  onViewImpactChain?: (post: Post) => void;
}

type ReactionType = 'heart' | 'hands' | 'clap';

export default function FeedCard({ 
  post, 
  onLike, 
  onDonate, 
  onSelectNGO,
  onViewImpactChain 
}: FeedCardProps) {
  const [activeReaction, setActiveReaction] = useState<ReactionType | null>(null);
  const [likesCount, setLikesCount] = useState(post.likes_count || 18);
  const [handsCount, setHandsCount] = useState(8);
  const [clapsCount, setClapsCount] = useState(14);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isEndorsed, setIsEndorsed] = useState(false);
  const [endorsementCount, setEndorsementCount] = useState(12);
  const [copied, setCopied] = useState(false);
  const [showAuditDossier, setShowAuditDossier] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'budget' | 'beneficiaries' | 'volunteers' | 'evidence'>('budget');
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Array<{ id: string; name: string; text: string; time: string; verified?: boolean }>>([
    { 
      id: 'c1', 
      name: 'Rohan Mehta (Ground Volunteer)', 
      text: 'Kits were physically handed out at the Channapatna campus. Inverters and laptops tested with students!', 
      time: '1h ago', 
      verified: true 
    },
    {
      id: 'c2',
      name: 'Priya Sharma (Auditor)',
      text: 'Verified invoice series INV-2026-081 matching batch delivery logs. Fully compliant.',
      time: '35m ago',
      verified: true
    }
  ]);
  const [newCommentText, setNewCommentText] = useState('');

  const toggleReaction = (type: ReactionType) => {
    if (activeReaction === type) {
      setActiveReaction(null);
      if (type === 'heart') setLikesCount((p) => Math.max(0, p - 1));
      if (type === 'hands') setHandsCount((p) => Math.max(0, p - 1));
      if (type === 'clap') setClapsCount((p) => Math.max(0, p - 1));
    } else {
      // If switching from another reaction, decrement the old one
      if (activeReaction === 'heart') setLikesCount((p) => Math.max(0, p - 1));
      if (activeReaction === 'hands') setHandsCount((p) => Math.max(0, p - 1));
      if (activeReaction === 'clap') setClapsCount((p) => Math.max(0, p - 1));

      // Increment new one
      if (type === 'heart') setLikesCount((p) => p + 1);
      if (type === 'hands') setHandsCount((p) => p + 1);
      if (type === 'clap') setClapsCount((p) => p + 1);

      setActiveReaction(type);
      onLike?.(post.id);
    }
  };

  const handleEndorse = () => {
    if (isEndorsed) {
      setIsEndorsed(false);
      setEndorsementCount((p) => p - 1);
    } else {
      setIsEndorsed(true);
      setEndorsementCount((p) => p + 1);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAddComment = (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToAdd = presetText || newCommentText.trim();
    if (!textToAdd) return;

    setComments((prev) => [
      ...prev,
      {
        id: `c-${Date.now()}`,
        name: 'You (Citizen Supporter)',
        text: textToAdd,
        time: 'Just now',
        verified: true
      }
    ]);
    if (!presetText) setNewCommentText('');
  };

  const badgeConfig = {
    past_impact: {
      label: 'Verified Ground Impact',
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
    },
    upcoming_event: {
      label: 'Upcoming Community Drive',
      bg: 'bg-blue-50 text-blue-800 border-blue-200/80',
    },
    story: {
      label: 'Beneficiary Story',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/80',
    },
  }[post.activity_type] || {
    label: 'Community Update',
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
  };

  const budget = post.budget_report;
  const beneficiaries = post.beneficiary_records || [];
  const volunteers = post.volunteers_attended || [];

  return (
    <article className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden">
      
      {/* Post Author Header: NGO Identity */}
      <div className="p-4 sm:p-5 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <div 
            onClick={() => post.ngo && onSelectNGO?.(post.ngo.slug)}
            className="cursor-pointer relative w-12 h-12 rounded-2xl overflow-hidden border border-slate-200 shrink-0 hover:opacity-90 hover:scale-105 transition-all shadow-2xs"
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
                type="button"
                onClick={() => post.ngo && onSelectNGO?.(post.ngo.slug)}
                className="font-bold text-slate-900 hover:text-emerald-600 transition-colors text-base text-left cursor-pointer"
              >
                {post.ngo?.name || 'Community NGO'}
              </button>
              {post.ngo?.verified && (
                <span title="Verified Transparent NGO (Platform Reviewed)" className="text-emerald-600 inline-flex items-center">
                  <CheckCircle2 className="w-4 h-4 fill-emerald-100" />
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1 font-medium">
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

        {/* Right Badges: Transparency Score & Bookmark */}
        <div className="flex items-center gap-2">
          {post.ngo?.transparency_score && (
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-emerald-800">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              <span>{post.ngo.transparency_score}/100</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              isBookmarked 
                ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Saved to bookmarks' : 'Bookmark this update'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Post Badges & Traceability Tags */}
      <div className="px-4 sm:px-5 pb-3 flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full border ${badgeConfig.bg}`}>
          {badgeConfig.label}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
          <Camera className="w-3 h-3 text-slate-500" />
          <span>Photos Verified</span>
        </span>
        {post.gps_coordinates && (
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Navigation className="w-3 h-3 text-emerald-600" />
            <span>GPS: {post.gps_coordinates}</span>
          </span>
        )}
      </div>

      {/* Title & Body */}
      <div className="px-4 sm:px-5 pb-3.5">
        <h3 className="text-lg font-bold text-slate-900 mb-1.5 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
          {post.content}
        </p>
      </div>

      {/* Post Image with Dispatch Stamp */}
      {post.media_url && (
        <div className="relative w-full h-72 sm:h-96 bg-slate-100 overflow-hidden group">
          <Image
            src={post.media_url}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
          />
          <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-medium px-3.5 py-1.5 rounded-xl flex items-center gap-2 border border-white/20 shadow-md">
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Field Dispatch Verified • {post.location}</span>
          </div>
        </div>
      )}

      {/* Impact Metric & Quick Audit Banner */}
      <div className="bg-gradient-to-r from-emerald-50/70 via-teal-50/40 to-slate-50 px-4 sm:px-5 py-3 border-y border-emerald-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-700 shadow-2xs">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] text-slate-500 font-medium block">Audited Ground Impact</span>
            <span className="text-sm font-black text-emerald-950">
              {post.people_reached > 0 ? `${post.people_reached.toLocaleString('en-IN')} ${post.metrics_label}` : 'Verified Field Drive'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick trigger to open Impact Chain */}
          <button
            type="button"
            onClick={() => onViewImpactChain?.(post)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 text-xs font-bold transition-all shadow-2xs hover:shadow-xs cursor-pointer"
            title="Inspect where funds came from and what invoices generated this impact"
          >
            <Layers className="w-3.5 h-3.5 text-amber-600" />
            <span>Trace Chain</span>
          </button>

          {/* Toggle Forensic Audit Dossier (Mentor Feature) */}
          <button
            type="button"
            onClick={() => setShowAuditDossier(!showAuditDossier)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs hover:shadow cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
            <span>{showAuditDossier ? 'Hide Audit' : '₹75K Audit Dossier'}</span>
            {showAuditDossier ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* MENTOR'S EXPANDABLE FORENSIC AUDIT DOSSIER */}
      {showAuditDossier && (
        <div className="bg-slate-900 text-slate-100 p-5 border-y border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Forensic Audit & Utilization Dossier</h4>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
              <FileCheck className="w-3 h-3 text-emerald-400" />
              CA Certified Audit
            </span>
          </div>

          {/* Dossier Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            {budget && (
              <button
                type="button"
                onClick={() => setActiveAuditTab('budget')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeAuditTab === 'budget' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{budget.total_budget_allocated.toLocaleString('en-IN')} Budget Ledger
              </button>
            )}

            {beneficiaries.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveAuditTab('beneficiaries')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeAuditTab === 'beneficiaries' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Beneficiaries ({beneficiaries.length})
              </button>
            )}

            {volunteers.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveAuditTab('volunteers')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  activeAuditTab === 'volunteers' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Volunteers ({volunteers.length})
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveAuditTab('evidence')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeAuditTab === 'evidence' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Evidence & GPS
            </button>
          </div>

          {/* TAB 1: BUDGET AUDIT BREAKDOWN (₹75,000 Mentor Requirement) */}
          {activeAuditTab === 'budget' && budget && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-slate-800/90 p-3 rounded-2xl border border-slate-700/80 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Allocated Budget</span>
                  <strong className="text-white text-sm">₹{budget.total_budget_allocated.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Verified Expended</span>
                  <strong className="text-emerald-400 text-sm">₹{budget.total_spent.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Auditor Seal</span>
                  <strong className="text-amber-300 text-xs block truncate">{budget.auditor_seal || 'CA Verified'}</strong>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/80 text-slate-400 uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Expense Item</th>
                      <th className="py-2 px-3">Category</th>
                      <th className="py-2 px-3">Vendor / Invoice</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {budget.expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 font-medium text-white">{exp.item_description}</td>
                        <td className="py-2 px-3">
                          <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-2 px-3 font-mono text-[11px] text-slate-400">{exp.vendor_name} ({exp.invoice_number})</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-400 font-mono">₹{exp.amount.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: BENEFICIARY ROSTER */}
          {activeAuditTab === 'beneficiaries' && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block">
                Audited headcount of students & direct beneficiaries reached:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {beneficiaries.map((b) => (
                  <div key={b.id} className="bg-slate-800/90 p-2.5 rounded-xl border border-slate-700/80 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white block">{b.beneficiary_name}</span>
                      <span className="text-slate-400 text-[11px] block">{b.age_or_grade} • {b.benefit_received}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">
                      {b.verification_status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: VOLUNTEER ATTENDANCE */}
          {activeAuditTab === 'volunteers' && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-sans">
                Verified volunteers signed in on-ground for this drive:
              </span>
              <div className="flex flex-wrap gap-2">
                {volunteers.map((vol) => (
                  <span key={vol} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {vol}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EVIDENCE LINKS */}
          {activeAuditTab === 'evidence' && (
            <div className="space-y-2 text-xs">
              {post.gps_coordinates && (
                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">GPS Geo-Coordinates</span>
                    <strong className="text-white font-mono">{post.gps_coordinates}</strong>
                  </div>
                  <a
                    href={`https://maps.google.com/?q=${post.gps_coordinates}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <span>View on Map</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
              {post.video_url && (
                <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Video Documentation</span>
                    <strong className="text-white">Ground Video Proof</strong>
                  </div>
                  <a
                    href={post.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Watch Recording</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Citizen Endorsement Strip */}
      <div className="px-4 sm:px-5 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span><strong>{endorsementCount}</strong> Verified Citizens Endorsed</span>
        </div>
        <button
          type="button"
          onClick={handleEndorse}
          className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
            isEndorsed 
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
              : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-100'
          }`}
        >
          {isEndorsed ? <Check className="w-3 h-3 text-emerald-700" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
          <span>{isEndorsed ? 'Endorsed' : '+ Endorse'}</span>
        </button>
      </div>

      {/* Social Action Footer */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between bg-white border-t border-slate-100">
        
        {/* Social Reactions Cluster */}
        <div className="flex items-center gap-1 sm:gap-2">
          
          {/* Heart button */}
          <button
            type="button"
            onClick={() => toggleReaction('heart')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReaction === 'heart'
                ? 'bg-rose-50 text-rose-600 border border-rose-200 animate-heart-pulse shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Love this impact"
          >
            <Heart className={`w-4 h-4 ${activeReaction === 'heart' ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{likesCount}</span>
          </button>

          {/* Hands Gratitude button */}
          <button
            type="button"
            onClick={() => toggleReaction('hands')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReaction === 'hands' 
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-2xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Grateful"
          >
            <span>🙌</span>
            <span>{handsCount}</span>
          </button>

          {/* Clap Kudos button */}
          <button
            type="button"
            onClick={() => toggleReaction('clap')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeReaction === 'clap' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs' 
                : 'text-slate-600 hover:bg-slate-100'
            }`}
            title="Kudos"
          >
            <span>👏</span>
            <span>{clapsCount}</span>
          </button>

          {/* Comment Bubble Toggle */}
          <button
            type="button"
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ml-1 ${
              showComments ? 'bg-slate-100 text-slate-900 font-bold' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
            <span>{comments.length}</span>
          </button>

          {/* Share Button with Live Copy Toast */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">{copied ? 'Copied! 🎉' : 'Share'}</span>
          </button>
        </div>

        {/* Primary Support Action */}
        <div className="flex items-center gap-2">
          {post.ngo_id && (
            <button
              type="button"
              onClick={() => onDonate?.(post.ngo_id)}
              className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-1.5 rounded-xl transition-all border border-emerald-200/80 cursor-pointer shadow-2xs hover:shadow-xs"
            >
              <span>Support Cause</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>

      {/* Interactive Comments Drawer */}
      {showComments && (
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 space-y-3 animate-in fade-in-50 duration-200">
          
          {/* Quick preset chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-slate-400 text-[11px] shrink-0 font-medium">Quick reply:</span>
            {['✅ Verified ground drive', '🙌 Great work team!', '❤️ Proud supporter!'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAddComment(undefined, preset)}
                className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg border border-slate-200 text-[11px] font-semibold transition-colors cursor-pointer shrink-0"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Comment list */}
          <div className="space-y-2">
            {comments.map((c) => (
              <div key={c.id} className="bg-white p-3 rounded-2xl border border-slate-200/80 text-xs space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-slate-800">{c.name}</strong>
                    {c.verified && (
                      <span title="Verified Citizen" className="inline-flex items-center text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 fill-emerald-100" />
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">{c.time}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{c.text}</p>
              </div>
            ))}
          </div>

          {/* Write comment input */}
          <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
            <input
              type="text"
              value={newCommentText}
              onChange={(e) => setNewCommentText(e.target.value)}
              placeholder="Write an audited comment or question..."
              className="flex-1 px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Send className="w-3 h-3" />
              <span>Post</span>
            </button>
          </form>
        </div>
      )}

    </article>
  );
}
