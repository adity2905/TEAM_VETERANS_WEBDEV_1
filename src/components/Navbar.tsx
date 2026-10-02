'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Search, PlusCircle, Sparkles, ShieldCheck, Users, Landmark, Building2 } from 'lucide-react';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onOpenCreatePost?: () => void;
  onOpenAIMatcher?: () => void;
}

export default function Navbar({
  activeTab = 'feed',
  onTabChange,
  onOpenCreatePost,
  onOpenAIMatcher,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  Open<span className="text-emerald-600">Cause</span>
                </span>
                <span className="block text-[10px] uppercase font-semibold tracking-wider text-slate-500">
                  Transparent NGO Network
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
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Verify 80G Link */}
            <Link
              href="/verify"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Verify 80G Receipt"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verify 80G</span>
            </Link>

            {/* NGO Portal Link */}
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
              title="NGO Partner Portal"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">NGO Portal</span>
            </Link>

            {/* AI Cause Matcher Button */}
            <button
              onClick={onOpenAIMatcher}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/80 rounded-lg transition-all shadow-xs hover:shadow-sm"
              title="Find NGOs using AI"
            >
              <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
              <span className="hidden sm:inline">AI Matcher</span>
            </button>

            {/* Post Activity Button */}
            <button
              onClick={onOpenCreatePost}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Post Activity</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="flex md:hidden border-t border-slate-100 overflow-x-auto px-2 py-1.5 gap-1 bg-slate-50/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange?.(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
