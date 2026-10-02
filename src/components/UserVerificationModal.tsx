'use client';

import React, { useState } from 'react';
import { UserVerification } from '@/types';
import { DataService } from '@/lib/dataService';
import { ShieldCheck, X, CheckCircle2, User, Phone, Mail, MapPin, FileCheck, ArrowRight } from 'lucide-react';

interface UserVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete?: (user: UserVerification) => void;
  title?: string;
  subtitle?: string;
}

export default function UserVerificationModal({
  isOpen,
  onClose,
  onVerificationComplete,
  title = 'Mandatory Citizen / Donor Verification',
  subtitle = 'To maintain 100% transparency and combat fraudulent activity, please register your verified credentials.',
}: UserVerificationModalProps) {
  const [fullName, setFullName] = useState('');
  const [idType, setIdType] = useState<UserVerification['id_type']>('Aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 3) {
      err.fullName = 'Full Name is mandatory (min 3 letters)';
    }
    if (!idNumber.trim() || idNumber.trim().length < 4) {
      err.idNumber = `Valid ${idType} number is mandatory`;
    }
    if (!phone.trim() || !/^[6-9]\d{9}$/.test(phone.trim())) {
      err.phone = 'Mandatory 10-digit valid Indian mobile number';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      err.email = 'Valid email is mandatory for 80G receipt delivery';
    }
    if (!city.trim()) {
      err.city = 'City / Location is mandatory';
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const user = DataService.saveUserVerification({
      full_name: fullName.trim(),
      id_type: idType,
      id_number: idNumber.trim(),
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim(),
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onVerificationComplete?.(user);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold leading-tight">{title}</h2>
              <span className="text-[11px] text-emerald-400 font-semibold block">
                Govt Compliance & KYC Security
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
            {subtitle}
          </p>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Verification Verified!</h3>
              <p className="text-xs text-slate-500">Your KYC pass is active. You may now proceed with 1-click giving and volunteering.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Legal Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="As printed on government identity card"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.fullName ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-0.5">{errors.fullName}</p>}
              </div>

              {/* ID Proof Type & ID Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Identity Document <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={idType}
                    onChange={(e) => setIdType(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Aadhaar">Aadhaar Card</option>
                    <option value="PAN">PAN Card</option>
                    <option value="Voter ID">Voter ID</option>
                    <option value="College ID">College / University ID</option>
                    <option value="Passport">Passport</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {idType} Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={idType === 'Aadhaar' ? 'XXXX-XXXX-XXXX' : 'e.g. ABCDE1234F'}
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value.toUpperCase())}
                    className={`w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono ${
                      errors.idNumber ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                  {errors.idNumber && <p className="text-[11px] text-rose-500 mt-0.5">{errors.idNumber}</p>}
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Phone <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.phone ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-0.5">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                        errors.email ? 'border-rose-400' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-[11px] text-rose-500 mt-0.5">{errors.email}</p>}
                </div>
              </div>

              {/* City / State */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City & State <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={`w-full pl-9 pr-3.5 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      errors.city ? 'border-rose-400' : 'border-slate-200'
                    }`}
                  />
                </div>
                {errors.city && <p className="text-[11px] text-rose-500 mt-0.5">{errors.city}</p>}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Verify Credentials & Authorize Pass</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
