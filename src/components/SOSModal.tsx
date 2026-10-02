'use client';

import React, { useState } from 'react';
import { 
  X, AlertTriangle, MapPin, Phone, ShieldAlert, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SOSModal({ isOpen, onClose }: SOSModalProps) {
  const [emergencyType, setEmergencyType] = useState('Medical Emergency');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location.trim() || !phone.trim()) return;
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setLocation('');
    setPhone('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rose-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-200 transition-all">
        
        {/* Header */}
        <div className="bg-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white animate-pulse">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base leading-snug">Emergency / SOS Triage</h3>
                <span className="bg-black/30 text-[10px] uppercase font-bold px-1.5 py-0.2 rounded">Prototype</span>
              </div>
              <p className="text-[11px] text-rose-100">Regional Volunteer Rapid Response Trigger</p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="text-rose-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vital Safety Disclaimer */}
        <div className="bg-amber-50 border-b border-amber-200 p-3 text-xs text-amber-900 flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Important Safety Notice:</strong> This platform connects with NGO volunteer squads and <em>does not replace government emergency services</em>. For critical life-threatening emergencies, dial <strong>112 (National Emergency)</strong> or <strong>108 (Ambulance)</strong> immediately.
          </div>
        </div>

        {isSubmitted ? (
          <div className="p-6 space-y-4 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">SOS Signal Logged to Regional Triage</h4>
            <p className="text-xs text-slate-600">
              Nearby NGO volunteers within 10km radius have received your distress signal. Stay on the line at <strong>{phone}</strong>.
            </p>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
              SOS Ref: SOS-IND-{Math.floor(10000 + Math.random() * 90000)} • Time: {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={handleReset}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
            >
              Close Triage
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Emergency Category</label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
              >
                <option value="Medical Emergency">Medical Emergency / Ambulance needed</option>
                <option value="Severe Accident">Accident / Roadside assistance</option>
                <option value="Flood / Disaster Relief">Flood / Storm / Natural Disaster trap</option>
                <option value="Animal Trauma Rescue">Injured / Distressed Street Animal</option>
                <option value="Immediate Hunger / Shelter">Homeless child / elderly in distress</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Location (GPS / Area) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Near Dadar Station West"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Emergency Phone <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 99999 00000"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Brief Description of Emergency
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is happening right now? How many people are injured or in danger?"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition"
            >
              <span>Transmit SOS Signal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
