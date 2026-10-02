'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FeedCard from '@/components/FeedCard';
import DonationModal from '@/components/DonationModal';
import VolunteerModal from '@/components/VolunteerModal';
import CreatePostModal from '@/components/CreatePostModal';
import AIMatcherModal from '@/components/AIMatcherModal';
import NGOProfileModal from '@/components/NGOProfileModal';
import ImpactStoriesBar, { StoryItem, STORIES_DATA } from '@/components/ImpactStoriesBar';
import StoryModal from '@/components/StoryModal';
import ImpactChainModal from '@/components/ImpactChainModal';
import DonorDashboardModal from '@/components/DonorDashboardModal';
import NeedHelpModal from '@/components/NeedHelpModal';
import SOSModal from '@/components/SOSModal';
import VoiceAssistantModal from '@/components/VoiceAssistantModal';
import ImpactMap from '@/components/ImpactMap';
import AIImpactSummaryModal from '@/components/AIImpactSummaryModal';
import { NGO, Post, Fundraiser, VolunteerNeed, Donation } from '@/types';
import { DataService } from '@/lib/dataService';
import { 
  Heart, ShieldCheck, Users, Landmark, Search, Filter, 
  Sparkles, PlusCircle, ArrowRight, Award, TrendingUp, CheckCircle2,
  Layers, Mic, AlertTriangle, HelpCircle, MapPin
} from 'lucide-react';

const SAMPLE_PASSPORT_DONATIONS: Donation[] = [
  {
    id: 'don-demo-1',
    fundraiser_id: 'fund-1',
    donor_name: 'You (Citizen Supporter)',
    donor_email: 'you@openimpact.in',
    amount: 1500,
    is_anonymous: false,
    receipt_id: 'REC-2026-80G-8472',
    created_at: '2026-09-29T14:30:00Z',
  },
  {
    id: 'don-demo-2',
    fundraiser_id: 'fund-2',
    donor_name: 'You (Citizen Supporter)',
    donor_email: 'you@openimpact.in',
    amount: 2400,
    is_anonymous: false,
    receipt_id: 'REC-2026-80G-9102',
    created_at: '2026-09-18T10:15:00Z',
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<'feed' | 'ngos' | 'fundraisers' | 'volunteer' | 'map'>('feed');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Data states
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([]);
  const [donations, setDonations] = useState<Donation[]>(SAMPLE_PASSPORT_DONATIONS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Standard Modal states
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [activeFundraiser, setActiveFundraiser] = useState<Fundraiser | null>(null);
  const [activeDonationNGO, setActiveDonationNGO] = useState<NGO | null>(null);

  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [activeVolunteerNeed, setActiveVolunteerNeed] = useState<VolunteerNeed | null>(null);

  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isAIMatcherOpen, setIsAIMatcherOpen] = useState(false);

  const [isNGOProfileOpen, setIsNGOProfileOpen] = useState(false);
  const [selectedNGO, setSelectedNGO] = useState<NGO | null>(null);

  // Advanced Feature Modals
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const [isImpactChainOpen, setIsImpactChainOpen] = useState(false);
  const [chainTargetPost, setChainTargetPost] = useState<Post | null>(null);
  const [chainTargetFundraiser, setChainTargetFundraiser] = useState<Fundraiser | null>(null);

  const [isDonorDashboardOpen, setIsDonorDashboardOpen] = useState(false);
  const [isNeedHelpOpen, setIsNeedHelpOpen] = useState(false);
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);
  const [isAISummaryOpen, setIsAISummaryOpen] = useState(false);

  // Load initial data
  const loadAllData = async () => {
    try {
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
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Filter Categories
  const categories = ['All', 'Hunger Relief', 'Education', 'Environment', 'Animal Welfare'];

  // Filtered lists
  const filteredPosts = posts.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.ngo?.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ngo?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredNGOs = ngos.filter((n) => {
    const matchesCat = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredFundraisers = fundraisers.filter((f) => {
    const matchesCat = selectedCategory === 'All' || f.ngo?.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.ngo?.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const filteredVolunteerNeeds = volunteerNeeds.filter((v) => {
    const matchesCat = selectedCategory === 'All' || v.ngo?.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ngo?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Action Triggers
  const handleOpenDonateForFundraiser = (fundraiser: Fundraiser) => {
    setActiveFundraiser(fundraiser);
    setActiveDonationNGO(fundraiser.ngo || null);
    setIsDonateOpen(true);
  };

  const handleOpenDonateForNGO = (ngoId: string) => {
    const targetFund = fundraisers.find((f) => f.ngo_id === ngoId) || fundraisers[0];
    const targetNGO = ngos.find((n) => n.id === ngoId) || null;
    setActiveFundraiser(targetFund || null);
    setActiveDonationNGO(targetNGO);
    setIsDonateOpen(true);
  };

  const handleOpenVolunteer = (need: VolunteerNeed) => {
    setActiveVolunteerNeed(need);
    setIsVolunteerOpen(true);
  };

  const handleOpenNGOProfile = (slugOrId: string) => {
    const target = ngos.find((n) => n.slug === slugOrId || n.id === slugOrId);
    if (target) {
      setSelectedNGO(target);
      setIsNGOProfileOpen(true);
    }
  };

  const handleAIMatchAction = (type: 'donate' | 'volunteer' | 'ngo', id: string) => {
    if (type === 'donate') {
      const fund = fundraisers.find((f) => f.id === id) || fundraisers[0];
      handleOpenDonateForFundraiser(fund);
    } else if (type === 'volunteer') {
      const need = volunteerNeeds.find((v) => v.id === id) || volunteerNeeds[0];
      handleOpenVolunteer(need);
    }
  };

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setIsStoryModalOpen(true);
  };

  const handleOpenImpactChainForPost = (post: Post) => {
    setChainTargetPost(post);
    const relatedFund = fundraisers.find((f) => f.ngo_id === post.ngo_id) || fundraisers[0];
    setChainTargetFundraiser(relatedFund);
    setIsImpactChainOpen(true);
  };

  const handleOpenGeneralImpactChain = () => {
    setChainTargetPost(posts[0] || null);
    setChainTargetFundraiser(fundraisers[0] || null);
    setIsImpactChainOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      
      {/* Navigation */}
      <Navbar
        activeTab={activeTab === 'map' ? 'feed' : activeTab}
        onTabChange={(tab) => setActiveTab(tab as any)}
        onOpenCreatePost={() => setIsCreatePostOpen(true)}
        onOpenAIMatcher={() => setIsAIMatcherOpen(true)}
        onOpenImpactChain={handleOpenGeneralImpactChain}
        onOpenDonorDashboard={() => setIsDonorDashboardOpen(true)}
        onOpenNeedHelp={() => setIsNeedHelpOpen(true)}
        onOpenVoiceAssistant={() => setIsVoiceAssistantOpen(true)}
        onOpenSOS={() => setIsSOSOpen(true)}
        onOpenAISummary={() => setIsAISummaryOpen(true)}
      />

      {/* Hero Banner with Live Metrics & Impact Chain CTA */}
      <section className="bg-gradient-to-b from-emerald-950 via-slate-900 to-slate-900 text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-emerald-900/30">
        <div className="max-w-7xl mx-auto">
          
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Traceable Impact • Zero Black-Box Donations</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              See the work. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Understand the impact.
              </span>{' '}
              Empower change.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed font-light">
              Explore verified NGO activities, track live photographic proof of drives, review transparency scores, and trace every single rupee from invoice to field deployment.
            </p>

            {/* Core USP Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleOpenGeneralImpactChain}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                <Layers className="w-4 h-4 text-slate-950" />
                <span>Explore The Impact Chain USP</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVoiceAssistantOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-all border border-white/20 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-amber-300 animate-pulse" />
                <span>वॉयस साथी (Hindi / Marathi)</span>
              </button>

              <button
                type="button"
                onClick={() => setIsDonorDashboardOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs transition-all border border-white/20 cursor-pointer"
              >
                <Award className="w-4 h-4 text-cyan-300" />
                <span>My Impact Passport</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-xs text-slate-400 font-medium block">Audited NGOs</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">4</span>
              <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Platform Reviewed
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-xs text-slate-400 font-medium block">Total Funds Raised</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">₹4.04L</span>
              <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                Across active drives
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-xs text-slate-400 font-medium block">Reported Lives Reached</span>
              <span className="text-2xl sm:text-3xl font-black text-cyan-400 mt-1 block">5,665+</span>
              <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                Meals, students & trees
              </span>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-xs">
              <span className="text-xs text-slate-400 font-medium block">Volunteer Spots Filled</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 mt-1 block">57 / 78</span>
              <span className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                Active ground drives
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Instagram/Threads-style Impact Stories Bar */}
        <ImpactStoriesBar onSelectStory={handleOpenStory} />

        {/* Search & Category Filter Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search causes, NGOs, cities (e.g. Mumbai, coding, food)..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>

            {/* Top Action Pills: AI Matcher & Regional Map */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'map' ? 'feed' : 'map')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2.5 text-xs sm:text-sm font-bold rounded-2xl border transition-all cursor-pointer ${
                  activeTab === 'map'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>{activeTab === 'map' ? 'Hide Map' : 'National Impact Map'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAIMatcherOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Smart AI Cause Finder</span>
              </button>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* VIEW: NATIONAL IMPACT MAP (If Map is activated) */}
        {activeTab === 'map' && (
          <div className="py-2">
            <ImpactMap 
              onSelectRegion={(reg) => {
                setSelectedCategory('All');
              }}
              onExploreCampaigns={() => setActiveTab('feed')}
            />
          </div>
        )}

        {/* TAB 1: IMPACT FEED */}
        {activeTab === 'feed' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Feed Posts Stream */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  Live Audited Community Feed
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredPosts.length} activities logged
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
                  <p className="text-slate-500 text-sm">No activity posts match your search.</p>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <FeedCard
                    key={post.id}
                    post={post}
                    onLike={(id) => DataService.likePost(id)}
                    onDonate={(ngoId) => handleOpenDonateForNGO(ngoId)}
                    onSelectNGO={(slug) => handleOpenNGOProfile(slug)}
                    onViewImpactChain={(p) => handleOpenImpactChainForPost(p)}
                  />
                ))
              )}
            </div>

            {/* Right Desktop Sidebar */}
            <div className="hidden lg:block lg:col-span-4 space-y-6">
              
              {/* Impact Chain Quick Banner */}
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base">The Impact Chain</h4>
                  <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                    Trace how ₹500 travels: from donation receipt to itemized purchase invoices, GPS coordinates, and ground beneficiary headcounts.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenGeneralImpactChain}
                  className="w-full py-2 px-3 bg-white text-orange-950 font-bold rounded-xl text-xs hover:bg-orange-50 transition-colors shadow-2xs"
                >
                  Inspect Interactive Audit Trail →
                </button>
              </div>

              {/* Urgent Fundraisers Widget */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    Urgent Fundraisers
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('fundraisers')}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-4">
                  {fundraisers.slice(0, 3).map((f) => {
                    const percent = Math.min(100, Math.round((Number(f.raised_amount) / Number(f.target_amount)) * 100));
                    return (
                      <div key={f.id} className="border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{f.title}</h4>
                        <span className="text-[11px] text-slate-500 block mt-0.5">{f.ngo?.name}</span>
                        
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-2">
                          <div style={{ width: `${percent}%` }} className="bg-emerald-500 h-full rounded-full" />
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span>₹{Number(f.raised_amount).toLocaleString('en-IN')} raised</span>
                          <button
                            type="button"
                            onClick={() => handleOpenDonateForFundraiser(f)}
                            className="font-bold text-emerald-600 hover:text-emerald-700"
                          >
                            Support →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Open Volunteer Drives Widget */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Urgent Volunteer Needs
                  </h3>
                  <button
                    type="button"
                    onClick={() => setActiveTab('volunteer')}
                    className="text-xs font-semibold text-blue-600 hover:underline"
                  >
                    View All
                  </button>
                </div>

                <div className="space-y-3">
                  {volunteerNeeds.slice(0, 2).map((v) => (
                    <div key={v.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{v.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{v.event_date}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 text-[11px]">
                        <span className="text-blue-700 font-semibold">{v.total_slots - v.filled_slots} spots left</span>
                        <button
                          type="button"
                          onClick={() => handleOpenVolunteer(v)}
                          className="font-bold text-blue-600 hover:text-blue-700"
                        >
                          Join →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Two-Way Help & Emergency Assistance Card */}
              <div className="bg-slate-900 text-white rounded-3xl p-5 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Two-Way Community Aid</span>
                </div>
                <h4 className="font-bold text-sm">Need immediate relief?</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Request food, medical supply kits or volunteer support directly from verified local NGOs.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsNeedHelpOpen(true)}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
                  >
                    I Need Help
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSOSOpen(true)}
                    className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                  >
                    SOS Triage
                  </button>
                </div>
              </div>

              {/* Transparency Audited Guarantee Card */}
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base">Transparency Audited Guarantee</h4>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  Every contribution is mapped directly to real receipts. Donors receive instant Sec 80G tax deduction receipts with QR verification.
                </p>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: VERIFIED NGOS DIRECTORY */}
        {activeTab === 'ngos' && (
          <div>
            <div className="mb-6 pb-2 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verified NGO Directory</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse non-profit organizations with reviewed track records and transparent ledgers
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {filteredNGOs.length} NGOs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                >
                  <div className="relative h-32 w-full bg-slate-900">
                    <img
                      src={ngo.banner_url}
                      alt={ngo.name}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute -bottom-5 left-4 w-14 h-14 rounded-2xl border-2 border-white bg-white overflow-hidden shadow-sm">
                      <img src={ngo.logo_url} alt={ngo.name} className="w-full h-full object-cover" />
                    </div>
                  </div>

                  <div className="pt-7 p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-slate-900 text-base">{ngo.name}</h3>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold mt-0.5">{ngo.category}</p>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {ngo.tagline}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Score: <strong className="text-emerald-700">{ngo.transparency_score}</strong>/100
                      </span>
                      <button
                        type="button"
                        onClick={() => handleOpenNGOProfile(ngo.id)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        View Audit & Work
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: FUNDRAISERS */}
        {activeTab === 'fundraisers' && (
          <div>
            <div className="mb-6 pb-2 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Active Cause Fundraisers</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct, unit-level transparent giving with itemized cost breakdowns
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {filteredFundraisers.length} Active Campaigns
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFundraisers.map((f) => {
                const percent = Math.min(100, Math.round((Number(f.raised_amount) / Number(f.target_amount)) * 100));
                return (
                  <div
                    key={f.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    <div className="relative h-44 w-full bg-slate-100">
                      <img src={f.image_url} alt={f.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                        {f.ngo?.name}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-900 text-base leading-snug">{f.title}</h3>
                        <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">
                          {f.description}
                        </p>
                        <div className="mt-3 bg-emerald-50 border border-emerald-200/60 rounded-xl p-2.5 text-xs text-emerald-800 font-medium">
                          ⚡ {f.unit_cost_description}
                        </div>
                      </div>

                      <div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-2">
                          <div style={{ width: `${percent}%` }} className="bg-emerald-600 h-full rounded-full" />
                        </div>
                        <div className="flex justify-between text-xs text-slate-600 mb-3">
                          <span><strong>₹{Number(f.raised_amount).toLocaleString('en-IN')}</strong> of ₹{Number(f.target_amount).toLocaleString('en-IN')}</span>
                          <span className="font-bold text-emerald-700">{percent}%</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenDonateForFundraiser(f)}
                            className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs text-center"
                          >
                            Donate & 80G Receipt
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setChainTargetFundraiser(f);
                              setIsImpactChainOpen(true);
                            }}
                            className="p-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold transition-colors"
                            title="Trace fund utilization"
                          >
                            <Layers className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VOLUNTEER HUB */}
        {activeTab === 'volunteer' && (
          <div>
            <div className="mb-6 pb-2 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Community Volunteer Hub</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lend your skills and hands to verified on-ground social drives
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-600">
                {filteredVolunteerNeeds.length} Open Calls
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVolunteerNeeds.map((need) => (
                <div
                  key={need.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                        {need.ngo?.name}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {need.total_slots - need.filled_slots} spots left
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">{need.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{need.description}</p>

                    <div className="text-xs text-slate-500 space-y-1 pt-1">
                      <div>📍 <strong>Location:</strong> {need.location}</div>
                      <div>📅 <strong>Time:</strong> {need.event_date}</div>
                    </div>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {need.skills_required.map((skill) => (
                        <span key={skill} className="text-[11px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-5">
                    <button
                      type="button"
                      onClick={() => handleOpenVolunteer(need)}
                      className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
                    >
                      Sign Up as Volunteer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md overflow-hidden bg-emerald-600 flex items-center justify-center p-0.5">
              <img src="/icon.svg" alt="Transparency" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-bold">Transparency</span>
            <span>— NGO Transparency Platform</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Next.js 16</span>
            <span>•</span>
            <span>Tailwind CSS</span>
            <span>•</span>
            <span>Impact Chain USP</span>
            <span>•</span>
            <span>Saathi Voice Assistant</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        fundraiser={activeFundraiser}
        ngo={activeDonationNGO}
        onDonationSuccess={(newDonation?: Donation) => {
          loadAllData();
          if (newDonation) {
            setDonations(prev => [newDonation, ...prev]);
          }
        }}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        need={activeVolunteerNeed}
        onApplicationSuccess={loadAllData}
      />

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        ngos={ngos}
        onPostCreated={loadAllData}
      />

      <AIMatcherModal
        isOpen={isAIMatcherOpen}
        onClose={() => setIsAIMatcherOpen(false)}
        ngos={ngos}
        volunteerNeeds={volunteerNeeds}
        fundraisers={fundraisers}
        onSelectAction={handleAIMatchAction}
      />

      <NGOProfileModal
        isOpen={isNGOProfileOpen}
        onClose={() => setIsNGOProfileOpen(false)}
        ngo={selectedNGO}
        fundraisers={fundraisers}
        volunteerNeeds={volunteerNeeds}
        posts={posts}
        onDonate={(f) => handleOpenDonateForFundraiser(f)}
        onVolunteer={(v) => handleOpenVolunteer(v)}
      />

      {/* Advanced Feature Modals */}
      <StoryModal
        isOpen={isStoryModalOpen}
        initialIndex={activeStoryIndex}
        onClose={() => setIsStoryModalOpen(false)}
        onDonate={(fId) => {
          setIsStoryModalOpen(false);
          const f = fundraisers.find(fund => fund.id === fId) || fundraisers[0];
          handleOpenDonateForFundraiser(f);
        }}
        onVolunteer={(vId) => {
          setIsStoryModalOpen(false);
          const v = volunteerNeeds.find(need => need.id === vId) || volunteerNeeds[0];
          handleOpenVolunteer(v);
        }}
      />

      <ImpactChainModal
        isOpen={isImpactChainOpen}
        onClose={() => setIsImpactChainOpen(false)}
        post={chainTargetPost}
        fundraiser={chainTargetFundraiser}
        ngo={chainTargetFundraiser?.ngo || chainTargetPost?.ngo || null}
        onDonate={(fundId) => {
          setIsImpactChainOpen(false);
          const f = fundraisers.find(fund => fund.id === fundId) || fundraisers[0];
          handleOpenDonateForFundraiser(f);
        }}
      />

      <DonorDashboardModal
        isOpen={isDonorDashboardOpen}
        onClose={() => setIsDonorDashboardOpen(false)}
        donations={donations}
        onOpenImpactChain={() => {
          setIsDonorDashboardOpen(false);
          handleOpenGeneralImpactChain();
        }}
      />

      <NeedHelpModal
        isOpen={isNeedHelpOpen}
        onClose={() => setIsNeedHelpOpen(false)}
      />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

      <VoiceAssistantModal
        isOpen={isVoiceAssistantOpen}
        onClose={() => setIsVoiceAssistantOpen(false)}
        onOpenDonate={(fundId) => {
          setIsVoiceAssistantOpen(false);
          const f = fundraisers.find(fund => fund.id === fundId) || fundraisers[0];
          handleOpenDonateForFundraiser(f);
        }}
        onOpenChain={() => {
          setIsVoiceAssistantOpen(false);
          handleOpenGeneralImpactChain();
        }}
      />

      <AIImpactSummaryModal
        isOpen={isAISummaryOpen}
        onClose={() => setIsAISummaryOpen(false)}
      />

    </div>
  );
}
