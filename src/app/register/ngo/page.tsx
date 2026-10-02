'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  FileText, 
  ShieldCheck, 
  Users, 
  MapPin, 
  CheckCircle2, 
  Upload, 
  Trash2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Loader2, 
  Sparkles,
  Lock,
  Heart
} from 'lucide-react';
import { DataService } from '@/lib/dataService';

const CAUSE_OPTIONS = [
  'Healthcare',
  'Education',
  'Food',
  'Women Empowerment',
  'Child Welfare',
  'Environment',
  'Rural Development',
  'Employment',
  'Disaster Relief',
  'Agriculture',
  'Other',
];

export default function NGORegistrationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;

  // Step 1: Organization Details
  const [orgName, setOrgName] = useState('Vishwakarma Services Foundation');
  const [orgType, setOrgType] = useState<'Trust' | 'Society' | 'Section 8 Company' | 'NGO' | 'Other'>('Trust');
  const [email, setEmail] = useState('contact@vishwakarma-foundation.org');
  const [mobile, setMobile] = useState('+91 98220 54321');
  const [website, setWebsite] = useState('https://vishwakarma-foundation.org');
  const [officialAddress, setOfficialAddress] = useState('Survey No. 42, Shivajinagar');
  const [state, setState] = useState('Maharashtra');
  const [district, setDistrict] = useState('Pune');
  const [city, setCity] = useState('Pune');
  const [pinCode, setPinCode] = useState('411005');

  // Step 2: Registration Details
  const [regNumber, setRegNumber] = useState('MAH-PUN-2017-8821');
  const [regDate, setRegDate] = useState('2017-08-15');
  const [renewalStatus, setRenewalStatus] = useState<'Active' | 'Renewal Due' | 'Expired' | 'Not Applicable'>('Active');
  const [lastRenewalDate, setLastRenewalDate] = useState('2025-08-15');
  const [regAuthority, setRegAuthority] = useState('Charity Commissioner, Pune');

  // Step 3: Tax / Identity Details
  const [panNumber, setPanNumber] = useState('AAATV1234F');
  const [incorporationDate, setIncorporationDate] = useState('2017-08-15');
  const [uploadedDocs, setUploadedDocs] = useState<Array<{ name: string; size: string; progress: number }>>([
    { name: 'Trust_Deed_Registration_MAH.pdf', size: '2.4 MB', progress: 100 },
    { name: 'Organization_PAN_Card.pdf', size: '850 KB', progress: 100 },
  ]);

  // Step 4: Organization Structure
  const [officeBearersCount, setOfficeBearersCount] = useState<number>(5);
  const [officeBearers, setOfficeBearers] = useState<Array<{ name: string; designation: string }>>([
    { name: 'Dr. Ramesh Vishwakarma', designation: 'President' },
    { name: 'Smt. Sunita Patil', designation: 'Secretary' },
    { name: 'Shri. Anand Deshmukh', designation: 'Treasurer' },
  ]);

  // Step 5: Location
  const [latitude, setLatitude] = useState('18.5204');
  const [longitude, setLongitude] = useState('73.8567');

  // Step 6: Causes
  const [selectedCauses, setSelectedCauses] = useState<string[]>([
    'Education',
    'Healthcare',
    'Rural Development',
  ]);

  // Step 7: Consent & Human Verification
  const [consentAccurate, setConsentAccurate] = useState(true);
  const [consentTerms, setConsentTerms] = useState(true);
  const [consentNotGovt, setConsentNotGovt] = useState(true);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState('');

  // OTP Verification Stage
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otpCode, setOtpCode] = useState(['1', '2', '3', '4', '5', '6']);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleCause = (cause: string) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter((c) => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const handleDocUploadSimulated = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedDocs((prev) => [
        ...prev,
        {
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          progress: 100,
        },
      ]);
    }
  };

  const removeDoc = (index: number) => {
    setUploadedDocs(uploadedDocs.filter((_, i) => i !== index));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 7 Validation
      if (captchaAnswer.trim() !== '11') {
        setCaptchaError('Incorrect answer. (7 + 4 = 11)');
        return;
      }
      setCaptchaError('');
      setIsOtpStage(true);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      await DataService.registerNGO({
        organization_name: orgName,
        organization_type: orgType,
        email,
        mobile,
        website,
        official_address: officialAddress,
        state,
        district,
        city,
        pin_code: pinCode,
        registration_number: regNumber,
        registration_date: regDate,
        renewal_status: renewalStatus,
        last_renewal_date: lastRenewalDate,
        registration_authority: regAuthority,
        pan_number: panNumber,
        pan_incorporation_date: incorporationDate,
        office_bearers_count: officeBearersCount,
        office_bearers: officeBearers,
        latitude: Number(latitude) || 18.5204,
        longitude: Number(longitude) || 73.8567,
        causes: selectedCauses,
      });

      setIsSubmittedSuccess(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Top Branding */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <span className="text-xl font-black text-slate-900">
              Open<span className="text-emerald-600">Cause</span>
            </span>
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs"
          >
            Already Registered? Sign In
          </Link>
        </div>

        {/* Stepper Header */}
        {!isSubmittedSuccess && !isOtpStage && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                NGO Onboarding • Step {currentStep} of {totalSteps}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {Math.round((currentStep / totalSteps) * 100)}% Complete
              </span>
            </div>
            
            {/* Stepper Progress Bar */}
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* SUCCESS CARD */}
        {isSubmittedSuccess ? (
          <div className="mt-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-5 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Verification Status: PENDING REVIEW
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-3">
                Registration Submitted Successfully
              </h2>
              <p className="text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
                Thank you, <strong>{orgName}</strong>. Your submitted details and certificates have been received. An administrative verifier will review your registration within 24-48 business hours.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-600 max-w-md mx-auto text-left space-y-1.5">
              <div><strong>Registration No:</strong> {regNumber}</div>
              <div><strong>Authority:</strong> {regAuthority}</div>
              <div><strong>Location:</strong> {city}, {state}</div>
              <div><strong>Audit Label:</strong> Will receive "Platform Verified" tag upon approval</div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm"
              >
                Go to NGO Partner Dashboard →
              </Link>
              <Link
                href="/"
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                Back to Public Feed
              </Link>
            </div>
          </div>
        ) : isOtpStage ? (
          /* OTP VERIFICATION STAGE */
          <div className="mt-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Verify Authorized Mobile OTP
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter the 6-digit confirmation code for <strong>{mobile}</strong>
              </p>
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                Demo OTP Verification: Enter 1 2 3 4 5 6 or any 6 digits
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {otpCode.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const next = [...otpCode];
                    next[i] = e.target.value;
                    setOtpCode(next);
                  }}
                  className="w-12 h-12 text-center text-lg font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full max-w-sm mx-auto py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <span>Confirm & Submit for Review →</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsOtpStage(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-semibold block mx-auto"
            >
              ← Edit Registration Details
            </button>
          </div>
        ) : (
          /* STEPPER FORM */
          <form onSubmit={handleNextStep} className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
            
            {/* STEP 1: ORGANIZATION DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 1 — Organization Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Basic identification of your social welfare entity
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Organization Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vishwakarma Services Foundation"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization Type
                    </label>
                    <select
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Trust">Trust</option>
                      <option value="Society">Society</option>
                      <option value="Section 8 Company">Section 8 Company</option>
                      <option value="NGO">NGO</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Official Website (Optional)
                    </label>
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Official Registered Address
                  </label>
                  <input
                    type="text"
                    required
                    value={officialAddress}
                    onChange={(e) => setOfficialAddress(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      required
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: REGISTRATION DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 2 — Legal Registration Details</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official registration certificate details submitted for compliance review
                  </p>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Transparency Notice:</strong> Submission of registration details does not automatically grant legal verification. Details will be tagged as "Platform Reviewed" only after administrator inspection.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      required
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      placeholder="e.g. MAH-PUN-2017-8821"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Registration Date
                    </label>
                    <input
                      type="date"
                      required
                      value={regDate}
                      onChange={(e) => setRegDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Renewal Status
                    </label>
                    <select
                      value={renewalStatus}
                      onChange={(e) => setRenewalStatus(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Active">Active</option>
                      <option value="Renewal Due">Renewal Due</option>
                      <option value="Expired">Expired</option>
                      <option value="Not Applicable">Not Applicable</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Last Renewal Date
                    </label>
                    <input
                      type="date"
                      value={lastRenewalDate}
                      onChange={(e) => setLastRenewalDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Registration Authority
                  </label>
                  <input
                    type="text"
                    required
                    value={regAuthority}
                    onChange={(e) => setRegAuthority(e.target.value)}
                    placeholder="e.g. Charity Commissioner / Registrar of Societies"
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: TAX & IDENTITY DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 3 — Tax & Identity Documents</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    PAN card and official deed uploads for identity assurance
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Strict Privacy Guarantee:</strong> Uploaded identity and PAN documents are stored with internal access control and are <strong>NEVER displayed publicly</strong> on NGO profiles.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Organization PAN Number
                    </label>
                    <input
                      type="text"
                      required
                      value={panNumber}
                      onChange={(e) => setPanNumber(e.target.value)}
                      placeholder="AAATV1234F"
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Incorporation Date
                    </label>
                    <input
                      type="date"
                      value={incorporationDate}
                      onChange={(e) => setIncorporationDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Upload Documents Card */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Upload Certificates (Registration Cert / PAN / Trust Deed)
                  </label>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors bg-slate-50/50">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-700">Upload PDF or Scanned Certificate</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Max size 10MB per document</p>
                    <label className="mt-3 inline-block px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer">
                      <span>Choose File</span>
                      <input type="file" onChange={handleDocUploadSimulated} className="hidden" />
                    </label>
                  </div>

                  {/* Uploaded Documents List */}
                  {uploadedDocs.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedDocs.map((doc, idx) => (
                        <div key={idx} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between text-xs shadow-2xs">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <div>
                              <span className="font-semibold text-slate-800 block">{doc.name}</span>
                              <span className="text-[10px] text-slate-400">{doc.size} • 100% Uploaded (Encrypted)</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeDoc(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: ORGANIZATION STRUCTURE */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 4 — Governance & Office Bearers</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Key executive trustees and office bearers responsible for oversight
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Total Number of Office Bearers & Members
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={officeBearersCount}
                    onChange={(e) => setOfficeBearersCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-slate-600 block">Office Bearer Details:</span>
                  {officeBearers.map((bearer, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Name</label>
                        <input
                          type="text"
                          value={bearer.name}
                          onChange={(e) => {
                            const updated = [...officeBearers];
                            updated[idx].name = e.target.value;
                            setOfficeBearers(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-slate-500 mb-1">Designation</label>
                        <input
                          type="text"
                          value={bearer.designation}
                          onChange={(e) => {
                            const updated = [...officeBearers];
                            updated[idx].designation = e.target.value;
                            setOfficeBearers(updated);
                          }}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: LOCATION */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 5 — Geographic Coordinates</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Location for state mapping and regional impact clustering
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      disabled
                      value={state}
                      className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                    <input
                      type="text"
                      disabled
                      value={`${city}, ${district}`}
                      className="w-full px-3 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl text-slate-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Latitude</label>
                    <input
                      type="text"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Longitude</label>
                    <input
                      type="text"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: CAUSES */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 6 — Operational Causes</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the community focus areas to power search filters and discovery
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CAUSE_OPTIONS.map((cause) => {
                    const isSelected = selectedCauses.includes(cause);
                    return (
                      <button
                        key={cause}
                        type="button"
                        onClick={() => toggleCause(cause)}
                        className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{cause}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: CONSENT & DEMO CAPTCHA */}
            {currentStep === 7 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Step 7 — Declarations & Human Verification</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Confirm accuracy and verify human submission
                  </p>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentAccurate}
                      onChange={(e) => setConsentAccurate(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>I confirm that the information provided is accurate to the best of my knowledge.</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentTerms}
                      onChange={(e) => setConsentTerms(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>I agree to the platform's transparency policy and terms of service.</span>
                  </label>

                  <label className="flex items-start gap-3 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentNotGovt}
                      onChange={(e) => setConsentNotGovt(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                    />
                    <span>I understand that submitting information does not automatically mean that the NGO is officially verified.</span>
                  </label>
                </div>

                {/* Demo Human Verification (CAPTCHA) */}
                <div className="p-4 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">Demo Human Verification (CAPTCHA)</span>
                    <span className="text-[10px] text-slate-400">Math challenge</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-slate-100 rounded-xl font-black text-sm text-slate-800 tracking-wider">
                      What is 7 + 4 ?
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Answer"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-24 px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {captchaError && (
                    <p className="text-xs text-rose-600 font-semibold">{captchaError}</p>
                  )}
                </div>
              </div>
            )}

            {/* Stepper Footer Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>
              ) : <div />}

              <button
                type="submit"
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>{currentStep === totalSteps ? 'Proceed to OTP Verification →' : 'Continue'}</span>
                {currentStep < totalSteps && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
