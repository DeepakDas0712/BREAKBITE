import React, { useState } from 'react';
import {
  Users,
  Target,
  Lightbulb,
  Cpu,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Sparkles,
  Quote,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Check,
} from 'lucide-react';

interface DesignThinkingShowcaseProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const DesignThinkingShowcase: React.FC<DesignThinkingShowcaseProps> = ({
  onClose,
  isModal = false,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    {
      id: 'empathize',
      name: '1. Empathize',
      subtitle: 'Understanding the 40-Minute Campus Time Crunch',
      icon: Users,
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      summary:
        'Engaged with campus routines to uncover the painful friction of university lunch windows.',
      details: [
        {
          title: 'Student Pain Point: The Stolen Break',
          description:
            'Students get 40–50 minutes between lectures. Up to 30 minutes are consumed in line to order and pay, followed by 10 minutes waiting for food to be fried or cooked. Result: hasty meals or skipped nutrition.',
          stat: '32 Mins',
          statLabel: 'Avg. Queue & Wait Time during 12:30 PM Rush',
        },
        {
          title: 'Canteen Owner Friction: The Sudden Surge',
          description:
            'Canteen vendors face a brutal 0 to 200 customer surge within 120 seconds of the class bell ringing. Without advance notice, kitchen staff panic, ticket errors multiply, and counters choke.',
          stat: '4.2x',
          statLabel: 'Sudden demand spike at exact break start time',
        },
      ],
      hypotheticalQuotes: [
        {
          speaker: 'Hypothetical 3rd-Year Student',
          text: '"If my lab ends at 12:35, by the time I reach the canteen counter the line is already out the door. I ended up just having chips or skipping lunch entirely."',
        },
        {
          speaker: 'Hypothetical Canteen Manager',
          text: '"We want to serve hot samosas and dosas, but when 80 students shout their orders simultaneously, we cannot tell what to prepare first. Food gets delayed and everyone is unhappy."',
        },
      ],
    },
    {
      id: 'define',
      name: '2. Define',
      subtitle: 'Framing the Core Human & Operational Problem',
      icon: Target,
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      summary:
        'Formulating the exact How Might We (HMW) statement that guides the product philosophy.',
      details: [
        {
          title: 'The Core Problem Statement',
          description:
            'University students lose the majority of their limited academic break time waiting in chaotic counter queues, causing elevated stress, missed meals, and unmanageable operational friction for campus vendors.',
          stat: '15 Min',
          statLabel: 'Target total food transit time (Our North Star)',
        },
        {
          title: 'How Might We (HMW)',
          description:
            'How might we decouple the ordering and food preparation processes from the student break window, so food is already freshly prepared the exact moment a student steps up to the counter?',
          stat: '0 Queue',
          statLabel: 'Zero physical ordering queue at counter',
        },
      ],
      principles: [
        'We are not selling food delivery — we are selling students their break time back.',
        'Order before the bell rings. Collect when the bell rings.',
        'Kitchens must receive predictable, leveled batches rather than impulsive counter shock waves.',
      ],
    },
    {
      id: 'ideate',
      name: '3. Ideate',
      subtitle: 'Brainstorming & Technical Architectural Trade-offs',
      icon: Lightbulb,
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      summary:
        'Evaluated 4 distinct approaches before converging on Scheduled Slot + Verified Token architecture.',
      alternatives: [
        {
          concept: 'Door-to-Desk Campus Delivery',
          pros: 'Maximum comfort',
          cons: 'Hostel/classroom delivery creates high rider labor cost and security issues; cold food.',
          verdict: 'Rejected',
        },
        {
          concept: 'Simple Online Ordering (ASAP Only)',
          pros: 'Easy to build',
          cons: 'All 200 orders still arrive at 12:30 PM simultaneously; kitchen chokes even worse.',
          verdict: 'Rejected',
        },
        {
          concept: 'Vending Machines',
          pros: 'Instant pickup',
          cons: 'Cannot serve freshly fried samosas, dosas, or hot chai; huge CapEx.',
          verdict: 'Rejected',
        },
        {
          concept: 'Smart Scheduled Pre-Order + QR Token Pickups (BreakBite)',
          pros: 'Orders pre-allocated into 5-min kitchen capacity buckets. Digital QR verified in 5 seconds. Hot food guaranteed.',
          cons: 'Requires vendor operational adoption.',
          verdict: 'Selected Winner',
        },
      ],
    },
    {
      id: 'prototype',
      name: '4. Prototype',
      subtitle: 'Building the Functional BreakBite Ecosystem',
      icon: Cpu,
      badgeColor: 'bg-brand-100 text-brand-800 border-brand-200',
      summary:
        'Full-stack interactive prototype connecting Student, Vendor, and Admin through shared synchronized data.',
      featuresBuilt: [
        {
          name: 'Dynamic Slot Capacity Engine',
          desc: 'Limits orders to 15 per 5-minute interval to guarantee zero kitchen overbooking.',
        },
        {
          name: 'Unique Digital QR Token (BB-XXXX)',
          desc: 'High-contrast mobile token with instant counter verification scanner.',
        },
        {
          name: 'Real-Time 5-Stage Order Tracking',
          desc: 'Placed → Accepted → In Kitchen → Ready for Pickup → Collected.',
        },
        {
          name: 'Group Campus Ordering',
          desc: 'Room-code collaboration allowing friends to pool items into one single pickup token.',
        },
        {
          name: 'Vendor Demand Forecasting & Waste Reduction',
          desc: 'Gives kitchens itemized prep schedules (e.g. fry 30 samosas at 12:20 PM) to avoid cold food.',
        },
      ],
    },
    {
      id: 'test',
      name: '5. Test',
      subtitle: 'Hypothetical Validation & Continuous Iteration Plan',
      icon: CheckCircle,
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      summary:
        'Structured testing methodology for pilot campus rollout at Demo University.',
      testMetrics: [
        {
          label: 'Average Pickup Wait Time',
          before: '28.4 minutes in line',
          after: '1.2 minutes flash pickup',
          improvement: '95.7% Reduction',
        },
        {
          label: 'Peak Hour Counter Throughput',
          before: '45 students/hour',
          after: '140 students/hour',
          improvement: '+211% Capacity',
        },
        {
          label: 'Student Meal Skipping Due to Queues',
          before: '38% surveyed skip lunch',
          after: '4% (projected)',
          improvement: 'Nutrition Protected',
        },
      ],
      iterationLessons: [
        'Initial concept had 15-minute slot intervals; changed to 5-minute intervals to prevent student clustering.',
        'Vendors requested manual 4-digit token input alongside camera QR scanning because greasy fingers or steam might smudge phone screens.',
        'Added preparation time weighting: a Masala Dosa (10m) automatically requires an earlier slot than a pre-made sandwich.',
      ],
    },
  ];

  const current = stages[activeStage];
  const IconComponent = current.icon;

  return (
    <div className={`bg-cream-50 ${isModal ? 'p-6 max-h-[85vh] overflow-y-auto' : 'py-16 px-4 sm:px-6 lg:px-8'}`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-cream-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Academic Design Thinking Case Study
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              Design Thinking Journey — The BreakBite Evolution
            </h2>
            <p className="text-sm text-charcoal-500 mt-1">
              Stanford d.school 5-Stage Framework applied to solve University Canteen Queueing Bottlenecks.
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200 transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Stage Navigation Pills */}
        <div className="flex flex-wrap gap-2 my-6">
          {stages.map((stage, idx) => {
            const StageIcon = stage.icon;
            const isSelected = idx === activeStage;
            return (
              <button
                key={stage.id}
                onClick={() => setActiveStage(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isSelected
                    ? 'bg-charcoal-900 text-white shadow-card scale-102'
                    : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
                }`}
              >
                <StageIcon className={`w-4 h-4 ${isSelected ? 'text-brand-400' : 'text-charcoal-400'}`} />
                <span>{stage.name}</span>
              </button>
            );
          })}
        </div>

        {/* Stage Content Card */}
        <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${current.badgeColor}`}>
              STAGE {activeStage + 1} OF 5
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-charcoal-900">{current.subtitle}</h3>
          </div>
          <p className="text-charcoal-600 text-sm leading-relaxed mb-6">{current.summary}</p>

          {/* STAGE 1: EMPATHIZE */}
          {activeStage === 0 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.details?.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                    <span className="text-xs font-bold text-brand-600 tracking-wider uppercase">
                      Observed Friction
                    </span>
                    <h4 className="text-base font-bold text-charcoal-900 mt-1 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="pt-3 border-t border-cream-200 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-brand-500">{item.stat}</span>
                      <span className="text-[11px] text-charcoal-500 font-medium">
                        {item.statLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-5 rounded-2xl bg-brand-50/50 border border-brand-200">
                <span className="text-xs font-bold text-brand-700 uppercase tracking-wide block mb-3">
                  Campus Voice Snippets (Hypothetical Qualitative Synthesis)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {current.hypotheticalQuotes?.map((quote, qIdx) => (
                    <div key={qIdx} className="bg-white p-4 rounded-xl border border-brand-100 shadow-subtle">
                      <Quote className="w-5 h-5 text-brand-400 mb-1" />
                      <p className="text-xs text-charcoal-700 italic leading-relaxed">
                        {quote.text}
                      </p>
                      <span className="text-[11px] font-bold text-charcoal-500 block mt-2">
                        — {quote.speaker}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: DEFINE */}
          {activeStage === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {current.details?.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                    <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">
                      Problem Formulation
                    </span>
                    <h4 className="text-base font-bold text-charcoal-900 mt-1 mb-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-charcoal-600 leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="pt-3 border-t border-cream-200 flex items-baseline gap-2">
                      <span className="text-2xl font-black text-amber-600">{item.stat}</span>
                      <span className="text-[11px] text-charcoal-500 font-medium">
                        {item.statLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-charcoal-900 text-white">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 mb-2">
                  Guiding Design Principles
                </h4>
                <ul className="space-y-2 text-xs text-cream-200">
                  {current.principles?.map((p, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 shrink-0" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* STAGE 3: IDEATE */}
          {activeStage === 2 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wide block mb-2">
                Comparative Solution Matrix
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {current.alternatives?.map((alt, i) => {
                  const isWinner = alt.verdict === 'Selected Winner';
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border transition-all ${
                        isWinner
                          ? 'bg-brand-50/60 border-brand-300 ring-2 ring-brand-500/20 shadow-md'
                          : 'bg-cream-50/60 border-cream-200'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <h4 className="text-sm font-bold text-charcoal-900">{alt.concept}</h4>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            isWinner
                              ? 'bg-brand-500 text-white'
                              : 'bg-charcoal-200 text-charcoal-600'
                          }`}
                        >
                          {alt.verdict}
                        </span>
                      </div>
                      <p className="text-[11px] text-charcoal-600 leading-relaxed mb-1">
                        <strong>Pros:</strong> {alt.pros}
                      </p>
                      <p className="text-[11px] text-charcoal-500 leading-relaxed">
                        <strong>Trade-off:</strong> {alt.cons}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STAGE 4: PROTOTYPE */}
          {activeStage === 3 && (
            <div className="space-y-4">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wide block mb-2">
                Core Engine Capabilities Developed in this Prototype
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {current.featuresBuilt?.map((feat, i) => (
                  <div key={i} className="p-4 rounded-xl bg-cream-50 border border-cream-200">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-brand-500 text-white flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <h4 className="text-xs font-bold text-charcoal-900">{feat.name}</h4>
                    </div>
                    <p className="text-[11px] text-charcoal-600 leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 5: TEST */}
          {activeStage === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {current.testMetrics?.map((m, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      {m.label}
                    </span>
                    <div className="text-xs text-charcoal-500 line-through mb-0.5">{m.before}</div>
                    <div className="text-base font-extrabold text-charcoal-900 mb-1">{m.after}</div>
                    <span className="inline-block text-xs font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                      {m.improvement}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-5 rounded-2xl bg-cream-50 border border-cream-200">
                <h4 className="text-xs font-bold text-charcoal-900 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-brand-500" />
                  Key Iterations Driven by Vendor & Student Feedback
                </h4>
                <ul className="space-y-2 text-xs text-charcoal-700">
                  {current.iterationLessons?.map((lesson, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{lesson}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-cream-200 text-[11px] text-charcoal-400 italic">
                  Note: Testing metrics are simulated/hypothetical for academic prototype validation.
                </div>
              </div>
            </div>
          )}

          {/* Bottom Stage Stepper */}
          <div className="mt-8 pt-4 border-t border-cream-100 flex items-center justify-between">
            <button
              disabled={activeStage === 0}
              onClick={() => setActiveStage((p) => Math.max(0, p - 1))}
              className="text-xs font-semibold text-charcoal-600 hover:text-charcoal-900 disabled:opacity-30 disabled:hover:text-charcoal-600 px-3 py-1.5 rounded-lg border border-cream-200"
            >
              ← Previous Stage
            </button>
            <span className="text-xs font-medium text-charcoal-400">
              {activeStage + 1} of {stages.length}
            </span>
            <button
              disabled={activeStage === stages.length - 1}
              onClick={() => setActiveStage((p) => Math.min(stages.length - 1, p + 1))}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-30 disabled:hover:text-brand-600 px-3 py-1.5 rounded-lg border border-brand-200 bg-brand-50"
            >
              Next Stage →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
