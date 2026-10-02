'use client';

import React, { useState } from 'react';
import { 
  X, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck2, 
  MapPin, 
  Calendar, 
  IndianRupee, 
  Clock, 
  Eye, 
  ExternalLink,
  Layers
} from 'lucide-react';
import { NGO, Post, Fundraiser } from '@/types';

interface ImpactChainModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngo?: NGO | null;
  post?: Post | null;
  fundraiser?: Fundraiser | null;
  onDonate?: (fundraiserId: string) => void;
}

export default function ImpactChainModal({
  isOpen,
  onClose,
  ngo,
  post,
  fundraiser,
  onDonate,
}: ImpactChainModalProps) {
  const [selectedStep, setSelectedStep] = useState<number>(0);

  if (!isOpen) return null;

  const currentNGO = ngo || post?.ngo || fundraiser?.ngo || {
    name: 'Annapurna Seva Mission',
    location: 'Mumbai, Maharashtra',
    reg_number: '80G-MUM-2018-9104',
    transparency_score: 98,
  };

  const steps = [
    {
      title: '1. Verified Non-Profit',
      subtitle: 'Organization Onboarding',
      icon: '🏛️',
      summary: `${currentNGO.name} is platform-verified with Section 80G tax exemption credentials.`,
      details: [
        `Legal Reg: ${currentNGO.reg_number}`,
        `Location: ${currentNGO.location}`,
        `Audit Score: ${currentNGO.transparency_score}% Trust Rating`,
        `Verification: Demo Verified by Independent Auditor`
      ],
      tag: 'NGO Vetted'
    },
    {
      title: '2. Dedicated Campaign',
      subtitle: 'Micro-Fundraiser Launched',
      icon: '🎯',
      summary: fundraiser ? fundraiser.title : 'Sponsor 10,000 Midday Nutrition Packs for Street Children',
      details: [
        `Target Goal: ₹2,50,000`,
        `Raised on Platform: ₹1,84,200 (73% Funded)`,
        `Unit Metric: ₹25 funds 1 complete hot nutritious meal`,
        `Deadline: Active through October 2026`
      ],
      tag: 'Itemized Need'
    },
    {
      title: '3. Audited Utilization',
      subtitle: 'Funds Disbursed to Vendors',
      icon: '🧾',
      summary: '₹1,45,000 utilized for direct bulk raw ingredients with supplier GST invoices verified.',
      details: [
        '50kg Wheat Flour (Atta) Sacks: ₹45,000 (Voucher #ANN-INV-991)',
        'Cold-pressed Mustard Oil & Spices: ₹22,000 (Voucher #ANN-INV-992)',
        'LPG Commercial Refill Cylinders: ₹14,000 (Voucher #ANN-INV-993)',
        'Biodegradable Meal Boxes: ₹18,000 (Voucher #ANN-INV-994)'
      ],
      tag: 'Zero Admin Markup'
    },
    {
      title: '4. Ground Activity Execution',
      subtitle: 'Volunteers Deployed',
      icon: '🚚',
      summary: post ? post.title : 'Monsoon Flood Relief: 3,200 Hot Meals Distributed in Dharavi',
      details: [
        'Date: 28 September 2026 • 5:00 AM Distribution Van Run',
        'Volunteers: 28 Youth Community Volunteers Deployed',
        'Location: Dharavi & Sion Transit Shelters, Mumbai',
        'Beneficiaries: Daily-wage migrant families & children'
      ],
      tag: 'Field Operations'
    },
    {
      title: '5. Photographic Evidence',
      subtitle: 'GPS & Timestamp Recorded',
      icon: '📸',
      summary: 'Field evidence submitted, inspected, and cross-referenced with geotags.',
      details: [
        'GPS Coordinates: 19.0433° N, 72.8572° E (Dharavi Station)',
        'Timestamp: 2026-09-28 07:14:22 IST',
        'Photographic Vouchers: 3 High-resolution ground images attached',
        'Status: Evidence Reviewed & Verified (Demo)'
      ],
      tag: 'Audited Proof'
    },
    {
      title: '6. Quantified Impact Report',
      subtitle: 'Final Outcome Documented',
      icon: '✨',
      summary: '3,200 nutritious hot meals served directly to individuals who otherwise would sleep hungry.',
      details: [
        '3,200 Hot Meals Provided with certified hygiene checks',
        '100% Direct Pass-Through without third-party commission',
        '80G Tax Certificates issued to all 248 participating donors',
        'Status: Published on Public Impact Ledger'
      ],
      tag: 'Outcome Achieved'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 transition-all max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm leading-snug">The Audited Impact Chain</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                  Core USP
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Trace every donation: Need ➔ Utilization ➔ Activity ➔ Evidence ➔ Impact
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Horizontal Chain Stepper */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 overflow-x-auto scrollbar-none flex items-center gap-2 shrink-0">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <button
                onClick={() => setSelectedStep(idx)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedStep === idx
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{step.icon}</span>
                <span>{step.subtitle}</span>
              </button>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Selected Step Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                {steps[selectedStep].tag}
              </span>
              <h2 className="text-lg font-black text-slate-900 mt-1.5">
                {steps[selectedStep].title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {steps[selectedStep].summary}
              </p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-2xl flex items-center justify-center shrink-0 border border-emerald-100">
              {steps[selectedStep].icon}
            </div>
          </div>

          {/* Detailed Verification Card */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-4 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verifiable Ledger Records:</span>
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700">
              {steps[selectedStep].details.map((item, i) => (
                <div key={i} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-slate-100 shadow-2xs font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5 font-sans" />
                  <span className="font-sans text-slate-800">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Step Progress Timeline Bar */}
          <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 text-xs text-emerald-950 space-y-2">
            <div className="flex justify-between items-center font-bold text-[11px]">
              <span>Impact Chain Progress: Step {selectedStep + 1} of 6</span>
              <span className="text-emerald-700 font-mono">{Math.round(((selectedStep + 1) / 6) * 100)}% Verified</span>
            </div>
            <div className="w-full bg-emerald-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${((selectedStep + 1) / 6) * 100}%` }}
              />
            </div>
            <p className="text-[11px] text-emerald-800">
              {selectedStep < 5
                ? 'Click "Next Step" to trace forward from purchase to ground photos and reported impact.'
                : 'All 6 stages verified: The donation directly produced 3,200 documented hot meals.'}
            </p>
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={() => setSelectedStep(Math.max(0, selectedStep - 1))}
            disabled={selectedStep === 0}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition"
          >
            Previous Stage
          </button>

          <div className="flex items-center gap-2">
            {selectedStep < steps.length - 1 ? (
              <button
                onClick={() => setSelectedStep(selectedStep + 1)}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              fundraiser && onDonate ? (
                <button
                  onClick={() => {
                    onClose();
                    onDonate(fundraiser.id);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm transition"
                >
                  <IndianRupee className="w-3.5 h-3.5" />
                  <span>Support Next Campaign</span>
                </button>
              ) : (
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
                >
                  Done
                </button>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
