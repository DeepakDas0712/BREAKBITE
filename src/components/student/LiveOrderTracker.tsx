import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  MapPin,
  ChevronRight,
  Star,
  RotateCcw,
  Sparkles,
  Store,
  ArrowLeft,
  XCircle,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Order, OrderStatus } from '../../types';

interface LiveOrderTrackerProps {
  orderId: string | null;
  onOpenToken: (order: Order) => void;
  onBackToHome: () => void;
}

const STAGES: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'placed', label: 'Order Placed', desc: 'Received by BreakBite campus engine' },
  { key: 'accepted', label: 'Accepted', desc: 'Kitchen acknowledged ticket' },
  { key: 'preparing', label: 'In Kitchen', desc: 'Food being cooked & packaged' },
  { key: 'ready', label: 'Ready for Pickup', desc: 'Hot at Express Counter' },
  { key: 'collected', label: 'Collected', desc: 'Pickup verified via token' },
];

export const LiveOrderTracker: React.FC<LiveOrderTrackerProps> = ({
  orderId,
  onOpenToken,
  onBackToHome,
}) => {
  const { orders, cancelOrder, rateOrder, reorderPastOrder } = useBreakBite();

  const [ratingScore, setRatingScore] = useState(5);
  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const order = orders.find((o) => o.id === orderId) || orders[0];

  if (!order) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-cream-200">
        <h3 className="text-base font-bold text-charcoal-900">No active order found</h3>
        <button
          onClick={onBackToHome}
          className="mt-4 px-4 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold"
        >
          Return to Home
        </button>
      </div>
    );
  }

  const stageOrder: OrderStatus[] = ['placed', 'accepted', 'preparing', 'ready', 'collected'];
  const currentStageIndex = stageOrder.indexOf(order.orderStatus);

  const isCancelled = order.orderStatus === 'cancelled';
  const isCollected = order.orderStatus === 'collected';
  const isReady = order.orderStatus === 'ready';
  const isPendingVerification = order.paymentStatus === 'verification_required';

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rateOrder(order.id, ratingScore, ratingComment);
    setRatingSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-16">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 text-xs font-bold text-charcoal-600 hover:text-charcoal-900 bg-white px-3 py-1.5 rounded-xl border border-cream-300 shadow-subtle transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>

        <button
          onClick={() => onOpenToken(order)}
          className="flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3.5 py-1.5 rounded-xl border border-brand-200 shadow-subtle transition-colors"
        >
          <QrCode className="w-4 h-4" />
          <span>Show QR Token ({order.tokenNumber})</span>
        </button>
      </div>

      {/* Main Order Card */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card space-y-8">
        
        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cream-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-black uppercase tracking-wider text-charcoal-400">
                Order Tracking
              </span>
              <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                {order.tokenNumber}
              </span>
            </div>
            <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
              {order.canteenName}
            </h1>
            <p className="text-xs text-charcoal-500 mt-0.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-brand-500" />
              <span>
                Target Pickup: <strong>{order.pickupTime}</strong> ({order.breakName})
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenToken(order)}
              className="px-5 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md"
            >
              <QrCode className="w-4 h-4 text-brand-400" />
              <span>Token: {order.tokenNumber}</span>
            </button>
          </div>
        </div>

        {/* PAYMENT VERIFICATION STATUS BANNER */}
        {isPendingVerification && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-amber-900">
                  Payment Verification in Progress
                </span>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2 py-0.2 rounded-full">
                  Pending Shopkeeper Check
                </span>
              </div>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Your UPI transaction reference <strong>{order.utrReference || 'Submitted'}</strong> has been sent to the shopkeeper. Once verified against bank records, your order will be accepted and confirmed.
              </p>
            </div>
          </div>
        )}

        {/* Live Status Progress Bar */}
        {isCancelled ? (
          <div className="p-5 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
            <XCircle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h3 className="font-bold text-sm text-red-900">Order Was Cancelled</h3>
              <p className="text-xs text-red-700 mt-0.5">
                {order.cancellationReason || 'Cancelled upon request. Payment will be refunded.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
                Live Kitchen Status
              </span>
              <span
                className={`text-xs font-black uppercase px-2.5 py-1 rounded-full ${
                  isReady
                    ? 'bg-emerald-500 text-white animate-soft-pulse'
                    : isCollected
                    ? 'bg-charcoal-200 text-charcoal-700'
                    : isPendingVerification
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-brand-500 text-white'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>

            {/* Stepper Grid */}
            <div className="relative">
              <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-cream-200 -z-0">
                <div
                  className="h-full bg-brand-500 transition-all duration-500"
                  style={{
                    width: `${(Math.max(0, currentStageIndex) / (STAGES.length - 1)) * 100}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 relative z-10">
                {STAGES.map((st, idx) => {
                  const isDone = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div
                      key={st.key}
                      className={`flex sm:flex-col items-center sm:text-center gap-3 p-3 sm:p-0 rounded-2xl sm:rounded-none transition-all ${
                        isCurrent
                          ? 'bg-brand-50/70 sm:bg-transparent border sm:border-none border-brand-200'
                          : ''
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 transition-all shadow-sm ${
                          isDone
                            ? 'bg-brand-500 text-white ring-4 ring-brand-100'
                            : 'bg-white border-2 border-cream-300 text-charcoal-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>

                      <div className="min-w-0">
                        <h4
                          className={`text-xs font-bold leading-tight ${
                            isCurrent
                              ? 'text-brand-600 font-extrabold'
                              : isDone
                              ? 'text-charcoal-900'
                              : 'text-charcoal-400'
                          }`}
                        >
                          {st.label}
                        </h4>
                        <p className="text-[10px] text-charcoal-500 mt-0.5 line-clamp-2 hidden sm:block">
                          {st.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Status Callout Card for Ready State */}
        {isReady && (
          <div className="p-5 rounded-2xl bg-emerald-500 text-white shadow-elevated flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Ready Now
              </div>
              <h3 className="text-base font-extrabold">Your Food is Hot & Ready at Counter!</h3>
              <p className="text-xs text-emerald-100">
                Head to {order.canteenName} (Express Counter). Show token <strong>{order.tokenNumber}</strong> for instant 15-second pickup.
              </p>
            </div>

            <button
              onClick={() => onOpenToken(order)}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-md hover:bg-emerald-50 transition-colors"
            >
              Open QR
            </button>
          </div>
        )}

        {/* Order Items Breakdown */}
        <div className="space-y-3 pt-4 border-t border-cream-200">
          <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
            Items in this Order
          </span>

          <div className="divide-y divide-cream-100">
            {order.items.map((i, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-cream-100 text-charcoal-700 font-bold flex items-center justify-center text-[11px]">
                    {i.quantity}×
                  </span>
                  <span className="font-bold text-charcoal-900">{i.foodItem.name}</span>
                </div>
                <span className="font-semibold text-charcoal-700">
                  ₹{i.foodItem.price * i.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-cream-200 flex items-center justify-between text-xs">
            <span className="font-bold text-charcoal-500">Total Amount</span>
            <span className="text-sm font-black text-charcoal-900">
              ₹{order.totalAmount} • {order.paymentMethod} ({order.paymentStatus})
            </span>
          </div>

          {order.utrReference && (
            <div className="text-[11px] text-charcoal-500 flex justify-between">
              <span>UPI UTR Reference:</span>
              <span className="font-mono font-bold text-charcoal-800">{order.utrReference}</span>
            </div>
          )}
        </div>

        {/* Post-Pickup Experience Rating (if Collected) */}
        {isCollected && (
          <div className="p-6 rounded-3xl bg-cream-50 border border-cream-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-charcoal-900">
                  Rate Your BreakBite Experience
                </h3>
                <p className="text-xs text-charcoal-500 mt-0.5">
                  Did you skip the queue in 15 seconds?
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                Collected
              </span>
            </div>

            {order.rating || ratingSubmitted ? (
              <div className="p-4 bg-white rounded-2xl border border-cream-200 text-xs">
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-4 h-4 ${
                        s <= (order.rating?.score || ratingScore)
                          ? 'fill-amber-500'
                          : 'text-charcoal-300'
                      }`}
                    />
                  ))}
                  <span className="font-bold text-charcoal-800 ml-2">
                    {order.rating?.score || ratingScore}/5 Stars
                  </span>
                </div>
                <p className="text-charcoal-600 italic">
                  "{order.rating?.comment || ratingComment || 'Great fast campus pickup!'}"
                </p>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="space-y-3">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingScore(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= ratingScore
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-charcoal-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  placeholder="Share quick feedback (e.g. Samosa was sizzling hot, zero line!)..."
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                />

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-charcoal-900 text-white text-xs font-bold hover:bg-charcoal-800"
                >
                  Submit Review
                </button>
              </form>
            )}

            <button
              onClick={() => reorderPastOrder(order.id)}
              className="w-full py-2.5 rounded-xl border border-cream-300 hover:bg-cream-100 text-xs font-bold text-charcoal-700 flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder This Meal Again</span>
            </button>
          </div>
        )}

        {/* Cancellation option if still placed and not verified */}
        {order.orderStatus === 'placed' && (
          <div className="pt-2 text-right">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel this order?')) {
                  cancelOrder(order.id, 'Cancelled by student before kitchen preparation');
                }
              }}
              className="text-xs font-semibold text-red-500 hover:text-red-700"
            >
              Cancel Order (Eligible before preparation begins)
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
