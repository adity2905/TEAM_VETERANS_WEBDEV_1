'use client';

import React from 'react';
import Image from 'next/image';
import { NGO, Fundraiser, VolunteerNeed, Post } from '@/types';
import { X, ShieldCheck, Award, MapPin, Globe, Calendar, ArrowRight, Heart, Users } from 'lucide-react';

interface NGOProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo: NGO | null;
  fundraisers: Fundraiser[];
  volunteerNeeds: VolunteerNeed[];
  posts: Post[];
  onDonate?: (fundraiser: Fundraiser) => void;
  onVolunteer?: (need: VolunteerNeed) => void;
}

export default function NGOProfileModal({
  isOpen,
  onClose,
  ngo,
  fundraisers,
  volunteerNeeds,
  posts,
  onDonate,
  onVolunteer,
}: NGOProfileModalProps) {
  if (!isOpen || !ngo) return null;

  const ngoFundraisers = fundraisers.filter((f) => f.ngo_id === ngo.id);
  const ngoVolunteerNeeds = volunteerNeeds.filter((v) => v.ngo_id === ngo.id);
  const ngoPosts = posts.filter((p) => p.ngo_id === ngo.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Banner & Close */}
        <div className="relative h-44 sm:h-52 w-full bg-slate-900">
          <Image
            src={ngo.banner_url}
            alt={ngo.name}
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white/80 hover:text-white p-1.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Logo & Headline */}
          <div className="absolute -bottom-6 left-6 flex items-end gap-3.5 z-10">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-3 border-white shadow-lg bg-white shrink-0">
              <Image
                src={ngo.logo_url}
                alt={ngo.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="pt-8 p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Header info */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold text-slate-900">{ngo.name}</h2>
                {ngo.verified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Govt 80G Certified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {ngo.tagline}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {ngo.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Est. {ngo.founded_year}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-600">Reg: {ngo.reg_number}</span>
              </div>
            </div>

            {/* Transparency Score Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex sm:flex-col items-center justify-between sm:justify-center text-center shrink-0">
              <div className="flex items-center gap-1 text-amber-500 mb-0.5">
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold text-slate-700">Transparency</span>
              </div>
              <span className="text-lg font-black text-emerald-600">{ngo.transparency_score}/100</span>
            </div>
          </div>

          {/* Mission & Financial Accountability */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Mission & Purpose
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {ngo.description}
            </p>

            {/* Financial Transparency breakdown */}
            <div className="mt-4 bg-emerald-50/60 border border-emerald-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-900">Audited Fund Allocation</span>
                <span className="text-[11px] font-semibold text-emerald-700">FY 2025-26</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
                <div style={{ width: '88%' }} className="bg-emerald-600" title="88% Direct Aid" />
                <div style={{ width: '7%' }} className="bg-blue-500" title="7% Admin" />
                <div style={{ width: '5%' }} className="bg-amber-400" title="5% Fundraising" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-2 font-medium">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" /> 88% Direct Beneficiary Aid
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" /> 7% Admin
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> 5% Fundraising
                </span>
              </div>
            </div>
          </div>

          {/* Active Fundraisers */}
          {ngoFundraisers.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                Active Urgent Fundraisers ({ngoFundraisers.length})
              </h3>
              <div className="space-y-3">
                {ngoFundraisers.map((f) => {
                  const percent = Math.min(100, Math.round((Number(f.raised_amount) / Number(f.target_amount)) * 100));
                  return (
                    <div key={f.id} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900">{f.title}</h4>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden my-2">
                          <div style={{ width: `${percent}%` }} className="bg-emerald-600 h-full rounded-full" />
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                          <span><strong>₹{Number(f.raised_amount).toLocaleString('en-IN')}</strong> of ₹{Number(f.target_amount).toLocaleString('en-IN')}</span>
                          <span className="font-bold text-emerald-700">{percent}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          onDonate?.(f);
                          onClose();
                        }}
                        className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Donate Now
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Open Volunteer Calls */}
          {ngoVolunteerNeeds.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-600" />
                Open Volunteer Drives ({ngoVolunteerNeeds.length})
              </h3>
              <div className="space-y-3">
                {ngoVolunteerNeeds.map((v) => (
                  <div key={v.id} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{v.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{v.event_date} • {v.location}</p>
                      <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700">
                        {v.total_slots - v.filled_slots} spots left
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onVolunteer?.(v);
                        onClose();
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                    >
                      Sign Up
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
