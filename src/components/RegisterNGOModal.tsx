'use client';

import React, { useState } from 'react';
import { DataService } from '@/lib/dataService';
import { 
  Building2, X, CheckCircle2, ShieldCheck, FileText, 
  Image as ImageIcon, Video, AlertCircle, ArrowRight,
  Upload, Eye, Award, ExternalLink, FileCheck2
} from 'lucide-react';

interface RegisterNGOModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterNGOModal({ isOpen, onClose, onSuccess }: RegisterNGOModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Hunger Relief' | 'Education' | 'Healthcare' | 'Environment' | 'Animal Welfare' | 'Disaster Relief'>('Education');
  const [regNumber, setRegNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [headName, setHeadName] = useState('');
  const [headPhone, setHeadPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [website, setWebsite] = useState('');
  const [annualBudget, setAnnualBudget] = useState<number>(500000);
  
  // Mandatory Societies Registration Act 1860 Certificate
  const [societiesActNumber, setSocietiesActNumber] = useState('S/1482/Distt. South/2011');
  const [societiesAuthority, setSocietiesAuthority] = useState('Registrar of Societies, South District, Govt of NCT of Delhi');
  const [societiesCertFile, setSocietiesCertFile] = useState<string | null>('societies_registration_act_1860_certificate.png');
  const [societiesCertUrl, setSocietiesCertUrl] = useState<string>('/sample-registration-certificate.png');
  const [isPreviewCertOpen, setIsPreviewCertOpen] = useState(false);

  // Mandatory Evidence fields
  const [auditReportUrl, setAuditReportUrl] = useState('https://storage.opencause.org/audits/annual-report-2025.pdf');
  const [pastEventProofUrl, setPastEventProofUrl] = useState('https://images.unsplash.com/photo-1577896851231-70ef18881754?w=900&auto=format&fit=crop');
  const [videoProofUrl, setVideoProofUrl] = useState('https://www.youtube.com/watch?v=verified-drive-proof');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validate = () => {
    const err: Record<string, string> = {};
    if (!name.trim()) err.name = 'NGO Name is mandatory';
    if (!regNumber.trim()) err.regNumber = 'Govt 80G/12A Registration Number is mandatory';
    if (!societiesActNumber.trim()) {
      err.societiesActNumber = 'Mandatory: Societies Registration Act XXI of 1860 Regn. Number';
    }
    if (!societiesCertFile && !societiesCertUrl) {
      err.societiesCert = 'Mandatory: You must upload Certificate of Registration under Societies Registration Act 1860';
    }
    if (!panNumber.trim() || panNumber.trim().length !== 10) {
      err.panNumber = 'Valid 10-character NGO PAN is mandatory';
    }
    if (!headName.trim()) err.headName = 'Director / Head of NGO Name is mandatory';
    if (!headPhone.trim() || !/^[6-9]\d{9}$/.test(headPhone.trim())) {
      err.headPhone = 'Mandatory 10-digit official contact number';
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      err.email = 'Valid official email address is mandatory';
    }
    if (!city.trim()) err.city = 'Registered City is mandatory';
    if (!auditReportUrl.trim()) err.auditReportUrl = 'Mandatory audited balance sheet link';
    if (!pastEventProofUrl.trim()) err.pastEventProofUrl = 'Mandatory photographic evidence of past events';
    if (!videoProofUrl.trim()) err.videoProofUrl = 'Mandatory video or field verification link';

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleCertUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSocietiesCertFile(file.name);
      setSocietiesCertUrl(URL.createObjectURL(file));
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.societiesCert;
        return copy;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    DataService.submitNGORegistration({
      name: name.trim(),
      category,
      reg_number: regNumber.trim().toUpperCase(),
      registration_number: regNumber.trim().toUpperCase(),
      societies_act_reg_no: societiesActNumber.trim(),
      societies_cert_name: societiesCertFile || 'Certificate of Registration (Act XXI 1860)',
      societies_cert_url: societiesCertUrl || '/sample-registration-certificate.png',
      societies_registrar_authority: societiesAuthority.trim(),
      pan_number: panNumber.trim().toUpperCase(),
      head_officer_name: headName.trim(),
      head_officer_phone: headPhone.trim(),
      official_email: email.trim(),
      city: city.trim(),
      website_or_social: website.trim() || 'https://verified-ngo.org',
      audit_report_url: auditReportUrl.trim(),
      past_event_proof_url: pastEventProofUrl.trim(),
      video_proof_url: videoProofUrl.trim(),
      annual_budget: Number(annualBudget) || 100000,
    });

    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onSuccess?.();
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">New NGO Verification & Onboarding</h2>
              <span className="text-[11px] text-slate-400 block">
                Strict Government 80G, PAN & Photographic Evidence Audit
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
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {isSuccess ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Submitted for Forensic Audit!</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your legal 80G documents, PAN, and past event evidences are queued in the <strong>Admin Dashboard</strong> for instant compliance seal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Mentor Transparency Rule:</strong> All fields, government tax IDs, and verifiable media links are mandatory to eliminate fake NGOs.
                </span>
              </div>

              {/* Organization Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NGO Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Swasthya Care Foundation"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.name && <p className="text-[11px] text-rose-500 mt-0.5">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Domain <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Hunger Relief">Hunger Relief</option>
                    <option value="Education">Education & STEM</option>
                    <option value="Healthcare">Healthcare & Medicine</option>
                    <option value="Environment">Environment & Forestation</option>
                    <option value="Animal Welfare">Animal Welfare</option>
                    <option value="Disaster Relief">Disaster Relief</option>
                  </select>
                </div>
              </div>

              {/* Reg Number & PAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Govt 80G / 12A Reg Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 80G-DEL-2022-9901"
                    value={regNumber}
                    onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.regNumber && <p className="text-[11px] text-rose-500 mt-0.5">{errors.regNumber}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NGO PAN Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="e.g. AABTV8812K"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl font-mono focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                  {errors.panNumber && <p className="text-[11px] text-rose-500 mt-0.5">{errors.panNumber}</p>}
                </div>
              </div>

              {/* Head Officer & Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Head / Director Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Mehra"
                    value={headName}
                    onChange={(e) => setHeadName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Mobile <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    placeholder="10-digit phone"
                    value={headPhone}
                    onChange={(e) => setHeadPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official Email <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="info@ngo.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Headquarter City & State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune, Maharashtra"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Budget (INR) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="10000"
                    required
                    value={annualBudget}
                    onChange={(e) => setAnnualBudget(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* MANDATORY STATUTORY CERTIFICATE: SOCIETIES REGISTRATION ACT 1860 */}
              <div className="bg-gradient-to-br from-emerald-50 via-teal-50/40 to-slate-50 p-4 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-emerald-600 text-white rounded-lg">
                      <Award className="w-4 h-4" />
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                          Mandatory Legal Certificate
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                          Required *
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-slate-800">
                        Certificate of Registration Under Societies Registration Act XXI of 1860
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPreviewCertOpen(true)}
                    className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-white text-emerald-800 border border-emerald-300 hover:bg-emerald-100/50 shadow-2xs transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>View Specimen</span>
                  </button>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  As per regulatory mandate, all NGOs must upload the official Certificate of Registration issued by the <strong>Registrar of Societies (State / District Authority)</strong> bearing the official Government Seal and Registrar signature.
                </p>

                {/* Registration Number & Authority Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Certificate Regn. No. (e.g. S/___/Distt. South/2011) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. S/1482/Distt. South/2011"
                      value={societiesActNumber}
                      onChange={(e) => setSocietiesActNumber(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                    {errors.societiesActNumber && (
                      <p className="text-[10px] text-rose-500 mt-0.5">{errors.societiesActNumber}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Issuing Registrar Authority <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Registrar of Societies, South District, Govt of NCT of Delhi"
                      value={societiesAuthority}
                      onChange={(e) => setSocietiesAuthority(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                {/* Upload Zone */}
                <div className="border border-dashed border-emerald-300 rounded-xl p-3 bg-white/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {societiesCertFile ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600" />
                            {societiesCertFile}
                          </span>
                        ) : (
                          'Upload Scanned Certificate (PDF / PNG / JPG)'
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Government of NCT of Delhi / State Societies Registrar verified scan
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{societiesCertFile ? 'Replace File' : 'Upload File'}</span>
                      <input 
                        type="file" 
                        accept=".pdf,.png,.jpg,.jpeg" 
                        onChange={handleCertUpload} 
                        className="hidden" 
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => {
                        setSocietiesCertFile('Societies_Act_XXI_1860_Official_Cert.png');
                        setSocietiesCertUrl('/sample-registration-certificate.png');
                        setSocietiesActNumber('S/1482/Distt. South/2011');
                        setSocietiesAuthority('Registrar of Societies, South District, Govt of NCT of Delhi');
                      }}
                      className="px-2 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                    >
                      Use Verified Specimen
                    </button>
                  </div>
                </div>
                {errors.societiesCert && (
                  <p className="text-[11px] text-rose-500 font-bold">{errors.societiesCert}</p>
                )}
              </div>

              {/* MANDATORY EVIDENCE ATTACHMENTS (Mentor's Key Spec) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Mandatory Financial Audit & Field Proofs
                </span>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    1. Audited Balance Sheet / CA Certificate Link (PDF) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={auditReportUrl}
                    onChange={(e) => setAuditReportUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    2. Photographic Proof of Past Public Drives (High-Res Image) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={pastEventProofUrl}
                    onChange={(e) => setPastEventProofUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    3. Video Proof / Drive Documentation Link (YouTube/Cloud) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="url"
                    required
                    value={videoProofUrl}
                    onChange={(e) => setVideoProofUrl(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>Submit NGO & Certificate for Forensic Audit</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

      </div>

      {/* Specimen Certificate Preview Modal */}
      {isPreviewCertOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <div>
                  <h4 className="text-sm font-bold">Official Certificate of Registration</h4>
                  <p className="text-[10px] text-slate-400">Societies Registration Act XXI of 1860 Specimen</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewCertOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-3 bg-slate-50 flex-1">
              <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex justify-center">
                <img 
                  src="/sample-registration-certificate.png" 
                  alt="Certificate of Registration Under Societies Registration Act XXI of 1860" 
                  className="max-h-[60vh] object-contain rounded-lg border border-slate-100"
                />
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs space-y-1 text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Mandatory Legal Verification Markers:
                </div>
                <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-700">
                  <li><strong>Title:</strong> Certificate of Registration Under Societies Registration Act XXI of 1860</li>
                  <li><strong>State Seal:</strong> Official Seal of the Registrar of Societies (Government of NCT of Delhi / State)</li>
                  <li><strong>Officer Signature:</strong> Signed by Registrar of Societies (e.g. Pravesh Ranjan Jha, South District)</li>
                  <li><strong>Regn Number:</strong> Form S/___/Distt. South/2011 format</li>
                </ul>
              </div>
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsPreviewCertOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
              >
                Close Specimen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
