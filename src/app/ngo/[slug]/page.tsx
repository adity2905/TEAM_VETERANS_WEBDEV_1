'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { NGO, Fundraiser, VolunteerNeed, Post } from '@/types';
import { DataService } from '@/lib/dataService';
import DonationModal from '@/components/DonationModal';
import VolunteerModal from '@/components/VolunteerModal';
import FeedCard from '@/components/FeedCard';
import { 
  ShieldCheck, Award, MapPin, Calendar, ArrowLeft, Heart, 
  Users, CheckCircle2, Landmark, Share2 
} from 'lucide-react';

export default function DedicatedNGOPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [ngo, setNgo] = useState<NGO | null>(null);
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [volunteerNeeds, setVolunteerNeeds] = useState<VolunteerNeed[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [selectedFundraiser, setSelectedFundraiser] = useState<Fundraiser | null>(null);
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [selectedNeed, setSelectedNeed] = useState<VolunteerNeed | null>(null);

  const loadData = async () => {
    try {
      const allNgos = await DataService.getNGOs();
      const matched = allNgos.find((n) => n.slug === slug || n.id === slug) || allNgos[0];
      setNgo(matched);

      if (matched) {
        const [allFunds, allNeeds, allPosts] = await Promise.all([
          DataService.getFundraisers(),
          DataService.getVolunteerNeeds(),
          DataService.getPosts(),
        ]);

        setFundraisers(allFunds.filter((f) => f.ngo_id === matched.id));
        setVolunteerNeeds(allNeeds.filter((v) => v.ngo_id === matched.id));
        setPosts(allPosts.filter((p) => p.ngo_id === matched.id));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!ngo) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800">NGO Not Found</h2>
        <Link href="/" className="mt-4 text-emerald-600 font-semibold hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Bar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Community Feed</span>
          </Link>

          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Verified Transparency Record
          </span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-64 sm:h-80 w-full bg-slate-900">
        <Image
          src={ngo.banner_url}
          alt={ngo.name}
          fill
          className="object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute -bottom-8 max-w-7xl mx-auto left-4 right-4 sm:left-8 sm:right-8 flex items-end justify-between">
          <div className="flex items-end gap-4">
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-white shrink-0">
              <Image src={ngo.logo_url} alt={ngo.name} fill className="object-cover" />
            </div>
            <div className="mb-2 text-white">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-3xl font-black">{ngo.name}</h1>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-light mt-0.5">{ngo.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12 flex-1 w-full space-y-8">
        
        {/* Info & Metrics Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
              {ngo.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {ngo.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Founded {ngo.founded_year}
              </span>
              <span>•</span>
              <span className="font-mono text-slate-600 font-semibold">Reg ID: {ngo.reg_number}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-800 block">Transparency</span>
              <span className="text-xl font-black text-emerald-700">{ngo.transparency_score}/100</span>
            </div>

            {fundraisers.length > 0 && (
              <button
                onClick={() => {
                  setSelectedFundraiser(fundraisers[0]);
                  setIsDonateOpen(true);
                }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                Donate Directly
              </button>
            )}
          </div>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: About & Past Impact Posts */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Mission Statement */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
              <h2 className="text-base font-bold text-slate-900">About the Mission</h2>
              <p className="text-sm text-slate-600 leading-relaxed">{ngo.description}</p>
              
              {/* Financial Allocation Bar */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5 font-semibold">
                  <span>Audited Expenditure Allocation</span>
                  <span className="text-emerald-700">88% Direct Field Deployment</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex">
                  <div style={{ width: '88%' }} className="bg-emerald-500" title="88% Direct Beneficiary Aid" />
                  <div style={{ width: '7%' }} className="bg-blue-500" title="7% Operations" />
                  <div style={{ width: '5%' }} className="bg-amber-400" title="5% Fundraising" />
                </div>
              </div>
            </div>

            {/* Verified Activity Feed for this NGO */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-emerald-600" />
                Field Activities & Photographic Proof ({posts.length})
              </h2>

              {posts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  onLike={(id) => DataService.likePost(id)}
                  onDonate={() => {
                    setSelectedFundraiser(fundraisers[0] || null);
                    setIsDonateOpen(true);
                  }}
                />
              ))}
            </div>

          </div>

          {/* Right: Urgent Fundraisers & Volunteer Drives */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Active Fundraisers */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-600" />
                Ongoing Fundraisers ({fundraisers.length})
              </h3>

              {fundraisers.map((f) => {
                const percent = Math.min(100, Math.round((Number(f.raised_amount) / Number(f.target_amount)) * 100));
                return (
                  <div key={f.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">{f.title}</h4>
                    <p className="text-[11px] text-emerald-700 font-medium">⚡ {f.unit_cost_description}</p>
                    
                    <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-1">
                      <div style={{ width: `${percent}%` }} className="bg-emerald-600 h-full rounded-full" />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>₹{Number(f.raised_amount).toLocaleString('en-IN')} raised</span>
                      <span className="font-bold text-emerald-700">{percent}%</span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFundraiser(f);
                        setIsDonateOpen(true);
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer mt-2"
                    >
                      Donate with 80G Receipt
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Volunteer Drives */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Volunteer Drives ({volunteerNeeds.length})
              </h3>

              {volunteerNeeds.map((v) => (
                <div key={v.id} className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/60 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{v.title}</h4>
                  <p className="text-[11px] text-slate-500">{v.event_date} • {v.location}</p>
                  <span className="inline-block text-[11px] font-semibold text-blue-700">
                    {v.total_slots - v.filled_slots} spots remaining
                  </span>

                  <button
                    onClick={() => {
                      setSelectedNeed(v);
                      setIsVolunteerOpen(true);
                    }}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer mt-1"
                  >
                    Join as Volunteer
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

      </main>

      {/* Modals */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        fundraiser={selectedFundraiser}
        ngo={ngo}
        onDonationSuccess={loadData}
      />

      <VolunteerModal
        isOpen={isVolunteerOpen}
        onClose={() => setIsVolunteerOpen(false)}
        need={selectedNeed}
        onApplicationSuccess={loadData}
      />

    </div>
  );
}
