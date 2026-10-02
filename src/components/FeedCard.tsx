'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types';
import { 
  Heart, Share2, MapPin, Calendar, CheckCircle2, Award, 
  ArrowUpRight, TrendingUp, ChevronDown, ChevronUp, FileText, 
  Users, Video, ShieldCheck, DollarSign, ExternalLink, Navigation 
} from 'lucide-react';

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
  const [showAuditDossier, setShowAuditDossier] = useState(false);
  const [activeAuditTab, setActiveAuditTab] = useState<'budget' | 'beneficiaries' | 'volunteers' | 'evidence'>('budget');

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

  const budget = post.budget_report;
  const beneficiaries = post.beneficiary_records || [];
  const volunteers = post.volunteers_attended || [];

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

      {/* Post Activity Badge & GPS Tag */}
      <div className="px-4 sm:px-5 pb-2 flex items-center justify-between gap-2 flex-wrap">
        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badgeConfig.bg}`}>
          {badgeConfig.label}
        </span>

        {post.gps_coordinates && (
          <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
            <Navigation className="w-3 h-3 text-emerald-600" />
            {post.gps_coordinates}
          </span>
        )}
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

          <button
            onClick={() => setShowAuditDossier(!showAuditDossier)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-white px-3 py-1.5 rounded-lg border border-emerald-300 shadow-2xs hover:bg-emerald-50 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{showAuditDossier ? 'Hide Audit Dossier' : 'Inspect Audit Dossier'}</span>
            {showAuditDossier ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}

      {/* MENTOR'S REQUIREMENT: EXPANDABLE AUDIT & BUDGET DOSSIER */}
      {showAuditDossier && (
        <div className="bg-slate-900 text-slate-100 p-5 border-y border-slate-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">Forensic Audit & Utilization Dossier</h4>
            </div>
            <span className="text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              CA Certified
            </span>
          </div>

          {/* Dossier Tabs */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
            {budget && (
              <button
                onClick={() => setActiveAuditTab('budget')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeAuditTab === 'budget' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                ₹{budget.total_budget_allocated.toLocaleString('en-IN')} Budget Ledger
              </button>
            )}

            {beneficiaries.length > 0 && (
              <button
                onClick={() => setActiveAuditTab('beneficiaries')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeAuditTab === 'beneficiaries' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Beneficiaries ({beneficiaries.length})
              </button>
            )}

            {volunteers.length > 0 && (
              <button
                onClick={() => setActiveAuditTab('volunteers')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeAuditTab === 'volunteers' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                Volunteers ({volunteers.length})
              </button>
            )}
          </div>

          {/* TAB 1: BUDGET AUDIT BREAKDOWN (Mentor's Exact "75,000" Request) */}
          {activeAuditTab === 'budget' && budget && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Allocated Budget</span>
                  <strong className="text-white text-sm">₹{budget.total_budget_allocated.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Verified Expended</span>
                  <strong className="text-emerald-400 text-sm">₹{budget.total_spent.toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Unspent Reserve</span>
                  <strong className="text-cyan-400 text-sm">₹{budget.unspent_balance.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              {/* Expense Line Items Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase">
                    <tr>
                      <th className="py-2 px-3">Expense Category</th>
                      <th className="py-2 px-3">Item / Description</th>
                      <th className="py-2 px-3">Vendor & Invoice</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {budget.expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-800/40">
                        <td className="py-2 px-3 text-emerald-400 font-sans font-semibold">{exp.category}</td>
                        <td className="py-2 px-3 font-sans text-slate-300">{exp.description}</td>
                        <td className="py-2 px-3 text-slate-400 text-[11px]">
                          {exp.vendor_name} ({exp.invoice_no})
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-white">
                          ₹{exp.amount_spent.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-sans font-bold">
                            Voucher Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {budget.financial_auditor_note && (
                <p className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800 italic">
                  <strong>Auditor Seal:</strong> {budget.financial_auditor_note}
                </p>
              )}
            </div>
          )}

          {/* TAB 2: AUDITED BENEFICIARY LOG (Students / Patients Engaged) */}
          {activeAuditTab === 'beneficiaries' && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-sans">
                Complete roster of community members directly impacted during this drive:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {beneficiaries.map((b) => (
                  <div key={b.id} className="bg-slate-800/80 p-2.5 rounded-lg border border-slate-700/70 text-xs flex items-center justify-between">
                    <div>
                      <strong className="text-white font-sans">{b.name}</strong>
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

          {/* TAB 3: VOLUNTEER ATTENDANCE ROSTER */}
          {activeAuditTab === 'volunteers' && (
            <div className="space-y-2">
              <span className="text-xs text-slate-400 block font-sans">
                Verified volunteers signed in on-ground for this initiative:
              </span>
              <div className="flex flex-wrap gap-2">
                {volunteers.map((vol) => (
                  <span key={vol} className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-xs text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    {vol}
                  </span>
                ))}
              </div>
            </div>
          )}

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
            className="flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100/80 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span>Support Cause</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

    </article>
  );
}
