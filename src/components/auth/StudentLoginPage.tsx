import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  QrCode,
  User,
  GraduationCap,
  Phone,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  HelpCircle,
  X,
  ChevronLeft,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBreakBite } from '../../context/BreakBiteContext';

interface StudentLoginPageProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpenHelp?: () => void;
}

export const StudentLoginPage: React.FC<StudentLoginPageProps> = ({
  isOpen = true,
  onClose,
  onOpenHelp,
}) => {
  const { loginStudentWithOtp, studentSession } = useBreakBite();

  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');

  // Form Fields
  const [registrationId, setRegistrationId] = useState('');
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');

  // OTP Fields
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer & State
  const [resendTimer, setResendTimer] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in and opening, can prepopulate
  useEffect(() => {
    if (studentSession) {
      setRegistrationId(studentSession.registrationId);
      setFullName(studentSession.name);
      const digits = studentSession.mobileNumber.replace(/\D/g, '').slice(-10);
      setMobileNumber(digits);
    }
  }, [studentSession]);

  // Resend Countdown Timer
  useEffect(() => {
    let interval: any = null;
    if (isTimerActive && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, resendTimer]);

  if (!isOpen) return null;

  // Mask Mobile Number e.g. +91 98•••• ••210
  const getMaskedMobile = (phone: string) => {
    const clean = phone.replace(/\D/g, '').slice(-10);
    if (clean.length < 10) return '+91 ••••• •••••';
    return `+91 ${clean.slice(0, 2)}•••• ••${clean.slice(-3)}`;
  };

  // Quick Demo Autofill
  const handleFillDemo = () => {
    setRegistrationId('12401234');
    setFullName('Rahul Sharma');
    setMobileNumber('9876543210');
    setErrorMsg('');
  };

  // Validate and Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const trimmedReg = registrationId.trim();
    const trimmedName = fullName.trim();
    const cleanMobile = mobileNumber.replace(/\D/g, '');

    // Validation Rules
    if (!trimmedReg) {
      setErrorMsg('University Registration ID is required (e.g. 12401234).');
      return;
    }

    if (!trimmedName || !/^[A-Za-z\s.]{2,50}$/.test(trimmedName)) {
      setErrorMsg('Please enter a valid full name (alphabetic characters only).');
      return;
    }

    if (cleanMobile.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
      setResendTimer(30);
      setIsTimerActive(true);
      setOtpDigits(['', '', '', '', '', '']);
      // Focus first OTP input
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }, 400);
  };

  // Handle OTP digit change with auto-advance
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.slice(-1); // Only take last character entered
    if (digit && !/^\d$/.test(digit)) return; // Only numbers allowed

    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    setErrorMsg('');

    // If digit entered, auto focus next box
    if (digit && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace auto-recede
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
      }
    }
  };

  // Handle Paste of complete 6-digit OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (pastedData.length >= 6) {
      const pasteArray = pastedData.slice(0, 6).split('');
      setOtpDigits(pasteArray);
      setErrorMsg('');
      otpInputRefs.current[5]?.focus();
    }
  };

  // Quick autofill demo OTP
  const handleAutoFillOtp = () => {
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setErrorMsg('');
    otpInputRefs.current[5]?.focus();
  };

  // Resend OTP
  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(30);
    setIsTimerActive(true);
    setErrorMsg('');
    setOtpDigits(['', '', '', '', '', '']);
    otpInputRefs.current[0]?.focus();
  };

  // Verify OTP against fixed Demo OTP 123456
  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setErrorMsg('Please enter all 6 digits of the verification OTP.');
      return;
    }

    if (enteredOtp !== '123456') {
      setErrorMsg('Invalid OTP. Please enter the demo code: 123456');
      return;
    }

    // Success flow
    setStep('success');
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5722', '#10B981', '#3B82F6', '#F59E0B'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      loginStudentWithOtp({
        registrationId: registrationId.trim(),
        name: fullName.trim(),
        mobileNumber: `+91 ${mobileNumber.replace(/\D/g, '').slice(-10)}`,
        loggedInAt: new Date().toISOString(),
      });
      if (onClose) onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-charcoal-900/80 backdrop-blur-md overflow-y-auto animate-fade-in">
      <div className="relative w-full max-w-5xl bg-white sm:rounded-3xl shadow-floating overflow-hidden border border-cream-200 min-h-screen sm:min-h-[640px] flex flex-col">
        {/* Floating Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/80 hover:bg-cream-100 text-charcoal-700 shadow-sm border border-cream-200 transition-all hover:scale-105"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Split Screen Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1">
          {/* LEFT COLUMN: Premium Fintech & Campus Branding */}
          <div className="lg:col-span-5 bg-gradient-to-br from-charcoal-900 via-charcoal-950 to-charcoal-900 text-white p-8 sm:p-10 lg:p-12 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Brand Glyph & Campaign */}
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <svg
                    className="w-6 h-6 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 3 21 19 3 19 12 3" fill="rgba(255,255,255,0.25)" />
                    <circle cx="12" cy="13" r="3" fill="#FFFFFF" stroke="none" />
                  </svg>
                </div>
                <div>
                  <span className="font-extrabold text-2xl tracking-tight text-white">
                    Break<span className="text-brand-400">Bite</span>
                  </span>
                  <div className="text-[10px] font-bold text-brand-300 tracking-wider uppercase">
                    Campus Food Pre-Ordering
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold">
                <Flame className="w-3.5 h-3.5 text-brand-400 fill-brand-400" />
                <span>CAMPAIGN: 15 MIN. 1 SAMOSA.</span>
              </div>
            </div>

            {/* Middle: Headline & Value Propositions */}
            <div className="relative z-10 my-8 space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                  Your break is precious.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-amber-300">
                    Your food should be ready.
                  </span>
                </h2>
                <p className="mt-2 text-charcoal-300 text-xs sm:text-sm leading-relaxed">
                  Join hundreds of students saving 20+ minutes every break with smart campus scheduling.
                </p>
              </div>

              {/* 3 Key Benefits */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Skip 20+ Minute Food Queues</h4>
                    <p className="text-[11px] text-charcoal-300 mt-0.5">
                      Order 15 mins before class dismisses and beat the canteen crowd.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Guaranteed Hot & Fresh Food</h4>
                    <p className="text-[11px] text-charcoal-300 mt-0.5">
                      Kitchen batches items in 5-min waves so your meal is steaming hot.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-2xl p-3.5 backdrop-blur-sm">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Instant Digital QR Pickup</h4>
                    <p className="text-[11px] text-charcoal-300 mt-0.5">
                      Flash your encrypted token at Express Counter #1 and pick up in 45s.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Student Testimonial */}
            <div className="relative z-10 pt-4 border-t border-charcoal-800 text-[11px] text-charcoal-400 flex items-center justify-between">
              <span>“Saved 25 mins every lunch break at Canteen 1.”</span>
              <span className="text-brand-400 font-semibold">— Priya S., CS '26</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Clean Form Interface */}
          <div className="lg:col-span-7 bg-cream-50/50 p-6 sm:p-10 lg:p-12 flex flex-col justify-center">
            <div className="max-w-md w-full mx-auto">
              {/* STEP 1: Details & Send OTP */}
              {step === 'details' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Top Bar with Demo Fill button */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                      Student Access Portal
                    </span>

                    <button
                      type="button"
                      onClick={handleFillDemo}
                      className="text-xs font-bold text-charcoal-700 hover:text-brand-600 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-cream-300 hover:border-brand-300 shadow-subtle transition-all"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>Fill Demo Student</span>
                    </button>
                  </div>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                      Sign In / Register
                    </h1>
                    <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
                      Enter your university details to pre-order food and access live tokens.
                    </p>
                  </div>

                  {/* Inline Error Banner */}
                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendOtp} className="space-y-4">
                    {/* Field 1: University Registration ID */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                        University Registration ID <span className="text-brand-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                          <GraduationCap className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={registrationId}
                          onChange={(e) => setRegistrationId(e.target.value)}
                          placeholder="e.g. 12401234"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-cream-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 outline-none transition-all shadow-subtle"
                        />
                      </div>
                      <p className="text-[11px] text-charcoal-400 mt-1">
                        Use your official university campus student roll number.
                      </p>
                    </div>

                    {/* Field 2: Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                        Full Name <span className="text-brand-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-charcoal-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full pl-10 pr-4 py-3 bg-white border border-cream-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 rounded-xl text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 outline-none transition-all shadow-subtle"
                        />
                      </div>
                    </div>

                    {/* Field 3: Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1.5">
                        Mobile Number (for OTP & SMS Updates) <span className="text-brand-500">*</span>
                      </label>
                      <div className="flex rounded-xl shadow-subtle overflow-hidden border border-cream-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all bg-white">
                        <div className="bg-cream-100 px-3.5 py-3 border-r border-cream-300 flex items-center gap-1.5 text-xs font-bold text-charcoal-700 select-none">
                          <span className="text-sm">🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="98765 43210"
                          className="w-full px-3.5 py-3 bg-transparent text-sm font-medium text-charcoal-900 placeholder:text-charcoal-400 outline-none"
                        />
                      </div>
                      <p className="text-[11px] text-charcoal-400 mt-1">
                        10-digit mobile number for order notifications and collection tokens.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full mt-2 py-3.5 px-4 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>SEND OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* Help Link */}
                  <div className="pt-4 border-t border-cream-200 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                        if (onOpenHelp) onOpenHelp();
                      }}
                      className="text-xs font-semibold text-charcoal-600 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
                      <span>Need help logging in? Visit Help & Support Centre</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: OTP Verification Screen */}
              {step === 'otp' && (
                <div className="space-y-6 animate-fade-in">
                  {/* Back / Edit Details button */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('details');
                      setErrorMsg('');
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Edit Student Details</span>
                  </button>

                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
                      Verify OTP
                    </h1>
                    <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
                      We've sent a 6-digit verification code to{' '}
                      <strong className="text-charcoal-900 font-mono">
                        {getMaskedMobile(mobileNumber)}
                      </strong>
                    </p>
                  </div>

                  {/* Demo OTP Notice & 1-Click Fill */}
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-amber-900">
                          Demo OTP: <span className="font-mono text-brand-600">123456</span>
                        </div>
                        <div className="text-[10px] text-amber-700">
                          Use fixed academic test code for instant evaluation.
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                    >
                      Fill 123456
                    </button>
                  </div>

                  {/* Inline Error Banner */}
                  {errorMsg && (
                    <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-shake">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyOtp} className="space-y-6">
                    {/* 6 Digit Input Boxes */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-700 mb-2 text-center">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex items-center justify-center gap-2 sm:gap-3">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => (otpInputRefs.current[idx] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            onPaste={idx === 0 ? handleOtpPaste : undefined}
                            className={`w-11 h-13 sm:w-12 sm:h-14 text-center font-mono text-xl font-extrabold rounded-2xl border-2 transition-all outline-none ${
                              digit
                                ? 'bg-brand-50/50 border-brand-500 text-brand-600 shadow-sm'
                                : 'bg-white border-cream-300 text-charcoal-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend Timer & Resend Button */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="text-charcoal-500">
                        {isTimerActive ? (
                          <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-brand-500" />
                            <span>Resend OTP in <strong>{resendTimer}s</strong></span>
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-medium">Ready to resend code</span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={handleResendOtp}
                        disabled={isTimerActive}
                        className={`font-bold transition-colors ${
                          isTimerActive
                            ? 'text-charcoal-400 cursor-not-allowed'
                            : 'text-brand-600 hover:text-brand-700 underline'
                        }`}
                      >
                        Resend OTP
                      </button>
                    </div>

                    {/* Verify Button */}
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>VERIFY & ENTER BREAKBITE</span>
                    </button>
                  </form>

                  {/* Help Link */}
                  <div className="pt-4 border-t border-cream-200 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        if (onClose) onClose();
                        if (onOpenHelp) onOpenHelp();
                      }}
                      className="text-xs font-semibold text-charcoal-600 hover:text-brand-600 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
                      <span>Didn't receive code? Contact Campus Help Centre</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Success Screen */}
              {step === 'success' && (
                <div className="py-8 text-center space-y-4 animate-scale-up">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-extrabold text-charcoal-900">
                      Login Successful!
                    </h2>
                    <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
                      Welcome back, <strong className="text-charcoal-800">{fullName}</strong> ({registrationId}).
                    </p>
                    <p className="text-xs text-brand-600 font-semibold mt-2">
                      Redirecting to Student Dashboard...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
