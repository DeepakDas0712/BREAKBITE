import React, { useState } from 'react';
import {
  Home,
  UtensilsCrossed,
  Clock,
  History,
  Users,
  ShoppingBag,
  QrCode,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { StudentHome } from './StudentHome';
import { MenuCatalog } from './MenuCatalog';
import { SmartScheduler } from './SmartScheduler';
import { CartAndCheckoutModal } from './CartAndCheckoutModal';
import { DigitalTokenModal } from './DigitalTokenModal';
import { LiveOrderTracker } from './LiveOrderTracker';
import { OrderHistory } from './OrderHistory';
import { GroupOrderingModal } from './GroupOrderingModal';
import { HelpCentrePage } from '../support/HelpCentrePage';
import { Order } from '../../types';

interface StudentAppProps {
  onOpenDesignThinking: () => void;
}

export const StudentApp: React.FC<StudentAppProps> = ({ onOpenDesignThinking }) => {
  const {
    activeTab,
    setActiveTab,
    selectedCanteenId,
    setSelectedCanteenId,
    selectedActiveOrderId,
    setSelectedActiveOrderId,
    orders,
    cartItemCount,
  } = useBreakBite();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isTokenOpen, setIsTokenOpen] = useState(false);
  const [isGroupOrderOpen, setIsGroupOrderOpen] = useState(false);
  const [activeTokenOrder, setActiveTokenOrder] = useState<Order | null>(null);

  // Default active order for tracking
  const currentTrackingOrder = orders.find((o) => o.id === selectedActiveOrderId) || orders[0];

  const handleStartOrdering = (canteenId?: string) => {
    if (canteenId) setSelectedCanteenId(canteenId);
    setActiveTab('menu');
  };

  const handleOpenTracker = (orderId: string) => {
    setSelectedActiveOrderId(orderId);
    setActiveTab('tracking');
  };

  const handleOpenToken = (order: Order) => {
    setActiveTokenOrder(order);
    setIsTokenOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setActiveTokenOrder(newOrder);
    setIsTokenOpen(true);
    setSelectedActiveOrderId(newOrder.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Student App Navigation Bar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-cream-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'home'
                ? 'bg-charcoal-900 text-white shadow-subtle'
                : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Campus Home</span>
          </button>

          <button
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'menu'
                ? 'bg-charcoal-900 text-white shadow-subtle'
                : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Food Menu</span>
          </button>

          <button
            onClick={() => setIsSchedulerOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200 transition-colors"
          >
            <Clock className="w-3.5 h-3.5 text-brand-500" />
            <span>Pick Break Slot</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'tracking'
                ? 'bg-charcoal-900 text-white shadow-subtle'
                : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Live Tracking</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'history'
                ? 'bg-charcoal-900 text-white shadow-subtle'
                : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'help'
                ? 'bg-charcoal-900 text-white shadow-subtle'
                : 'bg-white text-charcoal-600 hover:bg-cream-100 border border-cream-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-brand-500" />
            <span>Help & Support</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => setIsGroupOrderOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Group Order</span>
          </button>
        </div>
      </div>

      {/* Dynamic Screen View */}
      {activeTab === 'home' && (
        <StudentHome
          onStartOrdering={handleStartOrdering}
          onOpenTracker={handleOpenTracker}
          onOpenGroupOrder={() => setIsGroupOrderOpen(true)}
        />
      )}

      {activeTab === 'menu' && (
        <MenuCatalog
          onOpenCart={() => setIsCartOpen(true)}
          onOpenScheduler={() => setIsSchedulerOpen(true)}
        />
      )}

      {activeTab === 'tracking' && (
        <LiveOrderTracker
          orderId={selectedActiveOrderId}
          onOpenToken={handleOpenToken}
          onBackToHome={() => setActiveTab('home')}
        />
      )}

      {activeTab === 'history' && (
        <OrderHistory
          onOpenToken={handleOpenToken}
          onOpenTracker={handleOpenTracker}
          onBrowseMenu={() => setActiveTab('menu')}
        />
      )}

      {activeTab === 'help' && (
        <HelpCentrePage onBackToApp={() => setActiveTab('home')} />
      )}

      {/* Cart & Checkout Modal */}
      <CartAndCheckoutModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenScheduler={() => {
          setIsCartOpen(false);
          setIsSchedulerOpen(true);
        }}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Smart Scheduler Modal */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full">
            <SmartScheduler
              onConfirmSlot={() => setIsSchedulerOpen(false)}
              onClose={() => setIsSchedulerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Digital Token Modal */}
      <DigitalTokenModal
        order={activeTokenOrder || currentTrackingOrder}
        isOpen={isTokenOpen}
        onClose={() => setIsTokenOpen(false)}
        onOpenTracker={(id) => {
          setIsTokenOpen(false);
          handleOpenTracker(id);
        }}
      />

      {/* Group Ordering Modal */}
      <GroupOrderingModal
        isOpen={isGroupOrderOpen}
        onClose={() => setIsGroupOrderOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />
    </div>
  );
};
