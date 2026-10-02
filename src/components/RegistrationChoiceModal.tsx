'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Compass, 
  ArrowRight, 
  X, 
  CheckCircle2, 
  Camera, 
  Video, 
  FileText, 
  Sparkles,
  Users,
  Layers
} from 'lucide-react';

interface RegistrationChoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRegisterNGO: () => void;
  onSelectRegisterUser: () => void;
  onSelectExploreOnly: () => void;
}

export default function RegistrationChoiceModal({
  isOpen,
  onClose,
  onSelectRegisterNGO,
  onSelectRegisterUser,
  onSelectExploreOnly,
}: RegistrationChoiceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto relative animate-in zoom-in-95 duration-200">
        
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
          title="Close / Explore as Guest"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white p-6 sm:p-8 relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Welcome to Transparency • 100% Audited Giving</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              How would you like to get started?
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              Choose your path to tailor your experience. Register as an NGO to post verified drives, register as a citizen for 80G tax exemptions, or simply explore the live community dispatches.
            </p>
          </div>
        </div>

        {/* 3 Interactive Role Choices */}
        <div className="p-6 sm:p-8 bg-slate-50/60 grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* OPTION 1: REGISTER AS NGO */}
          <div className="bg-white rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  For Non-Profits
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                  1. Register Your NGO
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Join India’s audited civic registry. Upload 80G/12A certificates, past drive proofs, and balance sheets.
                </p>
              </div>

              {/* Benefits Checklist */}
              <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Post verified ground drives & video documentation</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Submit ₹75K itemized budget ledgers & invoices</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Issue instant Sec 80G tax exemption receipts</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="pt-5 space-y-2">
              <button
                type="button"
                onClick={onSelectRegisterNGO}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 group-hover:shadow"
              >
                <span>Quick NGO Registration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href="/register/ngo"
                onClick={onClose}
                className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] rounded-xl transition-colors text-center block border border-emerald-200/60"
              >
                Open Full 7-Step NGO Web Portal →
              </Link>
            </div>
          </div>

          {/* OPTION 2: REGISTER AS CITIZEN / DONOR / VOLUNTEER */}
          <div className="bg-white rounded-2xl border-2 border-cyan-500/30 hover:border-cyan-500 p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">
                  Citizen / Donor
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-cyan-700 transition-colors">
                  2. Citizen Registration & KYC
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Complete Aadhaar / Govt ID KYC to donate, endorse projects, and volunteer on-ground.
                </p>
              </div>

              {/* Benefits Checklist */}
              <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>100% Traceable Rupee Passport from receipt to field</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Sign up for verified on-ground volunteer drives</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Verified Citizen endorsement & audit reviews</span>
                </li>
              </ul>
            </div>

            {/* Action */}
            <div className="pt-5">
              <button
                type="button"
                onClick={onSelectRegisterUser}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 group-hover:shadow"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-200" />
                <span>Complete Citizen KYC →</span>
              </button>
            </div>
          </div>

          {/* OPTION 3: JUST EXPLORE AS GUEST */}
          <div className="bg-white rounded-2xl border-2 border-slate-200 hover:border-amber-400 p-5 flex flex-col justify-between shadow-xs hover:shadow-lg transition-all group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">
                  No Sign-Up
                </span>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                  3. Just Explore the Page
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Browse as a guest. View live photos, video documentation, ₹75,000 budget ledgers, and verified posts.
                </p>
              </div>

              {/* Benefits Checklist */}
              <ul className="text-[11px] text-slate-600 space-y-1.5 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>Inspect high-res photographic proof of drives</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Video className="w-3.5 h-3.5 text-cyan-600 shrink-0 mt-0.5" />
                  <span>Watch live field dispatch video recordings</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                  <span>Trace ₹75K invoice ledgers & the National Impact Map</span>
                </li>
              </ul>
            </div>

            {/* Action */}
            <div className="pt-5">
              <button
                type="button"
                onClick={onSelectExploreOnly}
                className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 group-hover:shadow"
              >
                <span>Explore Feed as Guest →</span>
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Note */}
        <div className="px-6 sm:px-8 py-3.5 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>You can switch roles or register anytime from the top navigation bar.</span>
          <button
            type="button"
            onClick={onSelectExploreOnly}
            className="text-slate-700 hover:text-emerald-700 font-bold hover:underline cursor-pointer text-xs"
          >
            Skip for now & browse feed
          </button>
        </div>

      </div>
    </div>
  );
}
