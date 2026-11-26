import React from 'react';
import {
  Clock,
  Sparkles,
  ShoppingBag,
  Flame,
  Star,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  RotateCcw,
  Users,
  AlertCircle,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { FoodItem } from '../../types';

interface StudentHomeProps {
  onStartOrdering: (canteenId?: string) => void;
  onOpenTracker: (orderId: string) => void;
  onOpenGroupOrder: () => void;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  onStartOrdering,
  onOpenTracker,
  onOpenGroupOrder,
}) => {
  const {
    currentUser,
    canteens,
    foodItems,
    orders,
    breakSchedules,
    addToCart,
    reorderPastOrder,
    getCanteenRush,
  } = useBreakBite();

  // Find active orders for current student
  const studentActiveOrders = orders.filter(
    (o) =>
      o.studentId === currentUser.id &&
      o.orderStatus !== 'collected' &&
      o.orderStatus !== 'cancelled'
  );

  const pastOrders = orders.filter(
    (o) => o.studentId === currentUser.id && o.orderStatus === 'collected'
  );

  // Lunch break default
  const nextBreak = breakSchedules.find((b) => b.id === 'break-2') || breakSchedules[0];

  // Featured items
  const popularItems = foodItems.filter((i) => i.isBestSeller).slice(0, 4);

  return (
    <div className="space-y-8 pb-12">
      {/* Top Personalized Greeting & Next Break Banner */}
      <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-elevated">
        {/* Glow orb */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-charcoal-700/80 border border-charcoal-600 text-brand-400 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span>Demo University • Academic Session</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good afternoon, {currentUser.name}! 👋
          </h1>
          
          <p className="text-sm text-cream-200 mt-2 leading-relaxed">
            Your next break starts at <strong>{nextBreak.startTime}</strong> ({nextBreak.name}).
            Don’t waste it standing in a queue. Pre-order now and collect right when the bell rings.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onStartOrdering('canteen-1')}
              className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Order For {nextBreak.startTime} Break</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenGroupOrder}
              className="px-5 py-3 rounded-2xl bg-charcoal-700/90 hover:bg-charcoal-600 text-cream-100 font-semibold text-sm border border-charcoal-600 flex items-center gap-2 transition-colors"
            >
              <Users className="w-4 h-4 text-brand-400" />
              <span>Start Group Order</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Orders Quick Status Alert Banner */}
      {studentActiveOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              Your Active Scheduled Orders ({studentActiveOrders.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studentActiveOrders.map((order) => {
              const isReady = order.orderStatus === 'ready';
              return (
                <div
                  key={order.id}
                  onClick={() => onOpenTracker(order.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 shadow-subtle ${
                    isReady
                      ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white border-cream-300 hover:border-brand-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm shrink-0 ${
                        isReady
                          ? 'bg-emerald-500 text-white animate-soft-pulse'
                          : 'bg-charcoal-900 text-white'
                      }`}
                    >
                      {order.tokenNumber}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-charcoal-900">
                          {order.canteenName}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            isReady
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>
                      <div className="text-xs text-charcoal-500 mt-0.5">
                        Pickup Slot: <strong>{order.pickupTime}</strong> • {order.items.length} items (₹{order.totalAmount})
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-brand-600 shrink-0">
                    <span>Track</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Campus Canteens & Live Rush Indicators */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900">
              Campus Dining Counters & Rush Level
            </h2>
            <p className="text-xs text-charcoal-500">
              Select a counter to browse menu and pre-order.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {canteens.map((canteen) => {
            const rush = getCanteenRush(canteen.id);
            return (
              <div
                key={canteen.id}
                onClick={() => onStartOrdering(canteen.id)}
                className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card hover:shadow-elevated transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="h-40 relative overflow-hidden bg-cream-200">
                    <img
                      src={canteen.image}
                      alt={canteen.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md backdrop-blur-md ${
                          rush === 'low'
                            ? 'bg-emerald-500/90 text-white'
                            : rush === 'moderate'
                            ? 'bg-amber-500/90 text-charcoal-900'
                            : 'bg-red-500/90 text-white'
                        }`}
                      >
                        {rush === 'low' && '● Low Rush'}
                        {rush === 'moderate' && '● Moderate Rush'}
                        {rush === 'high' && '● High Rush'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 bg-charcoal-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {canteen.counterNumber}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-bold text-base text-charcoal-900 group-hover:text-brand-500 transition-colors">
                        {canteen.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-charcoal-700 bg-cream-100 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{canteen.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs text-charcoal-500 flex items-center gap-1 mb-3">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-charcoal-400" />
                      <span className="truncate">{canteen.location}</span>
                    </p>

                    <p className="text-xs text-charcoal-600 line-clamp-2 leading-relaxed">
                      {canteen.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2 border-t border-cream-100 flex items-center justify-between text-xs font-bold text-brand-600">
                  <span>Browse Counter Menu</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Campus Favorites — Quick Add Shelf */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900 flex items-center gap-2">
              <Flame className="w-5 h-5 text-brand-500" />
              <span>Campus Favorites (Ready in &lt;10 Mins)</span>
            </h2>
            <p className="text-xs text-charcoal-500">
              High-velocity break snacks popular among students.
            </p>
          </div>
          <button
            onClick={() => onStartOrdering()}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>View All Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-cream-200 overflow-hidden shadow-subtle hover:shadow-card transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-32 relative bg-cream-100 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 bg-charcoal-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock className="w-3 h-3 text-brand-400" />
                    {item.prepTimeMinutes}m prep
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="w-4 h-4 rounded-sm border border-emerald-600 bg-white flex items-center justify-center p-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-sm text-charcoal-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-charcoal-500 line-clamp-2 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 flex items-center justify-between">
                <div className="text-base font-black text-charcoal-900">
                  ₹{item.price}
                </div>
                <button
                  onClick={() => addToCart(item, 1)}
                  className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <span>+ Add to Tray</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Reorder from Past Meals */}
      {pastOrders.length > 0 && (
        <div className="p-6 rounded-3xl bg-cream-100/70 border border-cream-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-500" />
              <h3 className="font-bold text-sm text-charcoal-900">Quick Reorder Your Last Meal</h3>
            </div>
            <span className="text-xs text-charcoal-500 font-medium">
              1-Click Tray Load
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-cream-200">
            <div>
              <div className="text-xs font-bold text-charcoal-900">
                {pastOrders[0].items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
              </div>
              <div className="text-[11px] text-charcoal-500 mt-0.5">
                {pastOrders[0].canteenName} • ₹{pastOrders[0].totalAmount}
              </div>
            </div>

            <button
              onClick={() => reorderPastOrder(pastOrders[0].id)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reorder Meal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
