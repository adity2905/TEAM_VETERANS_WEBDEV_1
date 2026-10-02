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
  Mic, 
  AlertTriangle,
  MapPin,
  LogIn,
  Menu,
  X,
  ChevronDown
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
  onOpenRegisterNGO?: () => void;
  onOpenUserVerify?: () => void;
  onOpenRegistrationChoice?: () => void;
  isUserVerified?: boolean;
  currentUserName?: string;
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
  onOpenRegisterNGO,
  onOpenUserVerify,
  onOpenRegistrationChoice,
  isUserVerified = false,
  currentUserName,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  const navItems = [
    { id: 'feed', label: 'Impact Feed', icon: Heart },
    { id: 'ngos', label: 'Verified NGOs', icon: ShieldCheck },
    { id: 'fundraisers', label: 'Fundraisers', icon: Landmark },
    { id: 'volunteer', label: 'Volunteer Hub', icon: Users },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform overflow-hidden p-1.5">
                <img src="/icon.svg" alt="Transparency" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-0.5">
                  Trans<span className="text-emerald-600">parency</span>
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-emerald-700">
                  Audited NGO Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Center Tabs: Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange?.(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-2xs font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Direct Link to Real Leaflet Impact Map */}
            <Link
              href="/map"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs lg:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>India Map</span>
            </Link>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Saathi Voice Assistant Pill */}
            <button
              type="button"
              onClick={onOpenVoiceAssistant}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-orange-700 bg-orange-50 hover:bg-orange-100 rounded-xl border border-orange-200 transition-all cursor-pointer shadow-2xs"
              title="Multilingual Voice Assistant (Hindi / Marathi / English)"
            >
              <Mic className="w-3.5 h-3.5 text-orange-600 animate-pulse" />
              <span>साथी</span>
            </button>

            {/* Smart Tools Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span className="hidden sm:inline">Tools</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {toolsDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-50 duration-150"
                  onClick={() => setToolsDropdownOpen(false)}
                >
                  <button
                    type="button"
                    onClick={onOpenImpactChain}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-amber-600" />
                    <div>
                      <div className="font-bold text-slate-900">The Impact Chain</div>
                      <div className="text-[10px] text-slate-500">Trace funds to field receipts</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAIMatcher}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900">AI Cause Matcher</div>
                      <div className="text-[10px] text-slate-500">Find tailored causes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={onOpenAISummary}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Award className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-slate-900">AI Impact Summary</div>
                      <div className="text-[10px] text-slate-500">Summarize activity reports</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <button
                    type="button"
                    onClick={onOpenNeedHelp}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-bold text-rose-800">Two-Way Help / SOS</div>
                      <div className="text-[10px] text-rose-600/80">Request immediate relief</div>
                    </div>
                  </button>

                  <Link
                    href="/verify"
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-slate-900">80G Receipt Verifier</div>
                      <div className="text-[10px] text-slate-500">Verify tax exemption QR</div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={onOpenRegistrationChoice}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2.5 cursor-pointer bg-emerald-50/50"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-bold text-emerald-950">Registration Hub</div>
                      <div className="text-[10px] text-emerald-700">Choose NGO, Citizen or Guest</div>
                    </div>
                  </button>

                  <div className="border-t border-slate-100 my-1"></div>

                  <Link
                    href="/dashboard"
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <Building2 className="w-4 h-4 text-slate-600" />
                    <div>
                      <div className="font-bold text-slate-900">NGO Partner Portal</div>
                      <div className="text-[10px] text-slate-500">Auditor queue & drives</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Citizen KYC Pass Button */}
            <button
              type="button"
              onClick={onOpenRegistrationChoice || onOpenUserVerify}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isUserVerified
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Click to manage registration, switch roles or complete KYC"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isUserVerified ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isUserVerified ? (currentUserName || 'Aditya Verma (Verified Citizen)') : 'Verify ID'}</span>
            </button>

            {/* Register NGO Button */}
            <button
              type="button"
              onClick={onOpenRegistrationChoice || onOpenRegisterNGO}
              className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200 cursor-pointer"
              title="First-time NGO registration with past evidences"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Register NGO</span>
            </button>

            {/* Primary Action: Post Proof */}
            <button
              type="button"
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Post Proof</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange?.(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold ${
                    activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-700'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-600" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2 flex flex-wrap gap-2">
            <Link
              href="/map"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-800"
            >
              India Map
            </Link>
            <button
              type="button"
              onClick={() => {
                (onOpenRegistrationChoice || onOpenRegisterNGO)?.();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 text-xs font-bold text-white text-center cursor-pointer"
            >
              Register / Choose Role
            </button>
            <Link
              href="/dashboard"
              className="flex-1 text-center py-2 px-3 rounded-xl bg-slate-100 text-xs font-bold text-slate-800"
            >
              Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
