'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Heart, 
  Award, 
  IndianRupee, 
  Users, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  FileCheck2, 
  Layers, 
  MapPin, 
  LogOut,
  Calendar
} from 'lucide-react';
import { User, Donation, VolunteerApplication, NGO } from '@/types';
import { DataService } from '@/lib/dataService';
import ImpactChainModal from '@/components/ImpactChainModal';

export default function UserDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [isImpactChainOpen, setIsImpactChainOpen] = useState(false);

  useEffect(() => {
    const user = DataService.getCurrentUser();
    setCurrentUser(user);

    const loadUserData = async () => {
      const [allDons, allApps] = await Promise.all([
        DataService.getDonations(),
        DataService.getVolunteerApplications(),
      ]);
      setDonations(allDons);
      setApplications(allApps);
    };
    loadUserData();
  }, []);

  const totalDonated = donations.reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black text-slate-900">
                Open<span className="text-emerald-600">Cause</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400">/</span>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-700">
              User Dashboard
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Explore NGOs
            </Link>
            <Link
              href="/login"
              onClick={() => DataService.setCurrentUser(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-2xl flex items-center justify-center border border-emerald-200 shadow-inner">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{currentUser?.name || 'Aditya Verma'}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Verified Supporter
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.email || 'aditya@tektonix.internal'} • {currentUser?.city || 'Pune'}, {currentUser?.state || 'Maharashtra'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsImpactChainOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Trace My Impact Chain</span>
            </button>
            <Link
              href="/map"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>View Impact Map</span>
            </Link>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Contributed</span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">₹{totalDonated.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">100% Tax Deductible (80G)</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Drives Volunteered</span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">{applications.length}</span>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">1 Approved & Active</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Lives Touched</span>
            <span className="text-2xl font-black text-purple-600 mt-1 block">185+</span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">Meals & study kits</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Transparency Score</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">100%</span>
            <span className="text-[11px] text-emerald-600 mt-0.5 block">Zero untracked rupee</span>
          </div>
        </div>

        {/* 2-Column: My Donations & My Volunteer Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* My Contributions Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                <span>My Contributions & 80G Receipts</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">{donations.length} records</span>
            </div>

            <div className="space-y-3">
              {donations.map((don) => (
                <div key={don.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">₹{don.amount.toLocaleString('en-IN')}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Receipt Generated
                    </span>
                  </div>

                  <div className="text-xs text-slate-500">
                    <div>Receipt No: <strong className="text-slate-800 font-mono">{don.receipt_id}</strong></div>
                    <div className="mt-0.5">Date: {new Date(don.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-emerald-700 font-semibold">Status: Utilized for Kits</span>
                    <button
                      type="button"
                      onClick={() => setIsImpactChainOpen(true)}
                      className="font-bold text-slate-800 hover:text-emerald-600 flex items-center gap-1"
                    >
                      <span>View Impact Chain</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* My Volunteer Applications Section */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span>My Volunteer Applications</span>
              </h3>
              <span className="text-xs font-semibold text-slate-500">{applications.length} drives</span>
            </div>

            <div className="space-y-3">
              {applications.map((app) => (
                <div key={app.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Ground Food Packaging & Dispatch</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      app.status === 'approved' 
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {app.status === 'approved' ? '✓ Approved' : '⏳ Pending Approval'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <strong>Logged Skills:</strong> {app.skills}
                  </p>

                  <div className="text-[11px] text-slate-400">
                    Application ID: {app.id} • Registered via OpenCause
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>

      <ImpactChainModal
        isOpen={isImpactChainOpen}
        onClose={() => setIsImpactChainOpen(false)}
      />

    </div>
  );
}
