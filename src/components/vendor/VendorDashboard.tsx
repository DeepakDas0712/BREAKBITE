import React, { useState, useMemo } from 'react';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Flame,
  TrendingUp,
  PackageCheck,
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  Sliders,
  DollarSign,
  Coffee,
  Calendar,
  Check,
  Search,
  Camera,
  RefreshCw,
  BarChart3,
  Leaf,
  Users,
  Smartphone,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Settings,
  Eye,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Order, OrderStatus, FoodItem } from '../../types';
import { PAYMENT_CONFIG } from '../../config/paymentConfig';

export const VendorDashboard: React.FC = () => {
  const {
    currentUser,
    canteens,
    foodItems,
    orders,
    updateOrderStatus,
    verifyVendorPayment,
    verifyAndCollectToken,
    toggleItemAvailability,
    updateItemPriceOrPrep,
    addFoodItem,
    capacitySettings,
    updateKitchenCapacity,
    breakSchedules,
    getCanteenRush,
  } = useBreakBite();

  const [activeVendorTab, setActiveVendorTab] = useState<
    | 'overview'
    | 'new-orders'
    | 'confirmed'
    | 'scheduled'
    | 'ready'
    | 'completed'
    | 'menu'
    | 'capacity'
    | 'scanner'
    | 'analytics'
    | 'settings'
  >('new-orders');

  // Scanner state
  const [tokenInput, setTokenInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    order?: Order;
  } | null>(null);

  // New item modal state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(30);
  const [newItemPrepTime, setNewItemPrepTime] = useState(8);
  const [newItemCategory, setNewItemCategory] = useState<any>('Snacks');

  const vendorCanteenId = currentUser.canteenId || 'canteen-1';
  const canteen =
    canteens.find((c) => c.id === vendorCanteenId) || canteens[0];

  // Filter orders belonging to this canteen
  const canteenOrders = useMemo(() => {
    return orders.filter((o) => o.canteenId === vendorCanteenId);
  }, [orders, vendorCanteenId]);

  // Status-based subsets
  const pendingPaymentOrders = canteenOrders.filter(
    (o) => o.paymentStatus === 'verification_required'
  );

  const confirmedOrders = canteenOrders.filter(
    (o) =>
      o.orderStatus !== 'cancelled' &&
      o.orderStatus !== 'collected' &&
      o.paymentStatus !== 'verification_required'
  );

  const newIncomingOrders = canteenOrders.filter(
    (o) => o.orderStatus === 'placed'
  );

  const preparingOrders = canteenOrders.filter(
    (o) => o.orderStatus === 'preparing'
  );

  const readyOrders = canteenOrders.filter(
    (o) => o.orderStatus === 'ready'
  );

  const completedOrders = canteenOrders.filter(
    (o) => o.orderStatus === 'collected'
  );

  const todayRevenue = canteenOrders
    .filter((o) => o.paymentStatus === 'verified' && o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const rushLevel = getCanteenRush(vendorCanteenId);

  // Scheduled timeline analysis for today
  const timelineBuckets = useMemo(() => {
    const times = [
      '12:20 PM',
      '12:25 PM',
      '12:30 PM',
      '12:35 PM',
      '12:40 PM',
      '12:45 PM',
      '12:50 PM',
      '01:00 PM',
    ];
    return times.map((t) => {
      const matched = canteenOrders.filter(
        (o) => o.pickupTime === t && o.orderStatus !== 'cancelled'
      );
      return {
        time: t,
        count: matched.length,
        orders: matched,
      };
    });
  }, [canteenOrders]);

  // Analytics data
  const popularFoodData = useMemo(() => {
    const counts: Record<string, number> = {};
    canteenOrders.forEach((o) => {
      o.items.forEach((i) => {
        counts[i.foodItem.name] = (counts[i.foodItem.name] || 0) + i.quantity;
      });
    });
    return Object.entries(counts).map(([name, sales]) => ({ name, sales }));
  }, [canteenOrders]);

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    const res = verifyAndCollectToken(tokenInput.trim());
    setScanResult(res);
    if (res.success) {
      setTokenInput('');
    }
  };

  const handleAddItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addFoodItem({
      canteenId: vendorCanteenId,
      name: newItemName,
      description: 'Fresh campus specialty prepared on demand.',
      price: Number(newItemPrice),
      prepTimeMinutes: Number(newItemPrepTime),
      category: newItemCategory,
      isVeg: true,
      isAvailable: true,
      image:
        'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      calories: 250,
      tags: ['New Item'],
    });
    setIsAddingItem(false);
    setNewItemName('');
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Console Header */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Kitchen Operating Console
            </span>
            <span
              className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                rushLevel === 'low'
                  ? 'bg-emerald-100 text-emerald-800'
                  : rushLevel === 'moderate'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800 animate-pulse'
              }`}
            >
              Counter Rush: {rushLevel.toUpperCase()}
            </span>
          </div>

          <h1 className="text-2xl font-black text-charcoal-900 mt-1">
            {canteen.name} ({canteen.counterNumber})
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Operator: <strong>{currentUser.name}</strong> • Merchant VPA:{' '}
            <code className="text-brand-600 font-bold">{PAYMENT_CONFIG.upiId}</code>
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {pendingPaymentOrders.length > 0 && (
            <button
              onClick={() => setActiveVendorTab('new-orders')}
              className="px-3.5 py-2 rounded-xl bg-amber-500 text-charcoal-900 font-bold text-xs flex items-center gap-1.5 shadow-md animate-soft-pulse"
            >
              <Smartphone className="w-4 h-4" />
              <span>{pendingPaymentOrders.length} Verify Payment</span>
            </button>
          )}

          <button
            onClick={() => setActiveVendorTab('scanner')}
            className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <QrCode className="w-4 h-4 text-brand-400" />
            <span>Scan QR / Token</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cream-200">
        {[
          {
            id: 'new-orders',
            label: `New & Pending (${pendingPaymentOrders.length + newIncomingOrders.length})`,
          },
          { id: 'confirmed', label: `Confirmed (${confirmedOrders.length})` },
          { id: 'scheduled', label: 'Scheduled Timeline' },
          { id: 'ready', label: `Ready for Pickup (${readyOrders.length})` },
          { id: 'completed', label: `Completed (${completedOrders.length})` },
          { id: 'scanner', label: 'Token Verification' },
          { id: 'overview', label: 'Overview KPIs' },
          { id: 'menu', label: 'Menu & Inventory' },
          { id: 'capacity', label: 'Time Slot Capacity' },
          { id: 'analytics', label: 'Sales Analytics' },
        ].map((tab) => {
          const isActive = activeVendorTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveVendorTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-500 text-white shadow-subtle'
                  : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: NEW ORDERS & PENDING PAYMENT VERIFICATIONS */}
      {activeVendorTab === 'new-orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-charcoal-900">
                Incoming Tickets & Payment Verifications
              </h2>
              <p className="text-xs text-charcoal-500">
                Verify student UPI transaction references (UTR) before acknowledging tickets for food preparation.
              </p>
            </div>
            {pendingPaymentOrders.length > 0 && (
              <span className="text-xs font-black text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                {pendingPaymentOrders.length} Pending Verification
              </span>
            )}
          </div>

          {canteenOrders.filter(
            (o) => o.paymentStatus === 'verification_required' || o.orderStatus === 'placed'
          ).length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-cream-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-sm text-charcoal-900">All incoming tickets verified</h3>
              <p className="text-xs text-charcoal-500 mt-1">
                New student pre-orders will pop up here in real time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {canteenOrders
                .filter(
                  (o) =>
                    o.paymentStatus === 'verification_required' ||
                    o.orderStatus === 'placed'
                )
                .map((order) => {
                  const isVerificationReq = order.paymentStatus === 'verification_required';

                  return (
                    <div
                      key={order.id}
                      className={`bg-white rounded-3xl border overflow-hidden shadow-card flex flex-col justify-between ${
                        isVerificationReq
                          ? 'border-amber-300 ring-2 ring-amber-500/20'
                          : 'border-cream-200'
                      }`}
                    >
                      <div>
                        {/* Header */}
                        <div className="p-4 bg-cream-50 border-b border-cream-100 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-base font-black text-charcoal-900 bg-white px-2.5 py-1 rounded-lg border border-cream-200">
                              {order.tokenNumber}
                            </span>
                            <div className="text-xs font-bold text-charcoal-800 truncate max-w-[120px]">
                              {order.studentName}
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                              isVerificationReq
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {isVerificationReq ? 'Verify Payment' : 'New Ticket'}
                          </span>
                        </div>

                        {/* Order Details */}
                        <div className="p-4 space-y-3">
                          <div className="p-2.5 bg-cream-50 rounded-xl border border-cream-100 text-xs flex justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-charcoal-800">
                              <Clock className="w-3.5 h-3.5 text-brand-500" />
                              <span>Pickup: {order.pickupTime}</span>
                            </span>
                            <span className="font-extrabold text-charcoal-900">
                              ₹{order.totalAmount}
                            </span>
                          </div>

                          {/* UTR Verification Alert Box */}
                          {order.utrReference && (
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs space-y-1">
                              <span className="font-bold text-amber-900 block text-[11px]">
                                Submitted UPI UTR Reference:
                              </span>
                              <div className="flex items-center justify-between">
                                <code className="font-mono font-black text-sm text-charcoal-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                                  {order.utrReference}
                                </code>
                                <span className="text-[10px] text-amber-800 font-medium">
                                  Amount: ₹{order.totalAmount}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Items List */}
                          <div className="space-y-1 text-xs">
                            <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block">
                              Items:
                            </span>
                            {order.items.map((i, idx) => (
                              <div key={idx} className="flex justify-between text-charcoal-700">
                                <span>
                                  {i.quantity}× {i.foodItem.name}
                                </span>
                                <span className="text-charcoal-400">
                                  {i.foodItem.prepTimeMinutes}m prep
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-4 pt-2 border-t border-cream-100 bg-white flex flex-col gap-2">
                        {isVerificationReq ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => verifyVendorPayment(order.id, true)}
                              className="py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
                            >
                              <Check className="w-4 h-4" />
                              <span>Verify & Confirm</span>
                            </button>
                            <button
                              onClick={() => verifyVendorPayment(order.id, false)}
                              className="py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-bold text-xs transition-colors"
                            >
                              Reject UTR
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => updateOrderStatus(order.id, 'accepted')}
                              className="py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs transition-colors"
                            >
                              Accept Ticket
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, 'preparing')}
                              className="py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-charcoal-900 font-bold text-xs transition-colors"
                            >
                              Start Cooking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CONFIRMED ORDERS (READY FOR PREPARATION) */}
      {activeVendorTab === 'confirmed' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-charcoal-900">
                Confirmed Kitchen Tickets
              </h2>
              <p className="text-xs text-charcoal-500">
                Payment verified orders. Progress them from In Kitchen to Ready.
              </p>
            </div>
            <span className="text-xs font-bold text-charcoal-500 bg-cream-100 px-3 py-1 rounded-full">
              {confirmedOrders.length} Confirmed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {confirmedOrders.map((order) => {
              const isAccepted = order.orderStatus === 'accepted';
              const isPreparing = order.orderStatus === 'preparing';
              const isReady = order.orderStatus === 'ready';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card flex flex-col justify-between"
                >
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-cream-100">
                      <span className="font-mono text-base font-black text-charcoal-900">
                        {order.tokenNumber}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          isReady
                            ? 'bg-emerald-500 text-white'
                            : isPreparing
                            ? 'bg-amber-500 text-charcoal-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>

                    <div className="flex justify-between text-xs text-charcoal-700">
                      <span>Pickup: <strong>{order.pickupTime}</strong></span>
                      <span className="font-bold text-emerald-700">✓ Payment Verified</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-charcoal-800">
                          <span>
                            {i.quantity}× {i.foodItem.name}
                          </span>
                          <span className="text-charcoal-400">
                            {i.foodItem.prepTimeMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    {isAccepted && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'preparing')}
                        className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-charcoal-900 font-bold text-xs"
                      >
                        Start Cooking / Frying
                      </button>
                    )}

                    {isPreparing && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'ready')}
                        className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                      >
                        Mark Ready for Pickup ✓
                      </button>
                    )}

                    {isReady && (
                      <button
                        onClick={() => verifyAndCollectToken(order.tokenNumber)}
                        className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify & Complete Pickup</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SCHEDULED ORDERS TIMELINE */}
      {activeVendorTab === 'scheduled' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900">
              Scheduled Order Timeline (Break Demand Distribution)
            </h2>
            <p className="text-xs text-charcoal-500">
              Visual 5-minute workload buckets. Shows how many meals to cook for each wave.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timelineBuckets.map((bucket) => {
              const loadPercent = Math.min(
                100,
                (bucket.count / capacitySettings.maxOrdersPerSlot) * 100
              );
              const isHeavy = bucket.count >= capacitySettings.maxOrdersPerSlot - 3;

              return (
                <div
                  key={bucket.time}
                  className={`bg-white rounded-3xl border p-5 shadow-subtle ${
                    isHeavy ? 'border-amber-300 ring-2 ring-amber-500/20' : 'border-cream-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-black text-sm text-charcoal-900">
                      {bucket.time}
                    </span>
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        bucket.count === 0
                          ? 'bg-cream-100 text-charcoal-400'
                          : isHeavy
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {bucket.count} Orders
                    </span>
                  </div>

                  <div className="w-full bg-cream-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className={`h-full ${isHeavy ? 'bg-amber-500' : 'bg-brand-500'}`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>

                  <div className="mt-2 text-[11px] text-charcoal-500 flex justify-between">
                    <span>Capacity: {capacitySettings.maxOrdersPerSlot} max</span>
                    <span>{capacitySettings.maxOrdersPerSlot - bucket.count} open</span>
                  </div>

                  {bucket.orders.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-cream-100 space-y-1">
                      {bucket.orders.slice(0, 3).map((o) => (
                        <div key={o.id} className="text-[11px] text-charcoal-700 flex justify-between">
                          <span className="font-mono font-bold">{o.tokenNumber}</span>
                          <span className="text-charcoal-500 truncate max-w-[100px]">
                            {o.items.map((i) => i.foodItem.name).join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: READY FOR PICKUP */}
      {activeVendorTab === 'ready' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900">
              Orders Ready at Counter ({readyOrders.length})
            </h2>
            <p className="text-xs text-charcoal-500">
              Hot packaged orders awaiting student pickup. Flash QR or enter token to complete collection.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {readyOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border-2 border-emerald-400 p-5 shadow-card flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xl font-black text-charcoal-900">
                      {order.tokenNumber}
                    </span>
                    <span className="bg-emerald-500 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-full animate-soft-pulse">
                      Ready
                    </span>
                  </div>

                  <div className="text-xs text-charcoal-600">
                    <div>Student: <strong>{order.studentName}</strong></div>
                    <div>Pickup: <strong>{order.pickupTime}</strong></div>
                    <div className="text-emerald-700 font-bold mt-1">
                      Total: ₹{order.totalAmount} • {order.paymentMethod} Verified
                    </div>
                  </div>

                  <div className="p-2.5 bg-cream-50 rounded-xl text-xs space-y-1">
                    {order.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between text-charcoal-800">
                        <span>{i.quantity}× {i.foodItem.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-cream-100">
                  <button
                    onClick={() => verifyAndCollectToken(order.tokenNumber)}
                    className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verify & Mark Collected</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COMPLETED ORDERS */}
      {activeVendorTab === 'completed' && (
        <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-charcoal-900">
              Completed Orders Master Archive ({completedOrders.length})
            </h3>
            <span className="text-xs text-emerald-600 font-bold">100% Pickup Verified</span>
          </div>

          <div className="divide-y divide-cream-100">
            {completedOrders.map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-charcoal-900">{o.tokenNumber}</span>
                    <span className="font-medium text-charcoal-700">{o.studentName}</span>
                  </div>
                  <span className="text-[11px] text-charcoal-400 mt-0.5 block">
                    {o.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-charcoal-900">₹{o.totalAmount}</span>
                  <span className="text-[10px] text-charcoal-400 block">
                    Collected at {o.collectedAt ? new Date(o.collectedAt).toLocaleTimeString() : '12:35 PM'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: TOKEN QR SCANNER / VERIFICATION SCREEN */}
      {activeVendorTab === 'scanner' && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card text-center space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Express Counter Verification
              </span>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mt-2">
                Scan or Enter Order Token
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Validates order existence, checks payment verification, and prevents duplicate pickup.
              </p>
            </div>

            {/* Simulated Viewfinder */}
            <div className="relative w-64 h-64 mx-auto rounded-3xl bg-charcoal-900 overflow-hidden shadow-inner flex flex-col items-center justify-center text-white border-4 border-charcoal-800">
              <div className="w-44 h-44 border-2 border-brand-500/80 rounded-2xl relative flex items-center justify-center">
                <div className="w-full h-0.5 bg-brand-500 shadow-lg shadow-brand-500 animate-pulse absolute top-1/2 -translate-y-1/2" />
                <QrCode className="w-16 h-16 text-white/30" />
              </div>

              <div className="absolute bottom-3 text-[11px] text-cream-200 font-medium flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-brand-400" />
                <span>Camera Viewfinder Active</span>
              </div>
            </div>

            {/* Manual Token Input */}
            <form onSubmit={handleManualScan} className="space-y-3">
              <label className="text-xs font-bold text-charcoal-700 block">
                Or Type Token (e.g. BB-2026-1021)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="e.g. BB-2026-1021"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="flex-1 text-center font-mono text-lg font-black tracking-widest p-3 rounded-2xl border border-cream-300 focus:outline-none focus:ring-2 focus:ring-brand-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md transition-colors"
                >
                  Verify Token
                </button>
              </div>
            </form>

            {/* Quick Demo Tokens */}
            <div className="pt-2 text-left">
              <span className="text-[10px] font-bold text-charcoal-400 uppercase tracking-wider block mb-2">
                Quick Test Existing Tokens:
              </span>
              <div className="flex flex-wrap gap-2">
                {canteenOrders.slice(0, 4).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      setTokenInput(o.tokenNumber);
                      const res = verifyAndCollectToken(o.tokenNumber);
                      setScanResult(res);
                    }}
                    className="text-xs font-mono font-bold bg-cream-100 hover:bg-brand-100 hover:text-brand-800 text-charcoal-700 px-3 py-1.5 rounded-xl border border-cream-200 transition-colors"
                  >
                    {o.tokenNumber} ({o.orderStatus})
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Feedback */}
            {scanResult && (
              <div
                className={`p-4 rounded-2xl text-left border text-xs space-y-2 ${
                  scanResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-sm">
                  {scanResult.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span>{scanResult.success ? 'Token Verified!' : 'Validation Warning'}</span>
                </div>
                <p className="text-xs leading-relaxed">{scanResult.message}</p>

                {scanResult.order && (
                  <div className="pt-2 border-t border-black/10 text-[11px] font-medium space-y-1">
                    <div>
                      Student: <strong>{scanResult.order.studentName}</strong> • Items:{' '}
                      {scanResult.order.items.map((i) => `${i.quantity}x ${i.foodItem.name}`).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 7: OVERVIEW KPIS */}
      {activeVendorTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Today’s Verified Revenue
              </span>
              <div className="text-3xl font-black text-charcoal-900 mt-1">₹{todayRevenue}</div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Verified UPI & counter receipts
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Pending Verifications
              </span>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {pendingPaymentOrders.length}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                Awaiting UTR check
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Ready at Counter
              </span>
              <div className="text-3xl font-black text-emerald-600 mt-1">
                {readyOrders.length}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                Insulated heating hold
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Completed Pickups
              </span>
              <div className="text-3xl font-black text-charcoal-900 mt-1">
                {completedOrders.length}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                15-second average speed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 8: MENU MANAGEMENT */}
      {activeVendorTab === 'menu' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-charcoal-900">
                Menu & Real-Time Counter Availability
              </h2>
              <p className="text-xs text-charcoal-500">
                Toggle stock availability or adjust preparation timings for rush periods.
              </p>
            </div>

            <button
              onClick={() => setIsAddingItem(true)}
              className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Add Item</span>
            </button>
          </div>

          {isAddingItem && (
            <form
              onSubmit={handleAddItemSubmit}
              className="p-5 rounded-3xl bg-cream-50 border border-brand-200 space-y-4"
            >
              <h3 className="text-sm font-bold text-charcoal-900">Add New Campus Product</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Bun Maska)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                  required
                />
                <input
                  type="number"
                  placeholder="Prep time (mins)"
                  value={newItemPrepTime}
                  onChange={(e) => setNewItemPrepTime(Number(e.target.value))}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                  required
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value as any)}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                >
                  <option value="Snacks">Snacks</option>
                  <option value="Breakfast">Breakfast</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Meals">Meals</option>
                  <option value="South Indian">South Indian</option>
                  <option value="North Indian">North Indian</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingItem(false)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-500 text-white text-xs font-bold hover:bg-brand-600"
                >
                  Save Item
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card">
            <div className="divide-y divide-cream-100">
              {foodItems
                .filter((item) => item.canteenId === vendorCanteenId)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover ring-1 ring-cream-200"
                      />
                      <div>
                        <h4 className="font-bold text-sm text-charcoal-900">{item.name}</h4>
                        <span className="text-xs text-charcoal-500">
                          ₹{item.price} • {item.prepTimeMinutes}m prep • {item.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => toggleItemAvailability(item.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                          item.isAvailable
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {item.isAvailable ? 'In Stock (Available)' : 'Sold Out (Hidden)'}
                      </button>

                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-charcoal-400">Prep Time:</label>
                        <input
                          type="number"
                          value={item.prepTimeMinutes}
                          onChange={(e) =>
                            updateItemPriceOrPrep(
                              item.id,
                              item.price,
                              Math.max(1, Number(e.target.value))
                            )
                          }
                          className="w-14 p-1.5 text-xs text-center border border-cream-300 rounded-lg"
                        />
                        <span className="text-xs text-charcoal-400">m</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 9: TIME SLOT & CAPACITY MANAGEMENT */}
      {activeVendorTab === 'capacity' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Operating Hours & Capacity Limits
              </span>
              <h2 className="text-2xl font-extrabold text-charcoal-900 mt-2">
                Pickup Slot Capacity Management
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Configure your counter's capacity. When a 5-minute slot hits its cap, BreakBite disables further student pre-orders.
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-charcoal-900 mb-1.5">
                  <span>Maximum Orders Per 5-Minute Slot:</span>
                  <span className="text-brand-600 font-black text-sm">
                    {capacitySettings.maxOrdersPerSlot} orders / slot
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  value={capacitySettings.maxOrdersPerSlot}
                  onChange={(e) =>
                    updateKitchenCapacity({ maxOrdersPerSlot: Number(e.target.value) })
                  }
                  className="w-full accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-charcoal-900 mb-1.5">
                  <span>Pickup Interval:</span>
                  <span className="text-brand-600 font-black text-sm">
                    {capacitySettings.slotIntervalMinutes} Minutes
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[5, 10, 15].map((int) => (
                    <button
                      key={int}
                      type="button"
                      onClick={() => updateKitchenCapacity({ slotIntervalMinutes: int })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        capacitySettings.slotIntervalMinutes === int
                          ? 'bg-charcoal-900 text-white border-charcoal-900'
                          : 'bg-white border-cream-300 text-charcoal-700'
                      }`}
                    >
                      {int} Min Intervals
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-charcoal-900 mb-1.5">
                  <span>Advance Preparation Buffer:</span>
                  <span className="text-brand-600 font-black text-sm">
                    {capacitySettings.bufferMinutes} Minutes Prior
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="15"
                  value={capacitySettings.bufferMinutes}
                  onChange={(e) =>
                    updateKitchenCapacity({ bufferMinutes: Number(e.target.value) })
                  }
                  className="w-full accent-brand-500"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Zero Queue Cap Active:</strong> Once a slot hits {capacitySettings.maxOrdersPerSlot} bookings, it automatically turns red/disabled on the student app.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: SALES ANALYTICS */}
      {activeVendorTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
              <h3 className="font-extrabold text-sm text-charcoal-900">
                Most Popular Food Items
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={popularFoodData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9DE" />
                    <XAxis dataKey="name" stroke="#8592A0" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8592A0" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131619',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="sales" fill="#FF5722" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
              <h3 className="font-extrabold text-sm text-charcoal-900">
                Scheduled Slot Distribution
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={timelineBuckets}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9DE" />
                    <XAxis dataKey="time" stroke="#8592A0" fontSize={11} tickLine={false} />
                    <YAxis stroke="#8592A0" fontSize={11} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131619',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="count" fill="#10B981" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
