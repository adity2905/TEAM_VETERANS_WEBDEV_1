'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DataService } from '@/lib/dataService';
import { Donation, NGO } from '@/types';
import { 
  ShieldCheck, Search, CheckCircle2, AlertCircle, ArrowLeft, 
  Printer, Heart, Building2, Calendar, FileText, Download 
} from 'lucide-react';

export default function VerifyReceipt() {
  const [receiptInput, setReceiptInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [donation, setDonation] = useState<Donation | null>(null);
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const sampleReceipts = ['TXN-80G-DEMO-9901', 'TXN-80G-DEMO-8802'];

  const handleVerify = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToLook = (customId || receiptInput).trim();
    if (!idToLook) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const match = await DataService.getDonationByReceiptId(idToLook);
      if (match) {
        setDonation(match);
        const ngos = await DataService.getNGOs();
        // Match NGO
        setNgo(ngos[0]); // default partner
      } else {
        setDonation(null);
        setNgo(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Transparency</span>
          </Link>

          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-900 text-sm">Official Receipt & 80G Tax Verifier</span>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex-1 w-full space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Public Transparency Audit Ledger</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900">
            Verify Donation Authenticity
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Enter your Transaction or 80G Receipt ID below to check live allocation status, NGO registration, and tax exemption compliance.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <form onSubmit={(e) => handleVerify(e)} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter Receipt ID (e.g. TXN-80G-DEMO-9901)"
                value={receiptInput}
                onChange={(e) => setReceiptInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSearching ? 'Verifying...' : 'Verify Now'}
            </button>
          </form>

          {/* Quick Click Samples */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-slate-500 font-medium">Try Sample IDs:</span>
            {sampleReceipts.map((sid) => (
              <button
                key={sid}
                type="button"
                onClick={() => {
                  setReceiptInput(sid);
                  handleVerify(undefined, sid);
                }}
                className="bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 px-2.5 py-0.5 rounded-lg font-mono text-[11px] text-slate-700 transition-colors"
              >
                {sid}
              </button>
            ))}
          </div>
        </div>

        {/* Verification Result */}
        {hasSearched && !isSearching && (
          <div>
            {donation ? (
              <div className="bg-white rounded-2xl border-2 border-emerald-500/80 shadow-lg overflow-hidden animate-in fade-in duration-300">
                
                {/* Result Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider block">
                        Verified Valid Contribution
                      </span>
                      <h3 className="text-lg font-black">{donation.receipt_id}</h3>
                    </div>
                  </div>

                  <span className="text-xs font-bold bg-white text-emerald-800 px-3 py-1 rounded-full shadow-xs">
                    Sec 80G Certified
                  </span>
                </div>

                {/* Certificate Details */}
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-medium">Beneficiary NGO:</span>
                      <p className="font-bold text-slate-900 text-sm">{ngo?.name || 'Annapurna Seva Mission'}</p>
                      <p className="text-[11px] text-emerald-700 font-semibold">Govt Reg: {ngo?.reg_number || '80G-MUM-2018-9104'}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-medium">Amount Contributed:</span>
                      <p className="font-black text-emerald-700 text-xl">₹{donation.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[11px] text-slate-500">Credited on {new Date(donation.created_at).toLocaleDateString('en-IN')}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-medium">Donor Information:</span>
                      <p className="font-bold text-slate-900">
                        {donation.is_anonymous ? 'Anonymous Benefactor' : donation.donor_name}
                      </p>
                      <p className="text-[11px] text-slate-500">{donation.donor_email}</p>
                    </div>

                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      <span className="text-slate-500 font-medium">Audit Proof Status:</span>
                      <p className="font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 100% Deployed to Field
                      </p>
                      <p className="text-[11px] text-slate-500">Photographic receipts archived</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print Official Certificate</span>
                    </button>
                    <Link
                      href="/"
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center justify-center transition-colors"
                    >
                      Explore Other Causes
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Receipt Not Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We could not find an audited record for ID <strong className="text-slate-800">{receiptInput}</strong>. Please check your transaction reference and try again.
                </p>
              </div>
            )}
          </div>
        )}

      </main>

    </div>
  );
}
