'use client';

import React, { useState } from 'react';
import { 
  MapPin, 
  Layers, 
  Sparkles, 
  Users, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  HeartHandshake
} from 'lucide-react';

export interface RegionData {
  id: string;
  state: string;
  cityHub: string;
  activeNgosCount: number;
  totalFundsUtilized: string;
  beneficiariesReached: string;
  topSectors: string[];
  recentHighlight: string;
  verifiedRate: string;
  coordinates: { x: number; y: number }; // percentage coordinates for interactive map
}

const REGIONS: RegionData[] = [
  {
    id: 'mh',
    state: 'Maharashtra',
    cityHub: 'Mumbai / Pune / Nashik',
    activeNgosCount: 14,
    totalFundsUtilized: '₹14.2 Lakhs',
    beneficiariesReached: '18,400+ Citizens',
    topSectors: ['Hunger Relief', 'Slum Healthcare', 'Youth Coding'],
    recentHighlight: 'Annapurna Seva Night Food Vans covering Kurla & Dharavi',
    verifiedRate: '98.5%',
    coordinates: { x: 38, y: 55 }
  },
  {
    id: 'ka',
    state: 'Karnataka',
    cityHub: 'Bengaluru / Mysuru / Channapatna',
    activeNgosCount: 11,
    totalFundsUtilized: '₹11.8 Lakhs',
    beneficiariesReached: '12,200+ Students',
    topSectors: ['Rural STEM', 'Lake Rejuvenation', 'Girl Education'],
    recentHighlight: 'Vidya Vikas solar digital lab launched in Channapatna High School',
    verifiedRate: '99.0%',
    coordinates: { x: 42, y: 72 }
  },
  {
    id: 'dl',
    state: 'Delhi-NCR',
    cityHub: 'New Delhi / Noida / Gurugram',
    activeNgosCount: 16,
    totalFundsUtilized: '₹19.5 Lakhs',
    beneficiariesReached: '24,100+ People',
    topSectors: ['Winter Relief', 'Air Purification', 'Education'],
    recentHighlight: 'Blanket distribution and night transit support near Old Delhi Station',
    verifiedRate: '97.8%',
    coordinates: { x: 44, y: 32 }
  },
  {
    id: 'tn',
    state: 'Tamil Nadu',
    cityHub: 'Chennai / Coimbatore / Madurai',
    activeNgosCount: 9,
    totalFundsUtilized: '₹8.6 Lakhs',
    beneficiariesReached: '9,800+ Beneficiaries',
    topSectors: ['Coastal Cleanup', 'Disaster Prep', 'Elderly Care'],
    recentHighlight: 'Marina Beach micro-plastic cleanup with 120 college volunteers',
    verifiedRate: '99.2%',
    coordinates: { x: 48, y: 82 }
  },
  {
    id: 'wb',
    state: 'West Bengal',
    cityHub: 'Kolkata / Sundarbans / Siliguri',
    activeNgosCount: 8,
    totalFundsUtilized: '₹7.3 Lakhs',
    beneficiariesReached: '8,500+ Families',
    topSectors: ['Mangrove Restoration', 'Cyclone Relief', 'Child Welfare'],
    recentHighlight: 'Sundarbans saline-tolerant seedling drive (5,000 saplings)',
    verifiedRate: '96.5%',
    coordinates: { x: 68, y: 46 }
  }
];

interface ImpactMapProps {
  onSelectRegion?: (regionId: string) => void;
  onExploreCampaigns?: () => void;
}

export default function ImpactMap({
  onSelectRegion,
  onExploreCampaigns
}: ImpactMapProps) {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('mh');

  const selected = REGIONS.find(r => r.id === selectedRegionId) || REGIONS[0];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-lg font-bold text-gray-900">National Impact Map</h3>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Regional Ledger
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time verified funding distribution and active NGO deployments across Indian states.
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100 text-xs">
          <div>
            <span className="text-gray-400 block text-[10px] font-medium uppercase">Total Disbursed</span>
            <span className="font-bold text-gray-900">₹61.4 Lakhs</span>
          </div>
          <div className="w-px h-6 bg-gray-200" />
          <div>
            <span className="text-gray-400 block text-[10px] font-medium uppercase">Direct Impact</span>
            <span className="font-bold text-emerald-600">73,000+ Reached</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Region Selector Buttons & Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Regions selector list / cards */}
        <div className="lg:col-span-5 space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
            Select State / Region
          </label>
          <div className="space-y-2">
            {REGIONS.map((region) => {
              const isActive = region.id === selectedRegionId;
              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => {
                    setSelectedRegionId(region.id);
                    if (onSelectRegion) onSelectRegion(region.id);
                  }}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                    isActive 
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-400 shadow-sm' 
                      : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      isActive ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900">{region.state}</h4>
                      <p className="text-[11px] text-gray-500">{region.cityHub}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-emerald-700 block">{region.totalFundsUtilized}</span>
                    <span className="text-[10px] text-gray-400">{region.activeNgosCount} NGOs Active</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Region Deep Dive Card */}
        <div className="lg:col-span-7 bg-gradient-to-br from-gray-50/80 via-white to-emerald-50/30 rounded-2xl border border-gray-100 p-5 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Top State Badge */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
              <div>
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Region Focus
                </span>
                <h4 className="text-xl font-bold text-gray-900 mt-0.5">{selected.state}</h4>
                <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  <span>Key Hubs: {selected.cityHub}</span>
                </p>
              </div>
              <div className="bg-emerald-100/80 text-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{selected.verifiedRate} Audit Rate</span>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Audited Spend</span>
                <span className="text-base font-extrabold text-gray-900">{selected.totalFundsUtilized}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Citizens Reached</span>
                <span className="text-base font-extrabold text-emerald-600">{selected.beneficiariesReached}</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs col-span-2 sm:col-span-1">
                <span className="text-[10px] text-gray-400 uppercase font-semibold block">Registered NGOs</span>
                <span className="text-base font-extrabold text-gray-900">{selected.activeNgosCount} On-ground</span>
              </div>
            </div>

            {/* Key Sectors */}
            <div>
              <span className="text-xs font-semibold text-gray-600 block mb-1.5">Primary Interventions:</span>
              <div className="flex flex-wrap gap-1.5">
                {selected.topSectors.map((sector, i) => (
                  <span 
                    key={i}
                    className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100"
                  >
                    {sector}
                  </span>
                ))}
              </div>
            </div>

            {/* Field Highlight */}
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wide block">
                  Ground Highlight (This Week)
                </span>
                <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                  {selected.recentHighlight}
                </p>
              </div>
            </div>

          </div>

          {/* Action CTA */}
          <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400 font-medium">
              Data verified against GPS photo timestamps and purchase receipts.
            </span>
            {onExploreCampaigns && (
              <button
                type="button"
                onClick={onExploreCampaigns}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-900 text-white font-semibold text-xs hover:bg-emerald-600 transition-colors shadow-2xs"
              >
                <span>View State Feed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
