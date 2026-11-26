import React, { useMemo } from 'react';
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Flame,
  Info,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { PickupSlot } from '../../types';

interface SmartSchedulerProps {
  onConfirmSlot?: () => void;
  onClose?: () => void;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  onConfirmSlot,
  onClose,
}) => {
  const {
    breakSchedules,
    selectedBreakId,
    setSelectedBreakId,
    selectedPickupSlot,
    setSelectedPickupSlot,
    selectedCanteenId,
    canteens,
    cart,
    getAvailablePickupSlots,
    capacitySettings,
  } = useBreakBite();

  const selectedCanteen =
    canteens.find((c) => c.id === selectedCanteenId) || canteens[0];
  const activeBreak =
    breakSchedules.find((b) => b.id === selectedBreakId) || breakSchedules[1];

  // Calculate cumulative preparation requirement
  const maxItemPrepTime = useMemo(() => {
    if (cart.length === 0) return 6; // default 6 mins
    return cart.reduce(
      (max, ci) => Math.max(max, ci.foodItem.prepTimeMinutes),
      5
    );
  }, [cart]);

  const totalItemsCount = useMemo(() => {
    return cart.reduce((acc, ci) => acc + ci.quantity, 0);
  }, [cart]);

  // Buffer calculation based on items count
  const estimatedKitchenPrepMinutes = Math.min(
    25,
    maxItemPrepTime + Math.floor(totalItemsCount / 3) * 2
  );

  // Get dynamic slot capacities
  const availableSlots: PickupSlot[] = useMemo(() => {
    return getAvailablePickupSlots(selectedBreakId, selectedCanteenId, cart);
  }, [selectedBreakId, selectedCanteenId, cart, getAvailablePickupSlots]);

  const handleSelectSlot = (slot: PickupSlot) => {
    if (slot.status === 'full') return;
    setSelectedPickupSlot(slot.timeString);
  };

  return (
    <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between pb-4 border-b border-cream-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Capacity-Allocated Scheduling Engine
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-charcoal-900 tracking-tight">
            Schedule Your Campus Pickup
          </h2>
          <p className="text-xs text-charcoal-500 mt-1">
            Pick your break window and exact 5-minute counter collection slot.
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-100 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Date & Campus Counter Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-cream-50 border border-cream-200 text-xs">
        <div className="flex items-center gap-2 text-charcoal-700">
          <Calendar className="w-4 h-4 text-brand-500" />
          <span>
            <strong>Date:</strong> Today (Campus Timetable Active)
          </span>
        </div>
        <div className="flex items-center gap-2 text-charcoal-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            <strong>Counter:</strong> {selectedCanteen.name} ({selectedCanteen.counterNumber})
          </span>
        </div>
      </div>

      {/* 1. SELECT UNIVERSITY BREAK */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500 block">
          1. Select University Break Window
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {breakSchedules.map((b) => {
            const isSelected = b.id === selectedBreakId;
            return (
              <button
                key={b.id}
                onClick={() => {
                  setSelectedBreakId(b.id);
                  // Default to first available slot in that break
                  const slots = getAvailablePickupSlots(b.id, selectedCanteenId, cart);
                  const firstAvail = slots.find((s) => s.status !== 'full');
                  if (firstAvail) setSelectedPickupSlot(firstAvail.timeString);
                }}
                className={`p-4 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-charcoal-900 text-white border-charcoal-900 shadow-md ring-2 ring-brand-500/30'
                    : 'bg-white hover:bg-cream-100 text-charcoal-700 border-cream-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">{b.name}</span>
                  {b.isDefault && (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        isSelected ? 'bg-brand-500 text-white' : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      Peak Rush
                    </span>
                  )}
                </div>
                <div className={`text-xs font-mono mt-1 ${isSelected ? 'text-cream-200' : 'text-charcoal-500'}`}>
                  {b.startTime} – {b.endTime}
                </div>
                <p className={`text-[11px] mt-2 line-clamp-1 ${isSelected ? 'text-charcoal-400' : 'text-charcoal-400'}`}>
                  {b.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. CHOOSE 5-MINUTE PICKUP SLOT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
            2. Choose Available 5-Minute Pickup Slot
          </label>
          <div className="flex items-center gap-3 text-[11px] text-charcoal-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Limited
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-400"></span>
              Full
            </span>
          </div>
        </div>

        {/* Slot Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {availableSlots.map((slot) => {
            const isSelected = selectedPickupSlot === slot.timeString;
            const isFull = slot.status === 'full';
            const isLimited = slot.status === 'limited';

            return (
              <button
                key={slot.id}
                disabled={isFull}
                onClick={() => handleSelectSlot(slot)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative ${
                  isFull
                    ? 'bg-cream-100/60 border-cream-200 text-charcoal-400 cursor-not-allowed opacity-60'
                    : isSelected
                    ? 'bg-brand-500 text-white border-brand-600 shadow-md ring-2 ring-brand-500/20 scale-102'
                    : 'bg-white hover:bg-brand-50/40 text-charcoal-800 border-cream-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm">{slot.timeString}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isFull
                        ? 'bg-red-400'
                        : isLimited
                        ? isSelected ? 'bg-white' : 'bg-amber-500'
                        : isSelected ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                </div>

                <div className="text-[11px] font-medium">
                  {isFull ? (
                    <span className="text-red-500 font-bold">Fully Booked</span>
                  ) : isLimited ? (
                    <span className={isSelected ? 'text-white' : 'text-amber-700 font-bold'}>
                      Limited ({slot.maxCapacity - slot.currentBooked} left)
                    </span>
                  ) : (
                    <span className={isSelected ? 'text-white' : 'text-emerald-700'}>
                      Available
                    </span>
                  )}
                </div>

                {/* Capacity mini bar */}
                <div className="w-full bg-black/10 rounded-full h-1 mt-2 overflow-hidden">
                  <div
                    className={`h-full ${
                      isSelected ? 'bg-white' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (slot.currentBooked / slot.maxCapacity) * 100)}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KITCHEN CAPACITY & PREPARATION INTELLIGENCE BANNER */}
      <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-xs space-y-2">
        <div className="flex items-start gap-2.5 text-brand-900">
          <Info className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="font-bold">
              Kitchen Preparation Buffer: ~{estimatedKitchenPrepMinutes} Minutes
            </span>
            <p className="text-brand-800 text-[11px] leading-relaxed">
              Based on your tray items ({totalItemsCount} items), our kitchen starts frying and preparing at least {estimatedKitchenPrepMinutes} minutes before your selected {selectedPickupSlot || '12:30 PM'} slot to guarantee hot, crisp food.
            </p>
          </div>
        </div>

        <div className="text-[10px] text-brand-700 font-medium pt-1 border-t border-brand-200/60 flex items-center justify-between">
          <span>Counter Capacity Cap: 15 orders / 5 min (Zero Queue Guarantee)</span>
          <span>Buffer: Insulated hold up to 15m</span>
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="pt-2 flex items-center justify-end gap-3">
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-cream-300 text-xs font-bold text-charcoal-700 hover:bg-cream-100"
          >
            Cancel
          </button>
        )}
        <button
          onClick={() => {
            if (onConfirmSlot) onConfirmSlot();
          }}
          disabled={!selectedPickupSlot}
          className="px-6 py-3 rounded-2xl bg-charcoal-900 hover:bg-charcoal-800 disabled:opacity-40 text-white font-bold text-xs shadow-md flex items-center gap-2"
        >
          <span>Confirm Slot ({selectedPickupSlot || 'Select Slot'})</span>
          <ArrowRight className="w-4 h-4 text-brand-400" />
        </button>
      </div>
    </div>
  );
};
