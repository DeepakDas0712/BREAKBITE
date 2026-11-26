import React, { useState } from 'react';
import {
  QrCode,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ArrowRight,
  Share2,
  X,
  Sparkles,
  Store,
} from 'lucide-react';
import { Order } from '../../types';

interface DigitalTokenModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTracker: (orderId: string) => void;
}

export const DigitalTokenModal: React.FC<DigitalTokenModalProps> = ({
  order,
  isOpen,
  onClose,
  onOpenTracker,
}) => {
  const [copied, setCopied] = useState(false);
  const [fullscreenCounterMode, setFullscreenCounterMode] = useState(false);

  if (!isOpen || !order) return null;

  const isReady = order.orderStatus === 'ready';
  const isCollected = order.orderStatus === 'collected';
  const isPreparing = order.orderStatus === 'preparing';

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(order.tokenNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md animate-fade-in">
      <div
        className={`bg-white rounded-3xl w-full transition-all border border-cream-200 overflow-hidden shadow-floating flex flex-col ${
          fullscreenCounterMode
            ? 'max-w-md h-[95vh] justify-between p-6'
            : 'max-w-md max-h-[92vh]'
        }`}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-charcoal-900 text-white flex items-center justify-center font-bold text-xs shadow-sm">
              BB
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-charcoal-900 block">
                BreakBite Digital Token
              </span>
              <span className="text-[10px] text-charcoal-400">
                Official Campus Express Pass
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setFullscreenCounterMode(!fullscreenCounterMode)}
              className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200"
              title={fullscreenCounterMode ? 'Exit Fullscreen' : 'Fullscreen Counter Mode'}
            >
              {fullscreenCounterMode ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-cream-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Token Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-center">
          
          {/* Status Badge */}
          <div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                isReady
                  ? 'bg-emerald-500 text-white animate-soft-pulse shadow-md shadow-emerald-500/20'
                  : isCollected
                  ? 'bg-charcoal-200 text-charcoal-700'
                  : isPreparing
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-brand-100 text-brand-800 border border-brand-200'
              }`}
            >
              {isReady && <span className="w-2 h-2 rounded-full bg-white animate-ping" />}
              <span>Status: {order.orderStatus.toUpperCase()}</span>
            </span>
          </div>

          {/* Large Token Hero Card */}
          <div className="bg-gradient-to-br from-charcoal-900 to-charcoal-800 text-white p-6 rounded-3xl shadow-elevated relative overflow-hidden">
            <div className="text-[11px] font-bold uppercase tracking-widest text-charcoal-400">
              Unique Order Token
            </div>
            
            <div className="text-4xl sm:text-5xl font-black tracking-tight text-white my-1 font-mono flex items-center justify-center gap-2">
              <span>{order.tokenNumber}</span>
              <button
                onClick={handleCopyToken}
                className="p-1.5 rounded-lg bg-charcoal-700/80 hover:bg-charcoal-600 text-cream-200 text-xs"
                title="Copy token code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="mt-2 text-xs text-cream-200 flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-brand-400" />
              <span>Pickup: <strong>{order.pickupTime}</strong></span>
              <span>•</span>
              <span>{order.breakName}</span>
            </div>

            {/* QR Code Container */}
            <div className="mt-5 p-3 bg-white rounded-2xl inline-block shadow-inner ring-4 ring-charcoal-700">
              {order.qrDataUrl ? (
                <img
                  src={order.qrDataUrl}
                  alt={`QR code for token ${order.tokenNumber}`}
                  className="w-44 h-44 sm:w-48 sm:h-48 mx-auto"
                />
              ) : (
                <div className="w-44 h-44 bg-charcoal-100 flex items-center justify-center text-charcoal-500 font-mono text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            <div className="mt-3 text-[11px] text-charcoal-300">
              Flash this QR code at the counter for 15-second pickup
            </div>
          </div>

          {/* Location & Summary Details */}
          <div className="bg-cream-50 rounded-2xl p-4 border border-cream-200 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <span className="text-charcoal-500 font-medium">Counter Location</span>
              <span className="font-extrabold text-charcoal-900">{order.canteenName}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <span className="text-charcoal-500 font-medium">Estimated Food Ready</span>
              <span className="font-bold text-emerald-700">{order.estimatedReadyTime}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-cream-200">
              <span className="text-charcoal-500 font-medium">Payment</span>
              <span className="font-bold text-charcoal-900">
                ₹{order.totalAmount} • {order.paymentMethod} ({order.paymentStatus})
              </span>
            </div>

            {/* Items summary */}
            <div className="pt-1">
              <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-1">
                Ordered Items:
              </span>
              <div className="space-y-1">
                {order.items.map((i, idx) => (
                  <div key={idx} className="flex justify-between text-charcoal-700">
                    <span>
                      {i.quantity}x {i.foodItem.name}
                    </span>
                    <span className="font-medium text-charcoal-900">
                      ₹{i.foodItem.price * i.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-5 border-t border-cream-200 bg-white flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenTracker(order.id);
            }}
            className="w-full px-5 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
          >
            <span>Track Live Order Progress</span>
            <ArrowRight className="w-4 h-4 text-brand-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
