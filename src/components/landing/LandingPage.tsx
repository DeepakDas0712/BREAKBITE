import React, { useState } from 'react';
import {
  Clock,
  ArrowRight,
  CheckCircle2,
  QrCode,
  Zap,
  TrendingUp,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Store,
  Flame,
  Award,
  BookOpen,
  GraduationCap,
  HelpCircle,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';

interface LandingPageProps {
  onOpenDesignThinking: () => void;
  onOpenStudentLogin?: () => void;
  onOpenHelpCentre?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenDesignThinking,
  onOpenStudentLogin,
  onOpenHelpCentre,
}) => {
  const { setViewMode, switchPersona, setActiveTab, orders } = useBreakBite();

  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [tokenSimState, setTokenSimState] = useState<'placed' | 'preparing' | 'ready' | 'collected'>('ready');

  const faqs = [
    {
      q: 'How does scheduled pickup prevent counter congestion?',
      a: 'BreakBite enforces an automated capacity cap of 15 orders per 5-minute interval per counter. If a slot reaches capacity, students are seamlessly guided to the next 5-minute window or an alternate campus counter.',
    },
    {
      q: 'What if my class runs 5 minutes late?',
      a: 'Your food is held in an insulated heating cabinet at the counter for up to 15 minutes past your pickup slot. Simply present your digital QR token whenever you arrive.',
    },
    {
      q: 'Can friends order together?',
      a: 'Yes! BreakBite includes Group Ordering. One person can initiate a session, share the 6-digit room code with classmates, and all meals are bundled under a single master pickup token.',
    },
    {
      q: 'How does this help canteen vendors?',
      a: 'Vendors view scheduled orders up to 3 hours in advance. Instead of reacting frantically to 150 students arriving at 12:30 PM, the kitchen pre-batches samosas, dosas, and rolls in steady 5-minute waves, reducing stress and waste.',
    },
    {
      q: 'Is real money required for this demonstration?',
      a: 'No. For this academic and startup prototype, all payments (UPI, Card, Cash at Counter) run in a high-fidelity simulation mode with instant receipt generation.',
    },
  ];

  return (
    <div className="bg-cream-50 text-charcoal-900 selection:bg-brand-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-cream-200">
        {/* Subtle decorative glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-200/40 via-amber-100/30 to-transparent blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Core Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Campaign Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 border border-brand-200 text-brand-800 text-xs font-extrabold tracking-wide">
                <Flame className="w-4 h-4 text-brand-500 fill-brand-500 animate-bounce" />
                <span>CAMPAIGN: 15 MIN. 1 SAMOSA.</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-charcoal-900 tracking-tight leading-[1.08]">
                Your break is short. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-amber-600">
                  Your food shouldn’t take forever.
                </span>
              </h1>

              {/* Subheading */}
              <p className="text-lg sm:text-xl text-charcoal-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Pre-order your favourite campus food before the bell, pick up with a digital QR token, and spend your break eating instead of waiting in line.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <button
                  onClick={() => {
                    switchPersona('student');
                  }}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-base shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2.5 transition-all group"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order Your Food</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    if (onOpenStudentLogin) onOpenStudentLogin();
                    else switchPersona('student');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 border border-cream-300 text-charcoal-800 font-bold text-base shadow-subtle flex items-center justify-center gap-2 transition-colors"
                >
                  <GraduationCap className="w-4 h-4 text-brand-500" />
                  <span>Student Login (OTP)</span>
                </button>

                <button
                  onClick={() => {
                    switchPersona('vendor');
                  }}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-cream-100 border border-cream-300 text-charcoal-800 font-bold text-base shadow-subtle flex items-center justify-center gap-2 transition-colors"
                >
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Vendor Dashboard</span>
                </button>
              </div>

              {/* Trust Metric Counters */}
              <div className="pt-6 border-t border-cream-200/80 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-charcoal-900">15 Sec</div>
                  <div className="text-xs text-charcoal-500 font-medium">Counter Pickup</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-brand-500">0 Mins</div>
                  <div className="text-xs text-charcoal-500 font-medium">Ordering Queue</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-600">100%</div>
                  <div className="text-xs text-charcoal-500 font-medium">Fresh & Hot</div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Digital Token Hero Visualizer */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-floating border border-cream-200/90 relative">
                
                {/* Visualizer header */}
                <div className="flex items-center justify-between pb-4 border-b border-cream-100">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                      BB
                    </div>
                    <div>
                      <span className="text-xs font-bold text-charcoal-900 block">Live Token Simulator</span>
                      <span className="text-[10px] text-charcoal-400">Main Campus Canteen</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-cream-100 px-2 py-0.5 rounded-full text-[10px] font-bold text-charcoal-600">
                    <Clock className="w-3 h-3 text-brand-500" />
                    Slot: 12:30 PM
                  </div>
                </div>

                {/* Simulated Digital Token Card */}
                <div className="my-5 p-5 rounded-2xl bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-white shadow-elevated relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-brand-500/10 pointer-events-none" />

                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-charcoal-400">
                        Digital Pickup Token
                      </span>
                      <div className="text-3xl font-black tracking-tight text-white mt-0.5 font-mono">
                        BB-1024
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        tokenSimState === 'ready'
                          ? 'bg-emerald-500 text-white animate-soft-pulse'
                          : tokenSimState === 'preparing'
                          ? 'bg-amber-500 text-charcoal-900'
                          : tokenSimState === 'collected'
                          ? 'bg-charcoal-600 text-cream-200'
                          : 'bg-brand-500 text-white'
                      }`}
                    >
                      {tokenSimState}
                    </span>
                  </div>

                  {/* QR Code and Details */}
                  <div className="mt-4 pt-4 border-t border-charcoal-700/80 flex items-center gap-4">
                    {/* Simulated QR Code graphic */}
                    <div className="w-20 h-20 bg-white p-1.5 rounded-xl flex items-center justify-center shrink-0">
                      <svg className="w-full h-full text-charcoal-900" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4-2h2v4h-2v-4zm2 4h2v4h-2v-4zm2 2h2v2h-2v-2zm-6-2h2v2h-2v-2zm4-4h2v2h-2v-2z" />
                      </svg>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="text-cream-200 font-semibold">2x Crispy Samosa + 1x Chai</div>
                      <div className="text-charcoal-400 text-[11px]">Total: ₹42 • UPI Paid</div>
                      <div className="text-emerald-400 font-medium text-[11px]">Counter 1 (Express Line)</div>
                    </div>
                  </div>
                </div>

                {/* State switcher controls */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-charcoal-400 uppercase tracking-wider block">
                    Simulate Vendor Counter Action:
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                    {(['placed', 'preparing', 'ready', 'collected'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setTokenSimState(st)}
                        className={`py-1.5 rounded-lg font-bold capitalize transition-all ${
                          tokenSimState === st
                            ? 'bg-charcoal-900 text-white shadow-subtle'
                            : 'bg-cream-100 text-charcoal-600 hover:bg-cream-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-100 text-center">
                  <p className="text-[11px] text-charcoal-500">
                    Students flash this QR at the counter for <strong>15-second pickup</strong>.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* THE PROBLEM VS THE BREAKBITE SOLUTION */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Why Campus Canteens Break Down
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-charcoal-900 tracking-tight mt-3">
            The 40-Minute Campus Break Dilemma
          </h2>
          <p className="text-base text-charcoal-600 mt-2">
            Every day, hundreds of students storm the canteen simultaneously at 12:30 PM. Here is the reality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Old Chaotic Flow */}
          <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 sm:p-8 relative">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm uppercase tracking-wide mb-4">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>
              The Traditional Campus Queue (Friction)
            </div>

            <ul className="space-y-4 text-sm text-charcoal-700">
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>20-Minute Line:</strong> Waiting in an aggressive crowd just to place an order and pay.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>15-Minute Kitchen Delay:</strong> Waiting while samosas are fried or thalis are plated under stress.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>Skipped Lunches:</strong> Students who cannot afford to wait 35 minutes leave on an empty stomach.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✕</span>
                <span><strong>Vendor Overwhelm:</strong> Canteen owners struggle with chaotic orders, wrong tickets, and cold leftovers.</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-red-200/80 flex items-center justify-between text-xs font-bold text-red-700">
              <span>Total Break Wasted:</span>
              <span className="text-base">~35 Minutes</span>
            </div>
          </div>

          {/* BreakBite Flow */}
          <div className="bg-emerald-50/50 border border-emerald-200 rounded-3xl p-6 sm:p-8 relative">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm uppercase tracking-wide mb-4">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              The BreakBite Scheduled Experience
            </div>

            <ul className="space-y-4 text-sm text-charcoal-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Pre-Order Before the Bell:</strong> Select your meal in 30 seconds from your phone during lecture gaps.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Capacity-Allocated Slots:</strong> Kitchen receives even 5-minute prep batches to prevent counter rushes.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Flash QR & Grab:</strong> Walk up to the dedicated Express Counter, flash your token, and walk away eating.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Predictable Kitchens:</strong> Vendors know demand hours ahead, reducing food waste and increasing throughput.</span>
              </li>
            </ul>

            <div className="mt-6 pt-4 border-t border-emerald-200/80 flex items-center justify-between text-xs font-bold text-emerald-800">
              <span>Time at Counter:</span>
              <span className="text-base text-emerald-600">15 Seconds</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3-STEP EXPLANATION */}
      <section className="py-16 bg-cream-100/60 border-y border-cream-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Three Simple Steps to Skip the Queue
            </h2>
            <p className="text-sm text-charcoal-600 mt-1">
              Engineered around your university timetable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-brand-500/20">
                1
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                Order Before the Bell
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Browse canteen menus, select your upcoming break (e.g. Lunch 12:30 PM), and pick your guaranteed 5-minute pickup slot.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-charcoal-900 text-white flex items-center justify-center font-black text-xl mb-4 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                Kitchen Preps Ahead
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                The vendor’s live dashboard schedules prep time so your samosa or meal is hot and packaged 2 minutes before you arrive.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-xl mb-4 shadow-md shadow-emerald-500/20">
                3
              </div>
              <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                Flash QR & Bite
              </h3>
              <p className="text-xs text-charcoal-600 leading-relaxed">
                Walk straight to the BreakBite Express Counter. The vendor verifies your digital token in 5 seconds. Collect and enjoy your break!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGN THINKING BANNER TEASER */}
      <section className="py-12 bg-charcoal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-4 h-4" />
              Academic Design Thinking Case Study
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Empathize • Define • Ideate • Prototype • Test
            </h3>
            <p className="text-xs text-charcoal-300 mt-1 max-w-xl">
              Discover how BreakBite was conceptualized using the 5-stage Design Thinking process to solve campus dining friction.
            </p>
          </div>

          <button
            onClick={onOpenDesignThinking}
            className="shrink-0 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <span>Explore Design Thinking Case Study</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* HYPOTHETICAL CAMPUS TESTIMONIALS */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-charcoal-400 bg-cream-100 px-3 py-1 rounded-full border border-cream-200">
            Campus Demonstration Feedback (Simulated)
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight mt-3">
            What Campus Users Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                alt="Alex"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200"
              />
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Alex Verma</h4>
                <p className="text-[11px] text-charcoal-500">3rd Year B.Tech (Student)</p>
              </div>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed italic">
              "I used to sprint out of lecture halls to beat the line. With BreakBite, I schedule my hot samosa and chai during the last 5 minutes of class and just grab it at 12:30 PM."
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80"
                alt="Ramesh"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200"
              />
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Ramesh Gupta</h4>
                <p className="text-[11px] text-charcoal-500">Owner, Main Campus Canteen</p>
              </div>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed italic">
              "The rush timeline is a lifesaver. I know 15 minutes before lunch that I need 40 dosas and 60 samosas. The kitchen is calm and we waste almost zero cooked food."
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-cream-200 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
                alt="Dr. Priya"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-200"
              />
              <div>
                <h4 className="text-xs font-bold text-charcoal-900">Dr. Priya Nair</h4>
                <p className="text-[11px] text-charcoal-500">Dean of Student Affairs (Admin)</p>
              </div>
            </div>
            <p className="text-xs text-charcoal-600 leading-relaxed italic">
              "Canteen hallway congestion dropped immediately during pilot tests. BreakBite proves that smart scheduling turns chaos into seamless hospitality."
            </p>
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section className="py-16 bg-cream-100/50 border-t border-cream-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs text-charcoal-500 mt-1">
              Everything you need to know about the BreakBite pilot.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-subtle transition-all"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-charcoal-900"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-charcoal-400 transition-transform ${
                        isOpen ? 'rotate-180 text-brand-500' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-charcoal-600 leading-relaxed border-t border-cream-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal-900 text-cream-200 py-12 border-t border-charcoal-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 pb-8 border-b border-charcoal-800 text-xs">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center font-bold text-white text-xs">
                  BB
                </div>
                <span className="text-base font-extrabold text-white">BreakBite</span>
              </div>
              <p className="text-charcoal-400 max-w-sm text-xs leading-relaxed">
                Campus-focused smart food pre-ordering and scheduled pickup ecosystem. Designed for Demo University academic demonstration.
              </p>
              <div className="text-[11px] text-charcoal-400">
                <strong>Campaign:</strong> 15 MIN. 1 SAMOSA. • <strong>Tagline:</strong> Skip the Queue. Not Your Break.
              </div>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Demonstration Personas
              </h5>
              <ul className="space-y-1.5 text-charcoal-400">
                <li>
                  <button onClick={() => switchPersona('student')} className="hover:text-white">
                    Student (student@breakbite.demo)
                  </button>
                </li>
                <li>
                  <button onClick={() => switchPersona('vendor')} className="hover:text-white">
                    Vendor (vendor@breakbite.demo)
                  </button>
                </li>
                <li>
                  <button onClick={() => switchPersona('admin')} className="hover:text-white">
                    Admin (admin@breakbite.demo)
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Help & Support
              </h5>
              <ul className="space-y-1.5 text-charcoal-400">
                <li>
                  <button onClick={onOpenHelpCentre} className="hover:text-white flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-400" />
                    <span>Help & Support Centre</span>
                  </button>
                </li>
                <li>
                  <button onClick={onOpenHelpCentre} className="hover:text-white">
                    Frequently Asked Questions
                  </button>
                </li>
                <li>
                  <button onClick={onOpenHelpCentre} className="hover:text-white">
                    Submit Support Ticket
                  </button>
                </li>
                <li>
                  <button onClick={onOpenStudentLogin} className="hover:text-white flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-brand-400" />
                    <span>Student Login (Demo OTP)</span>
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-white text-xs uppercase tracking-wider mb-2">
                Academic Framework
              </h5>
              <ul className="space-y-1.5 text-charcoal-400">
                <li>
                  <button onClick={onOpenDesignThinking} className="hover:text-white">
                    Design Thinking 5 Stages
                  </button>
                </li>
                <li>Demo Password: <span className="text-brand-400 font-mono">breakbite2025</span></li>
                <li>Version: 1.0.0-Academic-Release</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-charcoal-500 gap-2">
            <div>© 2026 BreakBite Technologies. Campus Food Pre-Ordering Ecosystem.</div>
            <div>"Your food. Your time. Your campus."</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
