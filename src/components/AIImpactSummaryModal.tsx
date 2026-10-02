'use client';

import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Users, 
  Package, 
  TrendingUp, 
  FileText, 
  Loader2,
  ArrowRight
} from 'lucide-react';
import { AIImpactAnalysis } from '@/types';

interface AIImpactSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ACTIVITIES = [
  '15 volunteers visited a government primary school in Junnar, Pune and distributed textbooks, geometric boxes and school bags to 120 rural students.',
  '28 volunteers mobilized in Dharavi, Mumbai following heavy rains and prepared and distributed 3,200 fresh hot khichdi and boiled egg meal packets.',
  '8 volunteer teachers inaugurated a solar-powered coding hub in Channapatna and trained 65 high school girls in basic Python and game development.',
];

export default function AIImpactSummaryModal({
  isOpen,
  onClose,
}: AIImpactSummaryModalProps) {
  const [inputText, setInputText] = useState(PRESET_ACTIVITIES[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIImpactAnalysis | null>(null);

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/impact-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.status === 'success') {
        setAnalysisResult(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-purple-100">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 p-5 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
              <Sparkles className="w-5 h-5 text-purple-200 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg leading-tight">AI Impact Summary Engine</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/20 uppercase tracking-wide">
                  NLP Auditor
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                Transforms unstructured field dispatch logs into structured impact metrics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-gradient-to-b from-purple-50/20 to-white">
          
          {/* Preset Prompts Selector */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
              Select Sample Dispatch Log or Enter Custom:
            </span>
            <div className="space-y-1.5">
              {PRESET_ACTIVITIES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setInputText(preset)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                    inputText === preset
                      ? 'bg-purple-50 border-purple-300 text-purple-900 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="line-clamp-1">{preset}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Input Text Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Raw NGO Activity Description:
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw on-ground NGO activity notes..."
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 font-medium leading-relaxed"
            />
          </div>

          {/* Trigger Button */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Extracting Structured Impact Data...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Parse & Generate Structured Impact Summary</span>
              </>
            )}
          </button>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-white border border-purple-200 rounded-3xl p-5 shadow-sm space-y-4 animate-in fade-in">
              
              <div className="flex items-center justify-between pb-2 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-xs text-slate-900">Extracted Impact Parameters</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  AI-generated — requires human review
                </span>
              </div>

              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" /> Location
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                    {analysisResult.location}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Users className="w-3 h-3 text-emerald-600" /> Beneficiaries
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 block mt-0.5">
                    {analysisResult.beneficiaries}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-blue-600" /> Field Volunteers
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                    {analysisResult.volunteers}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1">
                    <Package className="w-3 h-3 text-amber-600" /> Resources
                  </span>
                  <span className="text-sm font-extrabold text-slate-900 block mt-0.5">
                    {analysisResult.resources}
                  </span>
                </div>
              </div>

              {/* Verified Impact Summary Sentence */}
              <div className="p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block mb-1">
                  Synthesized Impact Report
                </span>
                <p className="text-xs text-purple-950 font-medium leading-relaxed">
                  "{analysisResult.impact_summary}"
                </p>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Trained NLP parsing for verified donation utilization</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl text-slate-600 font-semibold hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
