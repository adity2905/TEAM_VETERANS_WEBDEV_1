'use client';

import React, { useState } from 'react';
import { NGO, Post } from '@/types';
import { DataService } from '@/lib/dataService';
import { 
  X, PlusCircle, Image as ImageIcon, Sparkles, ShieldCheck, 
  MapPin, Users, Video, DollarSign, FileText, AlertCircle, ArrowRight 
} from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  ngos: NGO[];
  onPostCreated?: () => void;
}

const SAMPLE_IMAGES = [
  { label: 'Food Aid', url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=900&auto=format&fit=crop' },
  { label: 'STEM Classroom', url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&auto=format&fit=crop' },
  { label: 'Tree Planting', url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=900&auto=format&fit=crop' },
  { label: 'Animal Care', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=900&auto=format&fit=crop' },
];

export default function CreatePostModal({
  isOpen,
  onClose,
  ngos,
  onPostCreated,
}: CreatePostModalProps) {
  const [ngoId, setNgoId] = useState(ngos[0]?.id || 'ngo-1');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [activityType, setActivityType] = useState<'past_impact' | 'upcoming_event' | 'story'>('past_impact');
  const [location, setLocation] = useState('Channapatna High School, Karnataka');
  const [gpsCoordinates, setGpsCoordinates] = useState('12.6518° N, 77.2089° E');
  const [peopleReached, setPeopleReached] = useState<number>(65);
  const [metricsLabel, setMetricsLabel] = useState('Students Trained in Coding');
  
  // Mandatory Evidence inputs (Mentor's requirements)
  const [mediaUrl, setMediaUrl] = useState(SAMPLE_IMAGES[1].url);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=field-documentation');
  const [beneficiaryInput, setBeneficiaryInput] = useState('Anjali Gowda (Grade 8), Kavita Rao (Grade 9), Deepa Naik (Grade 7)');
  const [volunteerInput, setVolunteerInput] = useState('Karthik Sharma, Meera Nambiar, Suresh Patil');
  
  // Budget breakdown (Mentor's "₹75,000" requirement)
  const [allocatedBudget, setAllocatedBudget] = useState<number>(75000);
  const [spentAmount, setSpentAmount] = useState<number>(74400);
  const [auditorNote, setAuditorNote] = useState('Audited by Chartered Accountants M/s Ramanathan & Co. with verified vendor bills.');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!title.trim()) err.title = 'Event title is mandatory';
    if (!content.trim() || content.trim().length < 20) {
      err.content = 'Detailed narrative must be at least 20 characters';
    }
    if (!location.trim()) err.location = 'Physical location is mandatory';
    if (!mediaUrl.trim()) err.mediaUrl = 'Photographic evidence is mandatory';
    if (!videoUrl.trim()) err.videoUrl = 'Video / drive documentation link is mandatory';
    if (!beneficiaryInput.trim()) err.beneficiaryInput = 'Beneficiary log of people engaged is mandatory';
    if (!volunteerInput.trim()) err.volunteerInput = 'Volunteer roster is mandatory';
    if (!spentAmount || spentAmount <= 0) err.spentAmount = 'Valid expenditure amount is mandatory';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const beneficiaries = beneficiaryInput.split(',').map((name, i) => ({
        id: `ben-${Date.now()}-${i}`,
        name: name.trim(),
        age_or_grade: 'Audited Beneficiary',
        benefit_received: metricsLabel,
        verification_status: 'Audited' as const,
      }));

      const volunteers = volunteerInput.split(',').map((v) => v.trim()).filter(Boolean);

      await DataService.createPost({
        ngo_id: ngoId,
        title,
        content,
        activity_type: activityType,
        location,
        gps_coordinates: gpsCoordinates,
        people_reached: Number(peopleReached) || 0,
        metrics_label: metricsLabel,
        media_url: mediaUrl,
        video_url: videoUrl,
        volunteers_attended: volunteers,
        beneficiary_records: beneficiaries,
        budget_report: {
          total_budget_allocated: Number(allocatedBudget),
          total_spent: Number(spentAmount),
          unspent_balance: Math.max(0, Number(allocatedBudget) - Number(spentAmount)),
          financial_auditor_note: auditorNote,
          expenses: [
            {
              id: `exp-${Date.now()}-1`,
              category: 'Direct Beneficiary Supplies',
              description: `Procurement & distribution for ${peopleReached} ${metricsLabel}`,
              vendor_name: 'Verified Vendor Mandi',
              invoice_no: `INV-MND-${Math.floor(1000 + Math.random() * 9000)}`,
              amount_spent: Number(spentAmount),
              verified_by_auditor: true,
            },
          ],
        },
        event_date: new Date().toISOString().split('T')[0],
      });

      onPostCreated?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-base font-bold">Publish Verified Event & Evidence Dossier</h2>
              <span className="text-[11px] text-slate-400 block">
                Mandatory Photographic Proof, Beneficiary Records & Budget Ledger
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          
          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Mentor Compliance Note:</strong> Every post must attach auditable proof (photos, videos, beneficiary rosters, and actual rupee expense allocations) to prevent fraudulent claims.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Posting as Verified NGO <span className="text-rose-500">*</span>
              </label>
              <select
                value={ngoId}
                onChange={(e) => setNgoId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {ngos.map((ngo) => (
                  <option key={ngo.id} value={ngo.id}>
                    {ngo.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Activity Type <span className="text-rose-500">*</span>
              </label>
              <select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
              >
                <option value="past_impact">Verified Past Impact (With Evidence)</option>
                <option value="upcoming_event">Upcoming Community Event</option>
                <option value="story">Beneficiary Case Story</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Event Headline <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Free Eye Cataract Screening Camp for 350 Rural Elders"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-semibold"
            />
            {errors.title && <p className="text-[11px] text-rose-500 mt-0.5">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Impact Narrative & Execution Details <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain how the drive was conducted, what services were provided, and the measurable community outcome..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
            />
            {errors.content && <p className="text-[11px] text-rose-500 mt-0.5">{errors.content}</p>}
          </div>

          {/* Location & GPS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Event Location <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                GPS Geo-Coordinates <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={gpsCoordinates}
                onChange={(e) => setGpsCoordinates(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Numbers Reached */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Number of Beneficiaries <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                required
                value={peopleReached}
                onChange={(e) => setPeopleReached(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Audited Metric Label <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={metricsLabel}
                onChange={(e) => setMetricsLabel(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* MENTOR REQUIREMENT: BENEFICIARIES & VOLUNTEERS ROSTER */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Audited Beneficiaries & Volunteer Logs
            </span>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Beneficiary Names / Student Roster (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={beneficiaryInput}
                onChange={(e) => setBeneficiaryInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              {errors.beneficiaryInput && <p className="text-[11px] text-rose-500 mt-0.5">{errors.beneficiaryInput}</p>}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Volunteer Attendance Log (Comma separated) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={volunteerInput}
                onChange={(e) => setVolunteerInput(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
              {errors.volunteerInput && <p className="text-[11px] text-rose-500 mt-0.5">{errors.volunteerInput}</p>}
            </div>
          </div>

          {/* MENTOR REQUIREMENT: FINANCIAL BUDGET UTILIZATION TABLE */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              2. Financial Budget & Rupee Utilization Ledger
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Budget Allocated (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={allocatedBudget}
                  onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Verified Total Spent (INR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={spentAmount}
                  onChange={(e) => setSpentAmount(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Chartered Accountant / Auditor Note
              </label>
              <input
                type="text"
                value={auditorNote}
                onChange={(e) => setAuditorNote(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Mandatory Photo & Video Links */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Photographic Proof URL <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl mb-1.5 font-mono focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500">Demo Presets:</span>
                {SAMPLE_IMAGES.map((img) => (
                  <button
                    key={img.label}
                    type="button"
                    onClick={() => setMediaUrl(img.url)}
                    className={`text-[11px] px-2.5 py-0.5 rounded-full border transition-all ${
                      mediaUrl === img.url
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Video Documentation / Field Link <span className="text-rose-500">*</span>
              </label>
              <input
                type="url"
                required
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors text-xs sm:text-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Verifying Dossier...' : 'Publish Audited Activity with Evidence'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
