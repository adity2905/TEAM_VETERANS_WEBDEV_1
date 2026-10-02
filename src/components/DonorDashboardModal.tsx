'use client';

import React, { useState } from 'react';
import { 
  X, ShieldCheck, Heart, Award, IndianRupee, FileCheck2, ArrowRight, Share2, CheckCircle2 
} from 'lucide-react';
import { Donation } from '@/types';

interface DonorDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  donations: Donation[];
  onOpenImpactChain?: () => void;
}

export default function DonorDashboardModal({
  isOpen,
  onClose,
  donations,
  onOpenImpactChain,
}: DonorDashboardModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 500);

  const myDemoContributions = [
    {
      campaign: 'Dharavi Monsoon Flood Meal Relief',
      ngoName: 'Annapurna Seva Mission',
      myAmount: 500,
      status: 'Fully Utilized on Ground',
      impactOutcome: '20 freshly cooked hot meals delivered with hydration kits',
      evidenceStatus: 'GPS & Vendor Bills Inspected',
      receiptId: '80G-DEMO-9901',
      date: '28 Sept 2026',
    },
    {
      campaign: 'Solar STEM Coding Kits for Rural Girls',
      ngoName: 'Vidya Vikas Foundation',
      myAmount: 250,
      status: 'Procured & Active in Classroom',
      impactOutcome: '1 adolescent learner equipped with offline Python tablet module',
      evidenceStatus: 'Inauguration Photos Verified',
      receiptId: '80G-DEMO-9902',
      date: '30 Sept 2026',
    }
  ];

  const badges = [
    { icon: '🛡️', title: 'Truth Seeker', desc: 'Inspected GPS geotagged ground proof' },
    { icon: '🍲', title: 'Zero Hunger Champion', desc: 'Sponsored direct community meals' },
    { icon: '💻', title: 'STEM Enabler', desc: 'Funded solar robotics & coding kits' },
    { icon: '🤝', title: 'Ground Volunteer', desc: 'Verified volunteer pass holder' },
  ];

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-100 transition-all max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-2xl shadow-inner">
              🌱
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg text-white">My Donor Impact Dashboard</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-emerald-300">
                Audited Track Record • TEKTONIX 2026 Contributor
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="block text-[10px] text-slate-300 uppercase font-bold">Contributions</span>
              <span className="text-xl font-black text-white">{myDemoContributions.length}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-300 uppercase font-bold">Total Donated</span>
              <span className="text-xl font-black text-emerald-400">₹{totalDonated.toLocaleString('en-IN')}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-300 uppercase font-bold">Direct Lives Impacted</span>
              <span className="text-xl font-black text-amber-300">21+</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Section: My Contributions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>My Contributions & Utilization</span>
              <span className="text-[10px] text-emerald-700 font-semibold">100% Accounted</span>
            </h4>

            <div className="space-y-3">
              {myDemoContributions.map((item, idx) => (
                <div key={idx} className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{item.ngoName}</span>
                      <h5 className="font-bold text-sm text-slate-900">{item.campaign}</h5>
                    </div>
                    <span className="font-black text-sm text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                      ₹{item.myAmount}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item.impactOutcome}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Receipt: <strong className="font-mono text-slate-700">{item.receiptId}</strong></span>
                      <span>Evidence: <strong className="text-emerald-700 font-medium">{item.evidenceStatus}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Badges */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Earned Badges & Trust Milestones
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {badges.map((b, i) => (
                <div key={i} className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl text-xs space-y-0.5">
                  <div className="text-xl">{b.icon}</div>
                  <div className="font-bold text-slate-900">{b.title}</div>
                  <div className="text-[10px] text-slate-500 leading-tight">{b.desc}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2 shrink-0">
          {onOpenImpactChain && (
            <button
              onClick={() => {
                onClose();
                onOpenImpactChain();
              }}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <span>View Full Impact Chain</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={handleShare}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
