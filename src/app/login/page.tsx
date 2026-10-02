'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Building2, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Loader2,
  CheckCircle2,
  Phone,
  MapPin
} from 'lucide-react';
import { DataService } from '@/lib/dataService';

export default function LoginPage() {
  const router = useRouter();

  // Mode: 'login' | 'select_role' | 'signup_user' | 'otp_verify'
  const [viewMode, setViewMode] = useState<'login' | 'select_role' | 'signup_user' | 'otp_verify'>('login');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // User Signup State
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Pune');
  const [state, setState] = useState('Maharashtra');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(30);

  // Quick Demo credentials helper
  const handleQuickDemo = (type: 'user' | 'ngo' | 'admin') => {
    if (type === 'user') {
      setEmail('aditya.donor@gmail.com');
      setPassword('demoPass123');
    } else if (type === 'ngo') {
      setEmail('contact@vishwakarma-foundation.org');
      setPassword('ngoSecure2026');
    } else if (type === 'admin') {
      setEmail('admin.verifier@openimpact.in');
      setPassword('adminReview2026');
    }
    setErrorMessage('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (data.status === 'success') {
        DataService.setCurrentUser(data.user);
        if (data.user.role === 'ngo') {
          router.push('/dashboard');
        } else if (data.user.role === 'admin') {
          router.push('/admin/verify');
        } else {
          router.push('/user/dashboard');
        }
      } else {
        setErrorMessage(data.message || 'Invalid email or password');
      }
    } catch (err) {
      // Fallback local auth for resilience
      const user = await DataService.loginUser(email, password);
      if (user.user.role === 'ngo') {
        router.push('/dashboard');
      } else if (user.user.role === 'admin') {
        router.push('/admin/verify');
      } else {
        router.push('/user/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !signupEmail.trim() || !signupPassword) {
      setErrorMessage('Please fill out all required fields');
      return;
    }

    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the terms and privacy policy');
      return;
    }

    // Move to Demo OTP Verification
    setViewMode('otp_verify');
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val[0];
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      await DataService.registerUser(
        fullName,
        signupEmail,
        mobileNumber,
        signupPassword,
        'user',
        city,
        state
      );
      router.push('/user/dashboard');
    } catch (e) {
      setOtpError('Failed to complete registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">
            Open<span className="text-emerald-600">Cause</span>
          </span>
        </Link>
        <p className="mt-2 text-xs text-slate-500 font-medium">
          Verified NGO Network & Transparent Impact Chain
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-100 sm:px-10">

          {/* VIEW 1: LOGIN */}
          {viewMode === 'login' && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Sign in to track donations, volunteer, or manage organization drives
                </p>
              </div>

              {/* Error Message banner */}
              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Forgot password success banner */}
              {forgotPasswordSent && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Password reset link sent to your registered email (demo).</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setForgotPasswordSent(true)}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              {/* Demo 1-Click Persona Pickers */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mb-2">
                  Judge Demo 1-Click Logins
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('user')}
                    className="p-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors text-center"
                  >
                    👤 Donor
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ngo')}
                    className="p-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors text-center"
                  >
                    🏢 NGO Org
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('admin')}
                    className="p-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-800 text-xs font-semibold hover:bg-purple-100 transition-colors text-center"
                  >
                    🛡️ Verifier
                  </button>
                </div>
              </div>

              {/* Create Account Link */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500">
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => setViewMode('select_role')}
                    className="font-bold text-emerald-600 hover:text-emerald-700 underline cursor-pointer"
                  >
                    Create an Account
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* VIEW 2: ACCOUNT TYPE SELECTION (Who are you?) */}
          {viewMode === 'select_role' && (
            <div className="space-y-6">
              <div className="text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Step 1 of 2
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  Who are you?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select your profile type to configure the right transparency tools
                </p>
              </div>

              <div className="space-y-3">
                {/* Option 1: User / Donor / Volunteer */}
                <button
                  type="button"
                  onClick={() => setViewMode('signup_user')}
                  className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-start gap-3.5 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                      User / Donor / Volunteer
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      I want to discover verified NGOs, trace my donations, and join volunteer drives.
                    </p>
                  </div>
                </button>

                {/* Option 2: NGO / Organization */}
                <Link
                  href="/register/ngo"
                  className="w-full text-left p-4 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all flex items-start gap-3.5 group cursor-pointer block"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center text-slate-600 transition-colors shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700">
                      NGO / Organization
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      I represent a registered NGO and want to publish verified activities, fundraisers, and volunteer needs.
                    </p>
                  </div>
                </Link>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          )}

          {/* VIEW 3: USER SIGNUP FORM */}
          {viewMode === 'signup_user' && (
            <div className="space-y-5">
              <div className="text-center">
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                  Citizen Supporter
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Create User Account
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Join a community of traceable, transparent giving
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Aditya Verma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      required
                      placeholder="aditya@domain.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mobile</label>
                    <input
                      type="tel"
                      placeholder="+91 98200 11223"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-2 pt-1 text-xs text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span>I agree to the platform transparency terms and privacy policy.</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
                >
                  Create Account & Verify OTP →
                </button>
              </form>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setViewMode('select_role')}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  ← Back to Account Type
                </button>
              </div>
            </div>
          )}

          {/* VIEW 4: DEMO OTP VERIFICATION */}
          {viewMode === 'otp_verify' && (
            <div className="space-y-6 text-center">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Phone className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Verify Mobile OTP
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter 6-digit verification code sent to <strong className="text-slate-800">{mobileNumber || '+91 98200 11223'}</strong>
                </p>
                <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                  Demo OTP Mode: Enter any 6 digits (e.g. 1 2 3 4 5 6)
                </div>
              </div>

              {otpError && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{otpError}</span>
                </div>
              )}

              {/* 6-box OTP entry */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-black bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={isLoading}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <span>Verify OTP & Launch Dashboard</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setViewMode('signup_user')}
                  className="font-medium hover:text-slate-800"
                >
                  Edit Number
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(['1', '2', '3', '4', '5', '6']);
                    setOtpError('');
                  }}
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Resend OTP (Demo Autofill)
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
