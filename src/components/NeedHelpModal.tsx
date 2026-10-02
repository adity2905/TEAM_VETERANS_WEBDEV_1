'use client';

import React, { useState } from 'react';
import { 
  X, HelpCircle, MapPin, Phone, User, CheckCircle2, AlertCircle, ArrowRight, Loader2, HeartHandshake 
} from 'lucide-react';

interface NeedHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HELP_CATEGORIES = [
  'Food & Ration',
  'Medical & Medicines',
  'Clean Water Supply',
  'Children Education Aid',
  'Temporary Shelter',
  'Animal Emergency',
  'Elderly Care',
  'Other'
];

export default function NeedHelpModal({ isOpen, onClose }: NeedHelpModalProps) {
  const [category, setCategory] = useState(HELP_CATEGORIES[0]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !phone.trim()) return;

    const newTicket = `HELP-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newTicket);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setPhone('');
    setLocation('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 transition-all">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-500/30">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-snug">Request Community Assistance</h3>
              <p className="text-[11px] text-teal-200">
                Direct Two-Way Help Link: People ➔ Verified Non-Profits
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          // Success & Status Pipeline view
          <div className="p-6 space-y-5">
            <div className="text-center py-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Help Request Logged!</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Ticket Reference: <strong className="font-mono text-emerald-700">{ticketId}</strong>
              </p>
            </div>

            {/* Status Pipeline */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Triage Status</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>1. Request Submitted to Regional Dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-slate-700 font-medium pl-6 border-l-2 border-emerald-500">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span>2. Matching with Annapurna Seva & Regional Volunteers</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-normal pl-6 border-l-2 border-slate-200">
                  <span>3. Field Volunteer Assigned for Verification</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-normal pl-6 border-l-2 border-slate-200">
                  <span>4. Direct Ground Assistance Delivered</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 space-y-1">
              <strong className="block font-semibold">What happens next?</strong>
              <p className="text-[11px] leading-relaxed">
                A verified volunteer or partner NGO coordinator in your city will call <strong>{phone}</strong> to confirm exact location and mobilize relief supplies.
              </p>
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
            >
              Done
            </button>
          </div>
        ) : (
          // Form View
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                What help is needed?
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                {HELP_CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Contact Person Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Location (City, Area, or Landmark) <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Dharavi Railway Bridge, Mumbai"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Please describe the situation <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell us what assistance is required, how many people are affected, and any urgency..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-[11px] text-slate-500">
              ℹ️ Prototype assistance workflow: Requests are shared directly with verified partner NGO teams in the relevant district.
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition"
            >
              <span>Submit Help Request</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>
        )}

      </div>
    </div>
  );
}
