'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { NGO, Fundraiser, VolunteerNeed, VolunteerApplication, Donation } from '@/types';
import { DataService } from '@/lib/dataService';
import { 
  Building2, Users, Landmark, FileText, PlusCircle, CheckCircle2, 
  ArrowLeft, ShieldCheck, TrendingUp, Calendar, MapPin, Clock, 
  ChevronRight, Award, ExternalLink
} from 'lucide-react';

export default function NGODashboard() {
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [selectedNgoId, setSelectedNgoId] = useState<string>('ngo-1');
  const [activeTab, setActiveTab] = useState<'volunteers' | 'fundraiser' | 'drive' | 'ledger'>('volunteers');

  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([]);
  const [applications, setApplications] = useState<VolunteerApplication[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  // New Fundraiser Form State
  const [fundTitle, setFundTitle] = useState('');
  const [fundDesc, setFundDesc] = useState('');
  const [fundTarget, setFundTarget] = useState<number>(100000);
  const [fundUnitCost, setFundUnitCost] = useState('₹250 supplies 1 warm blanket kit');
  const [fundImg, setFundImg] = useState('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900&auto=format&fit=crop');
  const [fundSuccess, setFundSuccess] = useState(false);

  // New Volunteer Need Form State
  const [needTitle, setNeedTitle] = useState('');
  const [needDesc, setNeedDesc] = useState('');
  const [needLocation, setNeedLocation] = useState('Mumbai, Maharashtra');
  const [needDate, setNeedDate] = useState('2026-10-18 09:00 AM');
  const [needSlots, setNeedSlots] = useState<number>(15);
  const [needSkills, setNeedSkills] = useState('Logistics, Communication');
  const [needSuccess, setNeedSuccess] = useState(false);

  const loadData = async () => {
    const [allNgos, allFunds, allNeeds, allApps, allDons] = await Promise.all([
      DataService.getNGOs(),
      DataService.getFundraisers(),
      DataService.getVolunteerNeeds(),
      DataService.getVolunteerApplications(),
      DataService.getDonations(),
    ]);

    setNgos(allNgos);
    setFundraisers(allFunds);
    setVolunteerNeeds(allNeeds);
    setApplications(allApps);
    setDonations(allDons);
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentNGO = ngos.find((n) => n.id === selectedNgoId) || ngos[0];
  const ngoFundraisers = fundraisers.filter((f) => f.ngo_id === selectedNgoId);
  const totalRaised = ngoFundraisers.reduce((acc, curr) => acc + Number(curr.raised_amount || 0), 0);

  const handleApproveApplication = async (appId: string) => {
    await DataService.updateApplicationStatus(appId, 'approved');
    await loadData();
  };

  const handleCreateFundraiser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fundTitle || !fundDesc) return;

    await DataService.createFundraiser({
      ngo_id: selectedNgoId,
      title: fundTitle,
      description: fundDesc,
      target_amount: Number(fundTarget),
      unit_cost_description: fundUnitCost,
      status: 'active',
      deadline: '2026-12-31',
      image_url: fundImg,
    });

    setFundSuccess(true);
    setFundTitle('');
    setFundDesc('');
    await loadData();
    setTimeout(() => setFundSuccess(false), 3000);
  };

  const handleCreateVolunteerNeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!needTitle || !needDesc) return;

    await DataService.createVolunteerNeed({
      ngo_id: selectedNgoId,
      title: needTitle,
      description: needDesc,
      location: needLocation,
      event_date: needDate,
      total_slots: Number(needSlots),
      skills_required: needSkills.split(',').map((s) => s.trim()),
      status: 'open',
    });

    setNeedSuccess(true);
    setNeedTitle('');
    setNeedDesc('');
    await loadData();
    setTimeout(() => setNeedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Top Navbar for NGO Portal */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Feed</span>
            </Link>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                NGO Partner Portal
              </span>
              <span className="text-[10px] uppercase font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
                Verified Org
              </span>
            </div>
          </div>

          {/* NGO Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden md:inline">Viewing as:</span>
            <select
              value={selectedNgoId}
              onChange={(e) => setSelectedNgoId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs sm:text-sm text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {ngos.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* NGO Overview Header Card */}
        {currentNGO && (
          <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-6 backdrop-blur-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden border-2 border-emerald-500 shrink-0">
                <img src={currentNGO.logo_url} alt={currentNGO.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-white">{currentNGO.name}</h1>
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Reg: {currentNGO.reg_number}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-xl">{currentNGO.tagline}</p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>Live Public Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Live Metrics Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium block">Total Funds Raised</span>
            <span className="text-2xl font-black text-emerald-400 mt-1 block">
              ₹{totalRaised.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">Directly audited</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium block">Active Campaigns</span>
            <span className="text-2xl font-black text-white mt-1 block">
              {ngoFundraisers.length}
            </span>
            <span className="text-[11px] text-emerald-400 mt-1 block">100% On-Ground</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium block">Volunteer Applicants</span>
            <span className="text-2xl font-black text-blue-400 mt-1 block">
              {applications.length}
            </span>
            <span className="text-[11px] text-slate-400 mt-1 block">Across all drives</span>
          </div>

          <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-4">
            <span className="text-xs text-slate-400 font-medium block">Transparency Rating</span>
            <span className="text-2xl font-black text-amber-400 mt-1 block">
              {currentNGO?.transparency_score || 98}/100
            </span>
            <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sec 80G Compliant
            </span>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'volunteers'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Volunteer Applicants ({applications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fundraiser')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'fundraiser'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Launch Fundraiser</span>
          </button>

          <button
            onClick={() => setActiveTab('drive')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'drive'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Volunteer Drive</span>
          </button>

          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Donation & 80G Ledger</span>
          </button>
        </div>

        {/* TAB 1: VOLUNTEER APPLICANTS */}
        {activeTab === 'volunteers' && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div>
                <h3 className="font-bold text-white text-base">Community Volunteer Applications</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review interested citizens, confirm passes, and assign roles
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-sm text-slate-500 py-6 text-center">No applications yet.</p>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 bg-slate-900/60 border border-slate-700/70 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{app.applicant_name}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            app.status === 'approved'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {app.status === 'approved' ? 'Pass Approved' : 'Pending Review'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                        <span>📧 {app.applicant_email}</span>
                        {app.applicant_phone && <span>📞 {app.applicant_phone}</span>}
                      </div>
                      {app.skills && (
                        <p className="text-xs text-slate-300 mt-1">
                          <strong>Skills/Notes:</strong> {app.skills}
                        </p>
                      )}
                    </div>

                    {app.status !== 'approved' && (
                      <button
                        onClick={() => handleApproveApplication(app.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                      >
                        Approve Pass
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: LAUNCH NEW FUNDRAISER */}
        {activeTab === 'fundraiser' && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 max-w-2xl">
            <h3 className="font-bold text-white text-base mb-1">Launch Transparent Micro-Fundraiser</h3>
            <p className="text-xs text-slate-400 mb-6">
              Every fundraiser must include a verifiable unit-cost breakdown to guarantee donor trust.
            </p>

            {fundSuccess && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Fundraiser published successfully and is live on the public feed!
              </div>
            )}

            <form onSubmit={handleCreateFundraiser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fundraiser Campaign Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Winter Blankets & Warm Soup for 1,000 Slum Elders"
                  value={fundTitle}
                  onChange={(e) => setFundTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cause Details & Beneficiary Scope
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain exactly how the funds will be utilized and distributed on ground..."
                  value={fundDesc}
                  onChange={(e) => setFundDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Target Goal Amount (INR)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    required
                    value={fundTarget}
                    onChange={(e) => setFundTarget(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unit-Cost Impact Rule
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹250 supplies 1 warm blanket"
                    value={fundUnitCost}
                    onChange={(e) => setFundUnitCost(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Campaign Cover Photo URL
                </label>
                <input
                  type="url"
                  required
                  value={fundImg}
                  onChange={(e) => setFundImg(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                Publish Fundraiser Immediately
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: POST VOLUNTEER DRIVE */}
        {activeTab === 'drive' && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 max-w-2xl">
            <h3 className="font-bold text-white text-base mb-1">Create Volunteer Call</h3>
            <p className="text-xs text-slate-400 mb-6">
              Recruit local youth and professionals with transparent volunteer requirements.
            </p>

            {needSuccess && (
              <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 text-blue-300 rounded-xl text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                Volunteer drive published to the public Volunteer Hub!
              </div>
            )}

            <form onSubmit={handleCreateVolunteerNeed} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Volunteer Drive Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Weekend Slum Lake Clean-up & Plastic Sorting"
                  value={needTitle}
                  onChange={(e) => setNeedTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Responsibilities & Instructions
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the tasks, meet-up spot, what volunteers should bring..."
                  value={needDesc}
                  onChange={(e) => setNeedDesc(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Event Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={needDate}
                    onChange={(e) => setNeedDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Volunteer Slot Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={needSlots}
                    onChange={(e) => setNeedSlots(Number(e.target.value))}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    required
                    value={needLocation}
                    onChange={(e) => setNeedLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    required
                    value={needSkills}
                    onChange={(e) => setNeedSkills(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors cursor-pointer"
              >
                Post to Volunteer Hub
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: DONATION & 80G LEDGER */}
        {activeTab === 'ledger' && (
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div>
                <h3 className="font-bold text-white text-base">Public Transparency Ledger & 80G Receipts</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete audit log of all contributions credited to this NGO
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-700 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3">Receipt / Txn ID</th>
                    <th className="py-3 px-3">Donor Name</th>
                    <th className="py-3 px-3">Amount (INR)</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Tax Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {donations.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3 font-bold text-emerald-400">{d.receipt_id}</td>
                      <td className="py-3 px-3 font-sans text-slate-300">
                        {d.is_anonymous ? 'Anonymous Supporter' : d.donor_name}
                      </td>
                      <td className="py-3 px-3 font-bold text-white">₹{d.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 text-slate-400 font-sans">
                        {new Date(d.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-3 font-sans">
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
                          80G Verified
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
