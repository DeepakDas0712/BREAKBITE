import React, { useState, useMemo } from 'react';
import {
  Search,
  HelpCircle,
  UtensilsCrossed,
  CreditCard,
  QrCode,
  UserCheck,
  XCircle,
  Wrench,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  PhoneCall,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBreakBite } from '../../context/BreakBiteContext';
import { SupportTicketCategory, SupportTicketStatus } from '../../types';

interface HelpCentrePageProps {
  onBackToApp?: () => void;
  onOpenLogin?: () => void;
}

interface FAQItem {
  id: string;
  category: SupportTicketCategory;
  question: string;
  answer: string;
  tags: string[];
}

const FAQ_DATABASE: FAQItem[] = [
  // 1. Ordering Food
  {
    id: 'faq-ord-1',
    category: 'Food Ordering',
    question: 'How do I place an order on BreakBite?',
    answer:
      'Choose your canteen, browse the menu, add items to your tray, select your upcoming break slot (or immediate prep), choose your payment method, and confirm your order. You will receive a digital pickup token with a live status.',
    tags: ['order', 'tray', 'canteen', 'how to order', 'break slot', 'steps'],
  },
  {
    id: 'faq-ord-2',
    category: 'Food Ordering',
    question: 'Can I customize my food order?',
    answer:
      'Yes, you can add cooking instructions or notes (such as "less spicy" or "extra chutney") in the special instructions box before proceeding to checkout.',
    tags: ['customize', 'notes', 'spicy', 'chutney', 'instructions'],
  },
  {
    id: 'faq-ord-3',
    category: 'Food Ordering',
    question: 'What is the maximum number of items I can order?',
    answer:
      'To ensure campus kitchens can maintain rapid 5-minute prep cycles during rush periods, individual orders are limited to 10 items. For larger group orders, use the Group Ordering feature.',
    tags: ['limit', 'max items', 'quantity', 'group order'],
  },

  // 2. Payments & Refunds
  {
    id: 'faq-pay-1',
    category: 'Payments & Refunds',
    question: 'What payment methods are supported?',
    answer:
      'BreakBite supports UPI (Google Pay, PhonePe, Paytm, BHIM), Debit/Credit Cards, and direct Cash at Counter payment. For UPI, you can scan the canteen QR code and provide the UTR reference for instant verification.',
    tags: ['payment', 'upi', 'paytm', 'gpay', 'phonepe', 'card', 'cash'],
  },
  {
    id: 'faq-pay-2',
    category: 'Payments & Refunds',
    question: 'My payment was deducted but the order failed. What should I do?',
    answer:
      'Don’t worry! If money was debited from your bank but your token was not generated, UPI servers automatically reconcile within 2 to 4 hours. You can also submit a support ticket below with your 12-digit UTR number for priority assistance.',
    tags: ['deducted', 'failed', 'utr', 'money debited', 'refund'],
  },
  {
    id: 'faq-pay-3',
    category: 'Payments & Refunds',
    question: 'How do refunds work for cancelled orders?',
    answer:
      'If a canteen vendor cancels an unavailable item or if your cancellation is approved before food preparation begins, UPI refunds are credited back to the source account within 24 hours.',
    tags: ['refund', 'cancelled', 'reversal', 'bank account'],
  },

  // 3. Pickup & Tokens
  {
    id: 'faq-pick-1',
    category: 'Pickup & Tokens',
    question: 'How does the digital pickup token work?',
    answer:
      'Once your order is accepted, BreakBite assigns a unique token number (e.g., BB-1024) and an encrypted QR code. When the kitchen marks your order as "Ready for Pickup", head to Counter #1, show your QR token, and collect your hot food without standing in line.',
    tags: ['token', 'qr code', 'counter', 'pickup', 'express counter'],
  },
  {
    id: 'faq-pick-2',
    category: 'Pickup & Tokens',
    question: 'What happens if I arrive late for my scheduled slot?',
    answer:
      'We keep your food safely stored in an insulated heating counter for up to 15 minutes after your scheduled pickup time. If you are delayed by a lecture, your token remains active until collected.',
    tags: ['late', 'lecture', 'heating counter', 'delay', 'expired'],
  },
  {
    id: 'faq-pick-3',
    category: 'Pickup & Tokens',
    question: 'Can a friend collect my food for me?',
    answer:
      'Yes! You can share your digital token screenshot or token number with your classmate. The canteen counter staff will scan and verify the token upon collection.',
    tags: ['friend', 'classmate', 'share', 'collection'],
  },

  // 4. Account & Login
  {
    id: 'faq-acc-1',
    category: 'Account & Login',
    question: 'How do I log in to BreakBite?',
    answer:
      'Enter your University Registration ID, Full Name, and 10-digit mobile number, then verify with the 6-digit OTP sent to your phone (Demo OTP: 123456). No complex passwords required!',
    tags: ['login', 'otp', 'registration id', 'sign in', 'phone'],
  },
  {
    id: 'faq-acc-2',
    category: 'Account & Login',
    question: 'Can I change my registered mobile number?',
    answer:
      'Yes, you can update your mobile number from the login screen using the "Edit Details" option, or reach out through the Support Form below to update your university student profile.',
    tags: ['change number', 'edit phone', 'profile', 'mobile'],
  },

  // 5. Cancellations
  {
    id: 'faq-can-1',
    category: 'Cancellations',
    question: 'Can I cancel an order after placing it?',
    answer:
      'You can cancel an order free of charge while its status is "Placed" or "Payment Pending". Once the kitchen begins "Preparing" your food, cancellations are disabled to prevent food waste.',
    tags: ['cancel', 'cancellation', 'placed', 'preparing', 'refund'],
  },

  // 6. Technical Issues
  {
    id: 'faq-tech-1',
    category: 'Technical Issues',
    question: 'The app is showing a blank screen or not loading.',
    answer:
      'Try refreshing your browser, clearing your cache, or opening BreakBite in an incognito window. Ensure your device is connected to campus Wi-Fi or mobile data.',
    tags: ['blank screen', 'loading', 'cache', 'browser', 'refresh'],
  },
  {
    id: 'faq-tech-2',
    category: 'Technical Issues',
    question: 'My QR code is not scanning at the counter.',
    answer:
      'Ensure your screen brightness is set to high. If the camera scanner has trouble, the shopkeeper can manually type your 4-digit token code (e.g., BB-1024) into their vendor terminal.',
    tags: ['qr scan', 'brightness', 'scanner', 'manual code', 'terminal'],
  },
];

const CATEGORIES = [
  {
    name: 'Ordering Food' as SupportTicketCategory,
    icon: UtensilsCrossed,
    color: 'text-brand-500 bg-brand-50 border-brand-200 hover:border-brand-400',
    description: 'Menu, tray, item limits & prep time',
  },
  {
    name: 'Payments & Refunds' as SupportTicketCategory,
    icon: CreditCard,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400',
    description: 'UPI, UTR verification & refund cycles',
  },
  {
    name: 'Pickup & Tokens' as SupportTicketCategory,
    icon: QrCode,
    color: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400',
    description: 'Digital QR tokens & late arrivals',
  },
  {
    name: 'Account & Login' as SupportTicketCategory,
    icon: UserCheck,
    color: 'text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-400',
    description: 'OTP authentication & university IDs',
  },
  {
    name: 'Cancellations' as SupportTicketCategory,
    icon: XCircle,
    color: 'text-amber-600 bg-amber-50 border-amber-200 hover:border-amber-400',
    description: 'Order cancellation rules & deadlines',
  },
  {
    name: 'Technical Issues' as SupportTicketCategory,
    icon: Wrench,
    color: 'text-rose-600 bg-rose-50 border-rose-200 hover:border-rose-400',
    description: 'App connectivity, cache & scanners',
  },
];

export const HelpCentrePage: React.FC<HelpCentrePageProps> = ({
  onBackToApp,
  onOpenLogin,
}) => {
  const {
    studentSession,
    currentUser,
    supportTickets,
    submitSupportTicket,
    orders,
  } = useBreakBite();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SupportTicketCategory | 'All'>('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-ord-1');

  // Contact Form State
  const [activeChannelTab, setActiveChannelTab] = useState<'form' | 'canteen' | 'tech'>('form');
  const [ticketFullName, setTicketFullName] = useState(studentSession?.name || currentUser.name || '');
  const [ticketRegId, setTicketRegId] = useState(studentSession?.registrationId || currentUser.studentId || '');
  const [ticketMobile, setTicketMobile] = useState(
    studentSession?.mobileNumber?.replace(/\D/g, '').slice(-10) ||
      currentUser.phone?.replace(/\D/g, '').slice(-10) ||
      ''
  );
  const [ticketCategory, setTicketCategory] = useState<SupportTicketCategory>('Food Ordering');
  const [ticketOrderId, setTicketOrderId] = useState('');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  // My Requests Filter
  const [requestsFilter, setRequestsFilter] = useState<SupportTicketStatus | 'All'>('All');

  // Filter FAQs dynamically based on search query and category
  const filteredFaqs = useMemo(() => {
    return FAQ_DATABASE.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const inQuestion = item.question.toLowerCase().includes(q);
      const inAnswer = item.answer.toLowerCase().includes(q);
      const inCategory = item.category.toLowerCase().includes(q);
      const inTags = item.tags.some((t) => t.toLowerCase().includes(q));

      return inQuestion || inAnswer || inCategory || inTags;
    });
  }, [searchQuery, selectedCategory]);

  // Handle Support Form Submit
  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!ticketFullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!ticketRegId.trim()) {
      setFormError('Please enter your University Registration ID.');
      return;
    }
    const cleanPhone = ticketMobile.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!ticketSubject.trim()) {
      setFormError('Please enter a subject for your request.');
      return;
    }
    if (!ticketDescription.trim() || ticketDescription.trim().length < 10) {
      setFormError('Please provide at least 10 characters describing your issue.');
      return;
    }

    const newTicket = submitSupportTicket({
      studentName: ticketFullName.trim(),
      registrationId: ticketRegId.trim(),
      mobileNumber: `+91 ${cleanPhone}`,
      category: ticketCategory,
      orderId: ticketOrderId.trim() || undefined,
      subject: ticketSubject.trim(),
      description: ticketDescription.trim(),
    });

    setCreatedTicketId(newTicket.id);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Filter My Requests
  const filteredTickets = useMemo(() => {
    if (requestsFilter === 'All') return supportTickets;
    return supportTickets.filter((t) => t.status === requestsFilter);
  }, [supportTickets, requestsFilter]);

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 pb-20 selection:bg-brand-500 selection:text-white">
      {/* HEADER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-cream-100/50 to-cream-50 border-b border-cream-200 pt-12 pb-16">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-brand-200/30 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Breadcrumb or Back button */}
          {onBackToApp && (
            <div className="mb-4 flex items-center justify-center">
              <button
                onClick={onBackToApp}
                className="text-xs font-bold text-charcoal-600 hover:text-brand-600 inline-flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-cream-300 shadow-subtle transition-all"
              >
                <span>← Back to Campus Dashboard</span>
              </button>
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-100 border border-brand-200 text-brand-700 text-xs font-extrabold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Campus Help & Support Centre</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-charcoal-900 tracking-tight">
            How can we help you?
          </h1>

          <p className="mt-3 text-base sm:text-lg text-charcoal-600 max-w-2xl mx-auto">
            Got a question? We’re here to make your BreakBite experience easier.
          </p>

          {/* SECTION A: DYNAMIC SEARCH BAR */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-charcoal-400 group-focus-within:text-brand-500 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help, orders, payments, pickup..."
                className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border-2 border-cream-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 text-charcoal-900 placeholder:text-charcoal-400 font-medium text-sm sm:text-base outline-none shadow-floating transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-charcoal-400 hover:text-charcoal-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live Search Meta */}
            {searchQuery && (
              <div className="mt-2 text-xs text-charcoal-500 flex items-center justify-between px-2">
                <span>
                  Found <strong>{filteredFaqs.length}</strong> matching questions for "
                  <em className="text-charcoal-900">{searchQuery}</em>"
                </span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-brand-600 hover:underline font-semibold"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-16">
        {/* SECTION B: 6 FAQ CATEGORY CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-extrabold text-charcoal-900">
                Explore by Category
              </h2>
              <p className="text-xs text-charcoal-500">
                Select a topic to quickly filter related FAQs and common campus questions.
              </p>
            </div>

            {selectedCategory !== 'All' && (
              <button
                onClick={() => setSelectedCategory('All')}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 transition-colors"
              >
                Clear Filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() =>
                    setSelectedCategory(isSelected ? 'All' : cat.name)
                  }
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-white border-brand-500 shadow-md ring-2 ring-brand-500/20 scale-[1.02]'
                      : 'bg-white border-cream-200 hover:border-brand-300 hover:shadow-subtle'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-charcoal-900">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-charcoal-500 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION C: EXPANDABLE FAQ ACCORDION */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-charcoal-900">
                Frequently Asked Questions
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-700">
                {filteredFaqs.length}
              </span>
            </div>

            {selectedCategory !== 'All' && (
              <span className="text-xs font-semibold text-charcoal-500">
                Filtered: <strong className="text-charcoal-800">{selectedCategory}</strong>
              </span>
            )}
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center space-y-3">
              <HelpCircle className="w-10 h-10 text-charcoal-300 mx-auto" />
              <h4 className="text-base font-bold text-charcoal-800">
                No matching answers found
              </h4>
              <p className="text-xs text-charcoal-500 max-w-sm mx-auto">
                We couldn’t find FAQs matching your search query. You can submit a direct support request below.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="text-xs font-bold text-brand-600 hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className={`bg-white rounded-2xl border transition-all ${
                      isExpanded
                        ? 'border-brand-400 shadow-md'
                        : 'border-cream-200 hover:border-cream-300 shadow-subtle'
                    }`}
                  >
                    <button
                      onClick={() =>
                        setExpandedFaqId(isExpanded ? null : faq.id)
                      }
                      className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-cream-100 text-charcoal-600 shrink-0 border border-cream-200">
                          {faq.category}
                        </span>
                        <span className="font-bold text-xs sm:text-sm text-charcoal-900">
                          {faq.question}
                        </span>
                      </div>
                      <div className="shrink-0 text-charcoal-400">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-brand-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-charcoal-600 leading-relaxed border-t border-cream-100 animate-fade-in">
                        <p>{faq.answer}</p>
                        <div className="mt-3 pt-3 border-t border-cream-100 flex items-center justify-between text-[11px] text-charcoal-400">
                          <span>Was this answer helpful?</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Thank you for your feedback!');
                              }}
                              className="px-2 py-0.5 rounded bg-cream-100 hover:bg-cream-200 text-charcoal-700"
                            >
                              👍 Yes
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                alert('Thank you! We will refine this guide.');
                              }}
                              className="px-2 py-0.5 rounded bg-cream-100 hover:bg-cream-200 text-charcoal-700"
                            >
                              👎 No
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* SECTION D: CONTACT SUPPORT */}
        <div className="bg-white rounded-3xl border border-cream-200 shadow-elevated overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-cream-200 bg-gradient-to-r from-cream-100/60 to-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-100 text-brand-800 text-xs font-bold mb-2">
              <MessageSquare className="w-3.5 h-3.5 text-brand-600" />
              <span>Dedicated Campus Support Desk</span>
            </div>
            <h2 className="text-2xl font-extrabold text-charcoal-900">
              Still need help? Talk to us.
            </h2>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1">
              Select one of the 3 channels below to reach the right campus canteen or technical team.
            </p>

            {/* 3 Channels Switcher Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6">
              <button
                onClick={() => setActiveChannelTab('form')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeChannelTab === 'form'
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                    : 'bg-white text-charcoal-700 border-cream-200 hover:border-cream-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <FileText className="w-4 h-4 text-brand-400" />
                  <span>Submit Ticket</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">
                  Fastest online tracking & resolution
                </p>
              </button>

              <button
                onClick={() => setActiveChannelTab('canteen')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeChannelTab === 'canteen'
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                    : 'bg-white text-charcoal-700 border-cream-200 hover:border-cream-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Contact Canteen</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">
                  Direct counter phone & intercom
                </p>
              </button>

              <button
                onClick={() => setActiveChannelTab('tech')}
                className={`p-3 rounded-xl text-left border transition-all ${
                  activeChannelTab === 'tech'
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-sm'
                    : 'bg-white text-charcoal-700 border-cream-200 hover:border-cream-300'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>Report Tech Issue</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5">
                  Terminal errors & bug reports
                </p>
              </button>
            </div>
          </div>

          {/* CHANNEL CONTENT */}
          <div className="p-6 sm:p-8">
            {/* CHANNEL 1: TICKET FORM */}
            {activeChannelTab === 'form' && (
              <div>
                {createdTicketId ? (
                  <div className="p-6 sm:p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4 animate-scale-up">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-charcoal-900">
                        Support Ticket Submitted!
                      </h3>
                      <div className="mt-2 inline-block px-3 py-1 bg-white rounded-lg border border-emerald-200 text-sm font-mono font-bold text-emerald-800">
                        Ticket ID: {createdTicketId}
                      </div>
                      <p className="text-xs sm:text-sm text-charcoal-600 mt-2 max-w-md mx-auto">
                        Your request has been logged and assigned to campus dining operations.
                        Expected resolution is <strong>within 15 minutes</strong> during break hours.
                      </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => {
                          const elem = document.getElementById('my-support-requests-section');
                          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-4 py-2 rounded-xl bg-charcoal-900 text-white font-bold text-xs hover:bg-charcoal-800 transition-colors"
                      >
                        View in "My Support Requests"
                      </button>
                      <button
                        onClick={() => {
                          setCreatedTicketId(null);
                          setTicketSubject('');
                          setTicketDescription('');
                        }}
                        className="px-4 py-2 rounded-xl bg-white border border-emerald-300 text-emerald-800 font-bold text-xs hover:bg-emerald-100/50 transition-colors"
                      >
                        Submit Another Request
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="space-y-5">
                    {formError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-shake">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-bold text-charcoal-800 mb-1">
                          Full Name <span className="text-brand-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ticketFullName}
                          onChange={(e) => setTicketFullName(e.target.value)}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                        />
                      </div>

                      {/* Registration ID */}
                      <div>
                        <label className="block text-xs font-bold text-charcoal-800 mb-1">
                          Registration ID <span className="text-brand-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={ticketRegId}
                          onChange={(e) => setTicketRegId(e.target.value)}
                          placeholder="e.g. 12401234"
                          className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                        />
                      </div>

                      {/* Mobile */}
                      <div>
                        <label className="block text-xs font-bold text-charcoal-800 mb-1">
                          Mobile Number <span className="text-brand-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={ticketMobile}
                          onChange={(e) => setTicketMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="10-digit phone"
                          className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Category Dropdown */}
                      <div>
                        <label className="block text-xs font-bold text-charcoal-800 mb-1">
                          Category <span className="text-brand-500">*</span>
                        </label>
                        <select
                          value={ticketCategory}
                          onChange={(e) =>
                            setTicketCategory(e.target.value as SupportTicketCategory)
                          }
                          className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                        >
                          <option value="Food Ordering">Food Ordering</option>
                          <option value="Payments & Refunds">Payments & Refunds</option>
                          <option value="Order Not Ready">Order Not Ready</option>
                          <option value="Pickup & Tokens">Pickup & Tokens</option>
                          <option value="Cancellations">Cancellations</option>
                          <option value="Account & Login">Account & Login</option>
                          <option value="Technical Issues">Technical Issues</option>
                          <option value="Other">Other Query</option>
                        </select>
                      </div>

                      {/* Optional Order ID */}
                      <div>
                        <label className="block text-xs font-bold text-charcoal-800 mb-1">
                          Related Order ID <span className="text-charcoal-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={ticketOrderId}
                          onChange={(e) => setTicketOrderId(e.target.value)}
                          placeholder="e.g. BB-2026-1021"
                          className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1">
                        Subject <span className="text-brand-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Brief summary of your query or issue"
                        className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-charcoal-800 mb-1">
                        Detailed Description <span className="text-brand-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={ticketDescription}
                        onChange={(e) => setTicketDescription(e.target.value)}
                        placeholder="Please describe what happened, what you expected, and any relevant details (e.g. UPI UTR number, counter location)..."
                        className="w-full px-3.5 py-2.5 bg-cream-50/50 border border-cream-300 focus:border-brand-500 rounded-xl text-xs font-medium text-charcoal-900 outline-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Support Request</span>
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* CHANNEL 2: CONTACT CANTEEN DIRECTLY */}
            {activeChannelTab === 'canteen' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                      Canteen Counter 1 & 2
                    </span>
                    <h4 className="text-sm font-extrabold text-charcoal-900">
                      Main Campus Canteen (Central Block)
                    </h4>
                    <p className="text-xs text-charcoal-600">
                      Location: Central Academic Block, Ground Floor near Main Quad
                    </p>
                    <div className="pt-2 text-xs text-charcoal-800 space-y-1 font-mono">
                      <div>📞 Intercom: Ext 4021</div>
                      <div>💬 WhatsApp / Mobile: +91 98111 22334</div>
                      <div>⏰ Operating Hours: 08:30 AM – 06:00 PM</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                      Canteen Counter 3 & 4
                    </span>
                    <h4 className="text-sm font-extrabold text-charcoal-900">
                      Student Food Court (Activity Center)
                    </h4>
                    <p className="text-xs text-charcoal-600">
                      Location: Student Activity Center, Level 1
                    </p>
                    <div className="pt-2 text-xs text-charcoal-800 space-y-1 font-mono">
                      <div>📞 Intercom: Ext 4088</div>
                      <div>💬 WhatsApp / Mobile: +91 98222 33445</div>
                      <div>⏰ Operating Hours: 09:00 AM – 08:00 PM</div>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Peak Lunch Rush Advice:</strong> During 12:30 PM - 01:20 PM, phone lines may be busy. Showing your token number at Counter #1 guarantees immediate collection without waiting on call.
                  </span>
                </div>
              </div>
            )}

            {/* CHANNEL 3: TECHNICAL ISSUES */}
            {activeChannelTab === 'tech' && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 rounded-2xl bg-cream-100/50 border border-cream-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-extrabold text-charcoal-900">
                      BreakBite Developer & Campus IT Operations
                    </h4>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      All Terminals Operational
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-600 leading-relaxed">
                    Experiencing bugs with the QR token generator, schedule slots, or UPI reconciliation? Our engineering team monitors campus traffic continuously during break periods.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                    <div className="p-3 rounded-xl bg-white border border-cream-200">
                      <div className="font-bold text-charcoal-800">Direct Support Email</div>
                      <div className="text-brand-600 font-mono text-[11px] mt-0.5">
                        support@breakbite.campus
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-cream-200">
                      <div className="font-bold text-charcoal-800">Campus IT Helpdesk</div>
                      <div className="text-brand-600 font-mono text-[11px] mt-0.5">
                        ithelpdesk@university.edu
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION E: MY SUPPORT REQUESTS */}
        <div id="my-support-requests-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-charcoal-900">
                  My Support Requests
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-charcoal-100 text-charcoal-800">
                  {supportTickets.length}
                </span>
              </div>
              <p className="text-xs text-charcoal-500 mt-0.5">
                Track status updates and responses to your submitted tickets.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {(['All', 'Submitted', 'Under Review', 'Resolved'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setRequestsFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    requestsFilter === st
                      ? 'bg-charcoal-900 text-white shadow-subtle'
                      : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-cream-200 p-8 text-center text-xs text-charcoal-500">
              No tickets found under status "{requestsFilter}".
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTickets.map((ticket) => {
                const isResolved = ticket.status === 'Resolved';
                const isUnderReview = ticket.status === 'Under Review';
                return (
                  <div
                    key={ticket.id}
                    className="bg-white rounded-2xl border border-cream-200 p-4 sm:p-5 shadow-subtle space-y-3 transition-all hover:border-cream-300"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-xs text-charcoal-900 bg-cream-100 px-2 py-0.5 rounded border border-cream-200">
                          {ticket.id}
                        </span>
                        <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                          {ticket.category}
                        </span>
                        {ticket.orderId && (
                          <span className="text-[10px] font-mono text-charcoal-500">
                            Order: {ticket.orderId}
                          </span>
                        )}
                      </div>

                      {/* Status Badges */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isUnderReview
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isResolved
                              ? 'bg-emerald-500'
                              : isUnderReview
                              ? 'bg-blue-500 animate-pulse'
                              : 'bg-amber-500 animate-pulse'
                          }`}
                        />
                        {ticket.status}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-charcoal-900">
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-charcoal-600 mt-1 leading-relaxed">
                        {ticket.description}
                      </p>
                    </div>

                    {/* Resolution Note if present */}
                    {ticket.resolutionNote && (
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-0.5">
                        <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Staff Resolution Note:</span>
                        </div>
                        <p className="text-[11px] text-emerald-950 pl-5">
                          {ticket.resolutionNote}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-charcoal-400 pt-1 border-t border-cream-100">
                      <span>Submitted by {ticket.studentName} ({ticket.registrationId})</span>
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
