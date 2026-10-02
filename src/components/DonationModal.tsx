'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Fundraiser, NGO } from '@/types';
import { DataService } from '@/lib/dataService';
import { X, Heart, ShieldCheck, CheckCircle2, Download, Printer, ArrowRight } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundraiser?: Fundraiser | null;
  ngo?: NGO | null;
  onDonationSuccess?: () => void;
}

export default function DonationModal({
  isOpen,
  onClose,
  fundraiser,
  ngo,
  onDonationSuccess,
}: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPan, setDonorPan] = useState<string>('ABCDE1234F');
  const [donorPhone, setDonorPhone] = useState<string>('9820112345');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [receiptData, setReceiptData] = useState<{
    receiptId: string;
    amount: number;
    date: string;
    donorName: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      const u = DataService.getCurrentUser();
      if (u) {
        if (!donorName) setDonorName(u.full_name);
        if (!donorEmail) setDonorEmail(u.email);
        if (u.phone) setDonorPhone(u.phone);
        if (u.id_type === 'PAN' && u.id_number) setDonorPan(u.id_number);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;

  const handlePresetSelect = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;

    setIsSubmitting(true);

    try {
      const targetFundraiserId = fundraiser?.id || 'fund-1';
      const donation = await DataService.donate(
        targetFundraiserId,
        currentAmount,
        donorName || 'Generous Supporter',
        donorEmail || 'supporter@community.org',
        isAnonymous
      );

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#f59e0b'],
      });

      setReceiptData({
        receiptId: donation.receipt_id,
        amount: currentAmount,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
        donorName: isAnonymous ? 'Anonymous Donor' : (donorName || 'Generous Supporter'),
      });

      onDonationSuccess?.();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setReceiptData(null);
    setCustomAmount('');
    setSelectedAmount(500);
    onClose();
  };

  const ngoName = fundraiser?.ngo?.name || ngo?.name || 'Verified NGO Partner';
  const unitText = fundraiser?.unit_cost_description || '₹25 provides 1 nutrition meal';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-emerald-400 text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Transparent Contribution
            </span>
            <h2 className="text-xl font-bold leading-tight">
              {receiptData ? 'Tax Exemption Receipt' : `Support ${ngoName}`}
            </h2>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-emerald-500/10 blur-xl pointer-events-none" />
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {receiptData ? (
            /* Success & 80G Receipt View */
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900">Thank You for Your Impact!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  Your donation has been credited directly to <strong className="text-slate-800">{ngoName}</strong>.
                </p>
              </div>

              {/* Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2.5 font-mono">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Transaction ID:</span>
                  <span className="font-bold text-slate-900">{receiptData.receiptId}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Donor Name:</span>
                  <span className="font-semibold text-slate-900">{receiptData.donorName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Amount:</span>
                  <span className="font-bold text-emerald-600 text-sm">₹{receiptData.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Date:</span>
                  <span>{receiptData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tax Benefit:</span>
                  <span className="text-emerald-700 font-semibold">Eligible under Sec 80G</span>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save
                </button>
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
                >
                  Back to Feed
                </button>
              </div>
            </div>
          ) : (
            /* Donation Form */
            <form onSubmit={handleDonate} className="space-y-5">
              
              {/* Cause / Unit cost explanation */}
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-700 shrink-0">
                  <Heart className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-900">
                    {fundraiser ? fundraiser.title : 'Direct Cause Funding'}
                  </h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    <strong>Impact Metric:</strong> {unitText}
                  </p>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Amount (INR)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2.5">
                  {[250, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => handlePresetSelect(amt)}
                      className={`py-2 px-1 text-sm font-bold rounded-xl border transition-all ${
                        selectedAmount === amt && !customAmount
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      ₹{amt.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="10"
                    placeholder="Or enter custom amount"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full pl-8 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>

              {/* Mandatory Donor Verification Details */}
              <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Mandatory Donor KYC & 80G Details
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-semibold px-2 py-0.5 rounded">
                    Sec 80G Compliant
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Legal Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email for Tax 80G Receipt <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="rahul@example.com"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Donor PAN Number (For 80G) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      placeholder="e.g. ABCDE1234F"
                      value={donorPan}
                      onChange={(e) => setDonorPan(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone (10 digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9876543210"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                  />
                  <label htmlFor="anon" className="text-xs text-slate-600 select-none">
                    Mask my name on public donor leaderboard (80G certificate still issued to you)
                  </label>
                </div>
              </div>

              {/* Mock Payment Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Simulated Payment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'upi'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Instant UPI (GPay / PhonePe)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span>Debit / Credit Card</span>
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting || currentAmount <= 0}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
              >
                <span>
                  {isSubmitting
                    ? 'Processing Contribution...'
                    : `Confirm Contribution of ₹${currentAmount.toLocaleString('en-IN')}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
