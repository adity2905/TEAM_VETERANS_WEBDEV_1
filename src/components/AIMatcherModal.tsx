'use client';

import React, { useState } from 'react';
import { NGO, VolunteerNeed, Fundraiser } from '@/types';
import { Sparkles, X, ArrowRight, Bot, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface AIMatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngos: NGO[];
  volunteerNeeds: VolunteerNeed[];
  fundraisers: Fundraiser[];
  onSelectAction?: (type: 'donate' | 'volunteer' | 'ngo', id: string) => void;
}

interface MatchResult {
  ngo: NGO;
  matchScore: number;
  matchReason: string;
  recommendedAction: 'volunteer' | 'donate';
  actionTargetTitle: string;
  targetId: string;
}

export default function AIMatcherModal({
  isOpen,
  onClose,
  ngos,
  volunteerNeeds,
  fundraisers,
  onSelectAction,
}: AIMatcherModalProps) {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);

  if (!isOpen) return null;

  const handleSmartMatch = (userQuery: string) => {
    setQuery(userQuery);
    setIsAnalyzing(true);
    setMatchResult(null);

    // AI Semantic Simulation / Matching logic
    setTimeout(() => {
      const q = userQuery.toLowerCase();

      let matchedNGO = ngos[0];
      let matchScore = 95;
      let reason = 'Matched your interest in food security, slum nutrition, and direct impact.';
      let action: 'volunteer' | 'donate' = 'donate';
      let actionTitle = 'Sponsor Midday Nutrition Packs';
      let targetId = fundraisers[0]?.id || '';

      if (q.includes('code') || q.includes('teach') || q.includes('python') || q.includes('girl') || q.includes('school') || q.includes('bangalore') || q.includes('bengaluru')) {
        matchedNGO = ngos.find((n) => n.category === 'Education') || ngos[1];
        matchScore = 98;
        reason = 'Identified high skill synergy with rural STEM education and adolescent digital literacy in Karnataka.';
        action = 'volunteer';
        actionTitle = 'Weekend Python & Web Dev Mentors for Class 8-10 Girls';
        targetId = volunteerNeeds.find((v) => v.ngo_id === matchedNGO?.id)?.id || volunteerNeeds[1]?.id;
      } else if (q.includes('tree') || q.includes('plant') || q.includes('nature') || q.includes('environment') || q.includes('delhi') || q.includes('forest')) {
        matchedNGO = ngos.find((n) => n.category === 'Environment') || ngos[2];
        matchScore = 96;
        reason = 'Matched environmental restoration and active community Miyawaki plantation in Delhi-NCR.';
        action = 'volunteer';
        actionTitle = 'Urban Forest Planters & Soil Preparation Drive';
        targetId = volunteerNeeds.find((v) => v.ngo_id === matchedNGO?.id)?.id || volunteerNeeds[2]?.id;
      } else if (q.includes('animal') || q.includes('dog') || q.includes('cat') || q.includes('rescue') || q.includes('pune')) {
        matchedNGO = ngos.find((n) => n.category === 'Animal Welfare') || ngos[3] || ngos[0];
        matchScore = 97;
        reason = 'Matched urgent veterinary trauma care, ambulance outfitting, and street animal rehabilitation in Pune.';
        action = 'donate';
        actionTitle = 'Emergency Mobile Ambulance Oxygen Unit';
        targetId = fundraisers.find((f) => f.ngo_id === matchedNGO?.id)?.id || fundraisers[2]?.id;
      } else {
        // Default to Hunger Relief
        matchedNGO = ngos[0];
        matchScore = 94;
        reason = 'High-priority direct humanitarian impact: Providing immediate hot meals to vulnerable migrant communities.';
        action = 'donate';
        actionTitle = 'Sponsor 10,000 Midday Nutrition Packs';
        targetId = fundraisers[0]?.id || '';
      }

      setMatchResult({
        ngo: matchedNGO,
        matchScore,
        matchReason: reason,
        recommendedAction: action,
        actionTargetTitle: actionTitle,
        targetId,
      });

      setIsAnalyzing(false);
    }, 900);
  };

  const samplePrompts = [
    'I want to teach coding or math to rural schoolgirls',
    'Help feed hungry children and slum communities',
    'Volunteer for weekend tree planting in Delhi',
    'Support emergency medical care for street dogs',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-purple-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <Bot className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">AI Cause & Impact Matcher</h2>
                <span className="text-[10px] font-semibold bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-400/20">
                  Gemini LLM
                </span>
              </div>
              <p className="text-xs text-purple-200/80">
                Tell us your passion, skills, or location to find the perfect transparent cause
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-purple-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Natural Language Query Box */}
          <div>
            <div className="relative">
              <textarea
                rows={2}
                placeholder="Type your intent... (e.g., 'I want to teach coding on weekends in Bengaluru')"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
              <button
                type="button"
                disabled={!query.trim() || isAnalyzing}
                onClick={() => handleSmartMatch(query)}
                className="absolute right-2.5 bottom-3 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 disabled:opacity-40 transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Match</span>
              </button>
            </div>

            {/* Quick Prompt Pills */}
            <div className="mt-3">
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                Suggested Prompts:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {samplePrompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handleSmartMatch(p)}
                    className="text-[11px] bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200/70 px-2.5 py-1 rounded-lg transition-colors text-left"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          {isAnalyzing && (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
              <p className="text-xs font-semibold text-purple-900 animate-pulse">
                Analyzing cause categories, transparency records, and volunteer rosters...
              </p>
            </div>
          )}

          {/* Match Result Display */}
          {matchResult && !isAnalyzing && (
            <div className="bg-gradient-to-br from-purple-50/70 via-indigo-50/50 to-white border border-purple-200 rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
              
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-purple-700 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Top Verified Recommendation
                </span>
                <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {matchResult.matchScore}% Match Score
                </span>
              </div>

              {/* Matched NGO Card */}
              <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative shrink-0 border border-slate-200">
                  <img
                    src={matchResult.ngo.logo_url}
                    alt={matchResult.ngo.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-slate-900 text-sm">{matchResult.ngo.name}</h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                    {matchResult.ngo.tagline}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                    Transparency: {matchResult.ngo.transparency_score}/100
                  </span>
                </div>
              </div>

              {/* Rationale */}
              <div className="bg-white/80 rounded-xl p-3 border border-purple-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-purple-900 block">AI Impact Rationale:</span>
                <p className="leading-relaxed text-slate-600">{matchResult.matchReason}</p>
              </div>

              {/* Recommended Action CTA */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onSelectAction?.(matchResult.recommendedAction, matchResult.targetId);
                    onClose();
                  }}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>
                    {matchResult.recommendedAction === 'volunteer'
                      ? `Sign Up: ${matchResult.actionTargetTitle}`
                      : `Support: ${matchResult.actionTargetTitle}`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
