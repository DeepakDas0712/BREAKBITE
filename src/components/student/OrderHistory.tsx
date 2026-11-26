import React from 'react';
import {
  Clock,
  RotateCcw,
  CheckCircle2,
  XCircle,
  QrCode,
  Star,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Order } from '../../types';

interface OrderHistoryProps {
  onOpenToken: (order: Order) => void;
  onOpenTracker: (orderId: string) => void;
  onBrowseMenu: () => void;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  onOpenToken,
  onOpenTracker,
  onBrowseMenu,
}) => {
  const { currentUser, orders, reorderPastOrder } = useBreakBite();

  // Orders for current student
  const studentOrders = orders.filter((o) => o.studentId === currentUser.id);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            Your Campus Meals History
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            View past digital tokens, reorder previous favorites, or track active tickets.
          </p>
        </div>
        <button
          onClick={onBrowseMenu}
          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>New Pre-Order</span>
        </button>
      </div>

      {studentOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-200">
          <ShoppingBag className="w-10 h-10 text-charcoal-400 mx-auto mb-2" />
          <h3 className="font-bold text-sm text-charcoal-900">No past orders yet</h3>
          <p className="text-xs text-charcoal-500 mt-1">
            Pre-order before your next class break to save your time.
          </p>
          <button
            onClick={onBrowseMenu}
            className="mt-4 px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {studentOrders.map((order) => {
            const isCollected = order.orderStatus === 'collected';
            const isCancelled = order.orderStatus === 'cancelled';
            const isReady = order.orderStatus === 'ready';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-cream-200 p-5 sm:p-6 shadow-card hover:shadow-elevated transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-cream-100">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-black text-charcoal-900 bg-cream-100 px-3 py-1 rounded-xl">
                      {order.tokenNumber}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-charcoal-900">{order.canteenName}</h3>
                      <span className="text-[11px] text-charcoal-500">
                        Pickup: {order.pickupTime} ({order.breakName})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                        isReady
                          ? 'bg-emerald-500 text-white animate-soft-pulse'
                          : isCollected
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-red-100 text-red-800'
                          : 'bg-brand-100 text-brand-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-xs font-bold text-charcoal-900">
                      ₹{order.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-1 text-xs">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-charcoal-700">
                      <span>
                        {item.quantity}× {item.foodItem.name}
                      </span>
                      <span className="text-charcoal-500">
                        ₹{item.foodItem.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Rating if present */}
                {order.rating && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-600 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Rated {order.rating.score}/5 Stars:</span>
                    <span className="italic text-charcoal-600 truncate max-w-sm">
                      "{order.rating.comment}"
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-2 border-t border-cream-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-charcoal-400">
                    Payment: {order.paymentMethod} • {order.paymentStatus}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenToken(order)}
                      className="px-3 py-1.5 rounded-xl border border-cream-300 text-charcoal-700 hover:bg-cream-100 font-bold text-xs flex items-center gap-1.5"
                    >
                      <QrCode className="w-3.5 h-3.5 text-brand-500" />
                      <span>View Token</span>
                    </button>

                    <button
                      onClick={() => onOpenTracker(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <span>Track Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => reorderPastOrder(order.id)}
                      className="px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      title="Add identical items to tray"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
