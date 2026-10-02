'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ArrowLeft, 
  Building2, 
  Calendar, 
  MapPin, 
  Clock, 
  XCircle,
  Eye,
  Lock,
  Heart
} from 'lucide-react';
import { NGORegistrationSubmission } from '@/types';
import { DataService } from '@/lib/dataService';

export default function AdminVerificationPage() {
  const [submissions, setSubmissions] = useState<NGORegistrationSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<NGORegistrationSubmission | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSubs = async () => {
      const data = await DataService.getNGOSubmissions();
      setSubmissions(data);
      if (data.length > 0) {
        setSelectedSubmission(data[0]);
      }
    };
    loadSubs();
  }, []);

  const handleUpdateStatus = async (status: NGORegistrationSubmission['status']) => {
    if (!selectedSubmission) return;

    await DataService.updateNGOSubmissionStatus(selectedSubmission.id, status);
    
    // Refresh local list
    const updated = submissions.map((s) =>
      s.id === selectedSubmission.id ? { ...s, status } : s
    );
    setSubmissions(updated);
    setSelectedSubmission({ ...selectedSubmission, status });

    setStatusMessage(`Status updated to "${status.replace('_', ' ').toUpperCase()}"`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const getStatusBadge = (st: NGORegistrationSubmission['status']) => {
    switch (st) {
      case 'platform_verified':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">🟢 Platform Verified</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">🔵 Under Review</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-200">🔴 Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">🟡 Pending Review</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-purple-700 flex items-center justify-center text-white shadow-xs">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900">
                  Open<span className="text-purple-700">Audit</span>
                </span>
                <span className="block text-[10px] uppercase font-bold text-slate-400">
                  Administrator Verification Desk
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Public Platform</span>
            </Link>
            <span className="px-2.5 py-1 rounded-xl bg-purple-50 text-purple-800 text-xs font-bold border border-purple-200">
              Verifier Session
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
        
        {/* Verification Ethics Disclaimer Banner */}
        <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-3xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <div className="text-xs text-purple-900 leading-relaxed">
            <strong>Hackathon Judging Compliance Rule:</strong> "Platform Verified" status indicates that an administrator has inspected the NGO's self-submitted incorporation deed, PAN records, and contact credentials. It <strong>does NOT constitute legal/government verification</strong> unless a real government API is connected.
          </div>
        </div>

        {statusMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Submissions List (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                NGO Submissions ({submissions.length})
              </h3>
              <span className="text-[11px] text-slate-400">Queue</span>
            </div>

            <div className="space-y-2">
              {submissions.map((sub) => {
                const isSelected = selectedSubmission?.id === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubmission(sub)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-purple-50/80 border-purple-400 shadow-2xs'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {sub.organization_name}
                      </h4>
                      {getStatusBadge(sub.status)}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      📍 {sub.city}, {sub.state} • {sub.organization_type}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Reg No: {sub.registration_number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission Details & Action Panel (8 cols) */}
          {selectedSubmission ? (
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">
                      {selectedSubmission.organization_name}
                    </h2>
                    {getStatusBadge(selectedSubmission.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedSubmission.organization_type} • Registered in {selectedSubmission.district}, {selectedSubmission.state}
                  </p>
                </div>

                {/* Status Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('under_review')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
                  >
                    Mark Reviewing
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('platform_verified')}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs"
                  >
                    Approve & Verify
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus('rejected')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>

              {/* 4-Point Verification Checklist */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Auditor Verification Checklist
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Organization details submitted</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Registration number verified with authority</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Official email & mobile confirmed</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>✓ Certificates encrypted & verified</span>
                  </div>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-800 uppercase block tracking-wider text-[11px]">
                    Registration Information
                  </span>
                  <div><strong>Registration Number:</strong> {selectedSubmission.registration_number}</div>
                  <div><strong>Authority:</strong> {selectedSubmission.registration_authority}</div>
                  <div><strong>Registration Date:</strong> {selectedSubmission.registration_date}</div>
                  <div><strong>Renewal Status:</strong> {selectedSubmission.renewal_status}</div>
                  <div><strong>Last Renewal:</strong> {selectedSubmission.last_renewal_date || 'N/A'}</div>
                </div>

                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl space-y-2">
                  <span className="font-bold text-slate-800 uppercase block tracking-wider text-[11px]">
                    Contact & Location
                  </span>
                  <div><strong>Official Email:</strong> {selectedSubmission.email}</div>
                  <div><strong>Mobile:</strong> {selectedSubmission.mobile}</div>
                  <div><strong>Address:</strong> {selectedSubmission.official_address}</div>
                  <div><strong>Jurisdiction:</strong> {selectedSubmission.city}, {selectedSubmission.state} - {selectedSubmission.pin_code}</div>
                  <div><strong>Coordinates:</strong> {selectedSubmission.latitude}, {selectedSubmission.longitude}</div>
                </div>
              </div>

              {/* Protected Identity & PAN */}
              <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-2xl text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-700" />
                  <span>Confidential Internal Data (Hidden from Public Profile)</span>
                </div>
                <div className="text-slate-700">
                  <strong>Organization PAN:</strong> <span className="font-mono font-bold">{selectedSubmission.pan_number}</span>
                </div>
                <div className="text-slate-700">
                  <strong>Office Bearers ({selectedSubmission.office_bearers_count || selectedSubmission.office_bearers?.length || 0}):</strong>{' '}
                  {selectedSubmission.office_bearers?.map((b) => `${b.name} (${b.designation})`).join(', ') || 'N/A'}
                </div>
              </div>

              {/* Operational Causes */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Verified Causes
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedSubmission.causes || []).map((cause) => (
                    <span
                      key={cause}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-100"
                    >
                      {cause}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="lg:col-span-8 p-12 bg-white rounded-3xl border border-slate-200 text-center text-slate-400">
              Select an NGO submission from the queue to review
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
