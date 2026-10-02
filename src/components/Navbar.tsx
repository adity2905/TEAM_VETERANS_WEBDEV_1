'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  PlusCircle, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  Landmark, 
  Building2, 
  Layers, 
  Award, 
  HelpCircle, 
  Mic, 
  AlertTriangle,
  MapPin,
  LogIn,
  FileSpreadsheet
} from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenCreatePost?: () => void;
  onOpenAIMatcher?: () => void;
  onOpenImpactChain?: () => void;
  onOpenDonorDashboard?: () => void;
  onOpenNeedHelp?: () => void;
  onOpenVoiceAssistant?: () => void;
  onOpenSOS?: () => void;
  onOpenAISummary?: () => void;
}

export default function Navbar({
  activeTab = 'feed',
  onTabChange,
  onOpenCreatePost,
  onOpenAIMatcher,
  onOpenImpactChain,
  onOpenDonorDashboard,
  onOpenNeedHelp,
  onOpenVoiceAssistant,
  onOpenSOS,
  onOpenAISummary,
}: NavbarProps) {
  const navItems = [
    { id: 'feed', label: 'Impact Feed', icon: Heart },
    { id: 'ngos', label: 'Verified NGOs', icon: ShieldCheck },
    { id: 'fundraisers', label: 'Fundraisers', icon: Landmark },
    { id: 'volunteer', label: 'Volunteer Hub', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Tagline */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform overflow-hidden p-1.5">
                <img src="/icon.svg" alt="Transparency Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1">
                  Trans<span className="text-emerald-600">parency</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                  Audited NGO Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}

            {/* Direct Link to Real Leaflet Impact Map */}
            <Link
              href="/map"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>India Map</span>
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* Impact Chain Core USP Trigger */}
            <button
              type="button"
              onClick={onOpenImpactChain}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-all shadow-2xs cursor-pointer"
              title="Trace donation utilization from purchase to verified GPS evidence"
            >
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              <span>Chain</span>
            </button>

            {/* AI Summary Engine */}
            <button
              type="button"
              onClick={onOpenAISummary}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-purple-800 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-all shadow-2xs cursor-pointer"
              title="Practical AI Impact Summary from raw descriptions"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>AI Summary</span>
            </button>

            {/* Voice Assistant Saathi */}
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-2 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-all cursor-pointer"
              title="Multilingual Voice Assistant (Hindi / Marathi / English)"
            >
              <Mic className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span className="hidden sm:inline">वॉयस साथी</span>
            </button>

            {/* SOS Emergency button */}
            <button
              type="button"
              onClick={onOpenSOS}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-extrabold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-300 transition-all shadow-2xs cursor-pointer"
              title="Emergency SOS Triage"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>SOS</span>
            </button>

            {/* Login / Account Trigger */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>

            {/* Post Activity Button */}
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Activity</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="flex md:hidden border-t border-slate-100 overflow-x-auto px-2 py-1.5 gap-1.5 bg-slate-50/80 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-2xs font-bold border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
        <Link
          href="/map"
          className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold whitespace-nowrap bg-emerald-50 text-emerald-800 border border-emerald-200"
        >
          <MapPin className="w-3 h-3 text-emerald-600" />
          <span>India Map</span>
        </Link>
        <button
          type="button"
          onClick={onOpenImpactChain}
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap bg-amber-50 text-amber-800 border border-amber-200"
        >
          <Layers className="w-3 h-3 text-amber-600" />
          <span>Chain</span>
        </button>
        <Link
          href="/admin/verify"
          className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold whitespace-nowrap bg-purple-50 text-purple-800 border border-purple-200"
        >
          <ShieldCheck className="w-3 h-3 text-purple-600" />
          <span>Verifier Desk</span>
        </Link>
      </div>
    </header>
  );
}
