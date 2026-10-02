'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MapPin, 
  ShieldCheck, 
  Users, 
  Landmark, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ArrowLeft,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import RealLeafletMap from '@/components/RealLeafletMap';
import NGOProfileModal from '@/components/NGOProfileModal';
import { NGO, StateImpactData, Fundraiser, VolunteerNeed, Post } from '@/types';
import { DataService } from '@/lib/dataService';
import { STATE_METRICS } from '@/lib/mockData';

export default function MapPage() {
  const router = useRouter();
  const [selectedStateName, setSelectedStateName] = useState<string>('Maharashtra');
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([]);
  
  // NGO Profile Modal state
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [isNgoModalOpen, setIsNgoModalOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [allNgos, allPosts, allFunds, allNeeds] = await Promise.all([
        DataService.getNGOs(),
        DataService.getPosts(),
        DataService.getFundraisers(),
        DataService.getVolunteerNeeds(),
      ]);
      setNgos(allNgos);
      setPosts(allPosts);
      setFundraisers(allFunds);
      setVolunteerNeeds(allNeeds);
    };
    loadData();
  }, []);

  const currentState = STATE_METRICS.find(
    (s) => s.state.toLowerCase() === selectedStateName.toLowerCase()
  ) || STATE_METRICS[0];

  const stateNgos = ngos.filter(
    (n) => (n.state && n.state.toLowerCase().includes(selectedStateName.toLowerCase())) ||
      n.location.toLowerCase().includes(selectedStateName.toLowerCase())
  );

  const handleOpenNGO = (ngo: NGO) => {
    setSelectedNgo(ngo);
    setIsNgoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-xl font-black text-slate-900">
                Open<span className="text-emerald-600">Cause</span>
              </span>
            </Link>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-400">/</span>
            <span className="hidden sm:inline-block text-xs font-bold text-slate-700">
              National Impact Map (Leaflet + OpenStreetMap)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Feed</span>
            </Link>
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-2xs"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Map Explorer Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        
        {/* State Selection Bar */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>Select State / Territory (India)</span>
            </span>
            <span className="text-[11px] text-slate-400">
              {STATE_METRICS.length} Regional Jurisdictions Logged
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {STATE_METRICS.map((st) => {
              const isSelected = st.state.toLowerCase() === selectedStateName.toLowerCase();
              return (
                <button
                  key={st.state}
                  type="button"
                  onClick={() => setSelectedStateName(st.state)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st.state}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Layout: Real Map on Left, State Metrics Panel on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Map Column (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <RealLeafletMap
              ngos={ngos}
              selectedState={selectedStateName}
              onSelectNGO={handleOpenNGO}
              onSelectState={(st) => setSelectedStateName(st)}
            />
            
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Geographic pins represent verified NGO operational headquarters.</span>
              </span>
              <span className="text-slate-400">Coordinates via OpenStreetMap API</span>
            </div>
          </div>

          {/* State Detail Panel Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* State Aggregate Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
              
              <div className="flex items-start justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                    Regional Impact Ledger
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    {currentState.state}
                  </h2>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                  {currentState.verifiedNgoCount} Platform Verified
                </span>
              </div>

              {/* 4-Box Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered NGOs</span>
                  <span className="text-xl font-black text-slate-900">{currentState.ngoCount}</span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-medium">
                    {currentState.verifiedNgoCount} reviewed
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Active Volunteers</span>
                  <span className="text-xl font-black text-blue-700">{currentState.volunteerCount.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">On-ground force</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">People Reached</span>
                  <span className="text-xl font-black text-emerald-600">{currentState.peopleReached.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Citizens supported</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Funds Raised</span>
                  <span className="text-xl font-black text-slate-900">{currentState.fundsRaised}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{currentState.activeCampaigns} campaigns</span>
                </div>
              </div>

              {/* Cause Distribution */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
                  Cause Distribution
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentState.causes.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-1 italic">
                * Note: Demo platform data for TEKTONIX 2026 hackathon.
              </div>

            </div>

            {/* NGOs in Selected State Listing */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">
                  NGOs in {currentState.state} ({stateNgos.length})
                </h3>
                <span className="text-xs font-semibold text-emerald-700">Platform Reviewed</span>
              </div>

              <div className="space-y-3">
                {stateNgos.length === 0 ? (
                  <p className="text-xs text-slate-500 py-3 text-center">
                    No registered NGOs listed for this state yet.
                  </p>
                ) : (
                  stateNgos.map((ngo) => (
                    <div
                      key={ngo.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 hover:border-emerald-500 transition-colors flex flex-col justify-between space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {ngo.name}
                            </h4>
                            <span title="Platform Verified">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{ngo.city || ngo.location}</span>
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-emerald-800 border border-emerald-200">
                          {ngo.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200/60">
                        <div className="flex items-center gap-3 text-[11px]">
                          <span>🤝 <strong>{ngo.volunteers_needed_count || 8}</strong> Needed</span>
                          <span>⚡ <strong>{ngo.active_campaigns_count || 1}</strong> Active</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenNGO(ngo)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          View NGO →
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </main>

      {/* Complete NGO Profile Modal */}
      <NGOProfileModal
        isOpen={isNgoModalOpen}
        onClose={() => setIsNgoModalOpen(false)}
        ngo={selectedNgo}
        posts={posts}
        fundraisers={fundraisers}
        volunteerNeeds={volunteerNeeds}
        onDonate={(f) => {
          setIsNgoModalOpen(false);
          router.push(`/?donate=${f.id}`);
        }}
        onVolunteer={(v) => {
          setIsNgoModalOpen(false);
          router.push(`/?volunteer=${v.id}`);
        }}
      />

    </div>
  );
}
