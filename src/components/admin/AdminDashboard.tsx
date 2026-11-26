import React, { useState, useMemo } from 'react';
import {
  Users,
  Store,
  Clock,
  TrendingUp,
  BarChart3,
  Calendar,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Coffee,
  MapPin,
  Megaphone,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { useBreakBite } from '../../context/BreakBiteContext';
import { BreakSchedule, Announcement } from '../../types';

export const AdminDashboard: React.FC = () => {
  const {
    canteens,
    orders,
    foodItems,
    breakSchedules,
    announcements,
    addAnnouncement,
    toggleAnnouncement,
    deleteAnnouncement,
    addBreakSchedule,
    updateBreakSchedule,
    toggleBreakActive,
  } = useBreakBite();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'breaks' | 'canteens' | 'announcements' | 'orders'
  >('overview');

  // Announcement composer state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMessage, setNewAnnMessage] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'urgent'>('info');

  // New Break Schedule modal state
  const [isAddingBreak, setIsAddingBreak] = useState(false);
  const [newBreakName, setNewBreakName] = useState('');
  const [newBreakStart, setNewBreakStart] = useState('11:45 AM');
  const [newBreakEnd, setNewBreakEnd] = useState('12:05 PM');
  const [newBreakDesc, setNewBreakDesc] = useState('');

  // Overall KPIs
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const activeOrders = orders.filter(
    (o) => o.orderStatus !== 'collected' && o.orderStatus !== 'cancelled'
  );

  const completedOrders = orders.filter((o) => o.orderStatus === 'collected');

  // Chart data: Orders by Break Window
  const ordersByBreakData = useMemo(() => {
    return breakSchedules.map((b) => {
      const count = orders.filter((o) => o.breakId === b.id).length;
      return {
        name: b.name.replace(' Break', ''),
        orders: count,
        time: b.startTime,
      };
    });
  }, [breakSchedules, orders]);

  // Chart data: Revenue per Canteen
  const revenueByCanteenData = useMemo(() => {
    return canteens.map((c) => {
      const rev = orders
        .filter((o) => o.canteenId === c.id && o.orderStatus !== 'cancelled')
        .reduce((sum, o) => sum + o.totalAmount, 0);
      return {
        name: c.name.replace('Campus ', ''),
        revenue: rev,
      };
    });
  }, [canteens, orders]);

  // Hourly traffic simulation
  const hourlyTrafficData = [
    { hour: '09:00', orders: 4 },
    { hour: '10:30', orders: 18 }, // Morning break
    { hour: '11:30', orders: 8 },
    { hour: '12:30', orders: 42 }, // Lunch peak
    { hour: '01:00', orders: 28 },
    { hour: '02:30', orders: 6 },
    { hour: '03:30', orders: 22 }, // Evening break
    { hour: '05:00', orders: 10 },
  ];

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnMessage.trim()) return;

    addAnnouncement({
      title: newAnnTitle,
      message: newAnnMessage,
      type: newAnnType,
      author: 'University Admin',
      isActive: true,
    });

    setNewAnnTitle('');
    setNewAnnMessage('');
    alert('Campus announcement broadcasted live to all students & vendors!');
  };

  const handleAddBreakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBreakName.trim()) return;

    addBreakSchedule({
      name: newBreakName,
      startTime: newBreakStart,
      endTime: newBreakEnd,
      description: newBreakDesc || 'Configured campus break window.',
      isDefault: false,
      isActive: true,
    });

    setIsAddingBreak(false);
    setNewBreakName('');
  };

  const COLORS = ['#FF5722', '#10B981', '#3B82F6', '#F59E0B'];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
              Campus Operations Authority
            </span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              Dean & Admin Portal
            </span>
          </div>

          <h1 className="text-2xl font-black text-charcoal-900 mt-1">
            Demo University — BreakBite Platform Central
          </h1>
          <p className="text-xs text-charcoal-500 mt-0.5">
            Real-time multi-counter analytics, university timetable control, and announcements.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAdminTab('announcements')}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-cream-200">
        {[
          { id: 'overview', label: 'Platform Analytics & KPIs' },
          { id: 'breaks', label: `Break Schedules (${breakSchedules.length})` },
          { id: 'canteens', label: `Canteen Counters (${canteens.length})` },
          { id: 'announcements', label: `Announcements (${announcements.length})` },
          { id: 'orders', label: `Audit All Orders (${orders.length})` },
        ].map((tab) => {
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-subtle'
                  : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & CHARTS */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Total Campus Orders Today
              </span>
              <div className="text-3xl font-black text-charcoal-900 mt-1">
                {orders.length}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                {completedOrders.length} collected, {activeOrders.length} active in kitchen
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Total University Volume (₹)
              </span>
              <div className="text-3xl font-black text-charcoal-900 mt-1">
                ₹{totalRevenue}
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Zero commission student pricing
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Average Pickup Wait Time
              </span>
              <div className="text-3xl font-black text-brand-500 mt-1">
                1.2 Min
              </div>
              <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
                Down from 28.4 mins (95.7% saved)
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-cream-200 shadow-card">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400 block">
                Active Dining Counters
              </span>
              <div className="text-3xl font-black text-charcoal-900 mt-1">
                {canteens.length}
              </div>
              <span className="text-[11px] text-charcoal-500 mt-1 block">
                Main Canteen, Food Court, Kiosk
              </span>
            </div>
          </div>

          {/* Visual Charts Grid with Recharts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Chart 1: Orders by University Break Window */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-charcoal-900">
                    Orders by University Break Window
                  </h3>
                  <p className="text-xs text-charcoal-500">Distribution across scheduled slots</p>
                </div>
                <span className="text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  Peak: Lunch
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ordersByBreakData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9DE" />
                    <XAxis dataKey="name" stroke="#8592A0" fontSize={12} tickLine={false} />
                    <YAxis stroke="#8592A0" fontSize={12} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131619',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Bar dataKey="orders" fill="#FF5722" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Hourly Traffic Demand Trend */}
            <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-charcoal-900">
                    Hourly Demand Curve (Pre-Orders vs Rush)
                  </h3>
                  <p className="text-xs text-charcoal-500">Scheduled pre-orders level the counter surge</p>
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                  Level Load
                </span>
              </div>

              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={hourlyTrafficData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EDE9DE" />
                    <XAxis dataKey="hour" stroke="#8592A0" fontSize={12} tickLine={false} />
                    <YAxis stroke="#8592A0" fontSize={12} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#131619',
                        borderRadius: '12px',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        border: 'none',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#8B5CF6"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#8B5CF6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: BREAK SCHEDULE CONFIGURATION */}
      {activeAdminTab === 'breaks' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-charcoal-900">
                University Break Timetable Management
              </h2>
              <p className="text-xs text-charcoal-500">
                Configure academic break slots. Pre-ordering automatically synchronizes with these windows.
              </p>
            </div>

            <button
              onClick={() => setIsAddingBreak(true)}
              className="px-4 py-2 rounded-xl bg-charcoal-900 hover:bg-charcoal-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-subtle"
            >
              <Plus className="w-4 h-4" />
              <span>Add Break Slot</span>
            </button>
          </div>

          {/* Add Break Modal/Form */}
          {isAddingBreak && (
            <form
              onSubmit={handleAddBreakSubmit}
              className="p-5 rounded-3xl bg-cream-50 border border-purple-200 space-y-4"
            >
              <h3 className="text-sm font-bold text-charcoal-900">Add Campus Break Window</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Break Name (e.g. Afternoon Tea Break)"
                  value={newBreakName}
                  onChange={(e) => setNewBreakName(e.target.value)}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white sm:col-span-2"
                  required
                />
                <input
                  type="text"
                  placeholder="Start Time (e.g. 02:15 PM)"
                  value={newBreakStart}
                  onChange={(e) => setNewBreakStart(e.target.value)}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                  required
                />
                <input
                  type="text"
                  placeholder="End Time (e.g. 02:35 PM)"
                  value={newBreakEnd}
                  onChange={(e) => setNewBreakEnd(e.target.value)}
                  className="p-2.5 rounded-xl border border-cream-300 text-xs bg-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingBreak(false)}
                  className="px-4 py-2 rounded-xl border border-cream-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700"
                >
                  Save Break Window
                </button>
              </div>
            </form>
          )}

          {/* List of Break Schedules */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {breakSchedules.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-base text-charcoal-900">{b.name}</span>
                    <button
                      onClick={() => toggleBreakActive(b.id)}
                      className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        b.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-cream-200 text-charcoal-500'
                      }`}
                    >
                      {b.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <div className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg inline-block">
                    {b.startTime} – {b.endTime}
                  </div>

                  <p className="text-xs text-charcoal-500 mt-2 leading-relaxed">
                    {b.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-cream-100 text-[11px] text-charcoal-400 flex items-center justify-between">
                  <span>Capacity: 15 / 5m slot</span>
                  <span>{b.isDefault ? 'Campus Default' : 'Special Slot'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: CANTEEN COUNTERS */}
      {activeAdminTab === 'canteens' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-extrabold text-charcoal-900">
              Campus Canteen Counters & Operational Status
            </h2>
            <p className="text-xs text-charcoal-500">
              Oversee counter congestion, vendor operating status, and hygiene/speed ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {canteens.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-card"
              >
                <div className="h-36 relative bg-cream-100">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-charcoal-900 shadow-sm">
                    {c.rating}★ Rating
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-extrabold text-base text-charcoal-900">{c.name}</h3>
                  <p className="text-xs text-charcoal-500">{c.location}</p>

                  <div className="pt-2 border-t border-cream-100 space-y-1 text-xs">
                    <div className="flex justify-between text-charcoal-600">
                      <span>Counter Identifier:</span>
                      <span className="font-bold text-charcoal-900">{c.counterNumber}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-600">
                      <span>Operating Hours:</span>
                      <span className="font-semibold text-charcoal-800">{c.openingHours}</span>
                    </div>
                    <div className="flex justify-between text-charcoal-600">
                      <span>Direct Contact:</span>
                      <span className="font-semibold text-charcoal-800">{c.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CAMPUS ANNOUNCEMENTS BROADCAST */}
      {activeAdminTab === 'announcements' && (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Post composer */}
          <form
            onSubmit={handlePostAnnouncement}
            className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-card space-y-4"
          >
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                Campus-Wide Broadcast
              </span>
              <h2 className="text-xl font-extrabold text-charcoal-900 mt-2">
                Post Notification to All Students & Counters
              </h2>
              <p className="text-xs text-charcoal-500 mt-1">
                Announcements appear on the top sticky alert banner and inside the student/vendor notification bell.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-charcoal-700 block mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Main Canteen Express Counter Added"
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-charcoal-700 block mb-1">
                  Message Content
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Counter 2 is now dedicated strictly for BreakBite QR pickups during the 12:30 PM lunch break."
                  value={newAnnMessage}
                  onChange={(e) => setNewAnnMessage(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-charcoal-700">Priority:</label>
                {(['info', 'warning', 'urgent'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setNewAnnType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      newAnnType === t
                        ? 'bg-charcoal-900 text-white'
                        : 'bg-cream-100 text-charcoal-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 ml-auto"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Broadcast Live Banner</span>
              </button>
            </div>
          </form>

          {/* Past Announcements */}
          <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
            <h3 className="font-bold text-sm text-charcoal-900">Active Campus Notices</h3>
            <div className="divide-y divide-cream-100">
              {announcements.map((a) => (
                <div key={a.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-charcoal-900">{a.title}</span>
                      <span
                        className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                          a.type === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : a.type === 'warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {a.type}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal-500 mt-1">{a.message}</p>
                    <span className="text-[10px] text-charcoal-400 mt-1 block">
                      Posted: {a.createdAt} by {a.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleAnnouncement(a.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                        a.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-cream-100 text-charcoal-500'
                      }`}
                    >
                      {a.isActive ? 'Active' : 'Hidden'}
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(a.id)}
                      className="p-1 text-charcoal-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: AUDIT ALL ORDERS */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-cream-200 p-6 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-charcoal-900">
              Audit Trail of All University Campus Orders ({orders.length})
            </h3>
            <span className="text-xs text-charcoal-400 font-mono">Live Master Ledger</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-50 text-charcoal-500 uppercase tracking-wider text-[10px] font-bold border-y border-cream-200">
                <tr>
                  <th className="py-3 px-4">Token</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Counter</th>
                  <th className="py-3 px-4">Break & Slot</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-100">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream-50/50 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-charcoal-900">
                      {o.tokenNumber}
                    </td>
                    <td className="py-3 px-4 text-charcoal-800 font-medium">{o.studentName}</td>
                    <td className="py-3 px-4 text-charcoal-600">{o.canteenName}</td>
                    <td className="py-3 px-4 text-charcoal-600 font-medium">{o.pickupTime}</td>
                    <td className="py-3 px-4 font-bold text-charcoal-900">₹{o.totalAmount}</td>
                    <td className="py-3 px-4 text-charcoal-500">
                      {o.paymentMethod} ({o.paymentStatus})
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          o.orderStatus === 'ready'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.orderStatus === 'collected'
                            ? 'bg-charcoal-100 text-charcoal-700'
                            : o.orderStatus === 'preparing'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-brand-100 text-brand-800'
                        }`}
                      >
                        {o.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
