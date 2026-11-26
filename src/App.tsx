import React, { useState } from 'react';
import { useBreakBite, BreakBiteProvider } from './context/BreakBiteContext';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { StudentApp } from './components/student/StudentApp';
import { VendorDashboard } from './components/vendor/VendorDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DesignThinkingShowcase } from './components/design-thinking/DesignThinkingShowcase';
import { CartAndCheckoutModal } from './components/student/CartAndCheckoutModal';
import { DigitalTokenModal } from './components/student/DigitalTokenModal';
import { SmartScheduler } from './components/student/SmartScheduler';
import { AuthModal } from './components/auth/AuthModal';
import { StudentLoginPage } from './components/auth/StudentLoginPage';
import { HelpCentrePage } from './components/support/HelpCentrePage';
import { Order, Role } from './types';
import { X } from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    currentRole,
    orders,
    selectedActiveOrderId,
    setSelectedActiveOrderId,
  } = useBreakBite();

  const [isDesignThinkingModalOpen, setIsDesignThinkingModalOpen] = useState(false);
  const [isGlobalCartOpen, setIsGlobalCartOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<Role>('student');
  const [isStudentLoginOpen, setIsStudentLoginOpen] = useState(false);
  const [isHelpCentreModalOpen, setIsHelpCentreModalOpen] = useState(false);
  const [activeTokenModalOrder, setActiveTokenModalOrder] = useState<Order | null>(null);

  const activeOrder = orders.find((o) => o.id === selectedActiveOrderId) || orders[0];

  const handleOrderCompleted = (newOrder: Order) => {
    setActiveTokenModalOrder(newOrder);
    setSelectedActiveOrderId(newOrder.id);
  };

  const handleOpenAuth = (role?: Role) => {
    if (role) setAuthModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream-50 text-charcoal-900 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Sticky Global Topbar */}
      <Navbar
        onOpenCart={() => setIsGlobalCartOpen(true)}
        onOpenDesignThinking={() => setIsDesignThinkingModalOpen(true)}
        onOpenAuth={handleOpenAuth}
        onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
        onOpenHelpCentre={() => setIsHelpCentreModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'landing' ? (
          <LandingPage
            onOpenDesignThinking={() => setIsDesignThinkingModalOpen(true)}
            onOpenStudentLogin={() => setIsStudentLoginOpen(true)}
            onOpenHelpCentre={() => setIsHelpCentreModalOpen(true)}
          />
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {currentRole === 'student' && (
              <StudentApp
                onOpenDesignThinking={() => setIsDesignThinkingModalOpen(true)}
              />
            )}
            {currentRole === 'vendor' && <VendorDashboard />}
            {currentRole === 'admin' && <AdminDashboard />}
          </div>
        )}
      </main>

      {/* Dedicated Student OTP Login & Registration Modal */}
      <StudentLoginPage
        isOpen={isStudentLoginOpen}
        onClose={() => setIsStudentLoginOpen(false)}
        onOpenHelp={() => {
          setIsStudentLoginOpen(false);
          setIsHelpCentreModalOpen(true);
        }}
      />

      {/* Help & Support Centre Global Modal */}
      {isHelpCentreModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-charcoal-900/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-5xl bg-cream-50 sm:rounded-3xl shadow-floating overflow-hidden border border-cream-200 min-h-screen sm:min-h-[640px] max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setIsHelpCentreModalOpen(false)}
              className="fixed sm:absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/90 hover:bg-cream-100 text-charcoal-700 shadow-md border border-cream-200 transition-all hover:scale-105"
              aria-label="Close Help Centre"
            >
              <X className="w-5 h-5" />
            </button>
            <HelpCentrePage
              onBackToApp={() => setIsHelpCentreModalOpen(false)}
              onOpenLogin={() => {
                setIsHelpCentreModalOpen(false);
                setIsStudentLoginOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Global Cart Modal */}
      <CartAndCheckoutModal
        isOpen={isGlobalCartOpen}
        onClose={() => setIsGlobalCartOpen(false)}
        onOpenScheduler={() => {
          setIsGlobalCartOpen(false);
          setIsSchedulerModalOpen(true);
        }}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* Global Scheduler Modal */}
      {isSchedulerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-sm animate-fade-in">
          <div className="max-w-2xl w-full">
            <SmartScheduler
              onConfirmSlot={() => setIsSchedulerModalOpen(false)}
              onClose={() => setIsSchedulerModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Global Digital Token Modal */}
      <DigitalTokenModal
        order={activeTokenModalOrder || activeOrder}
        isOpen={!!activeTokenModalOrder}
        onClose={() => setActiveTokenModalOrder(null)}
        onOpenTracker={(id) => {
          setActiveTokenModalOrder(null);
          setSelectedActiveOrderId(id);
          setViewMode('app');
          setActiveTab('tracking');
        }}
      />

      {/* Dedicated Student vs Shopkeeper Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialRole={authModalInitialRole}
      />

      {/* Design Thinking Presentation Modal */}
      {isDesignThinkingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md animate-fade-in">
          <div className="max-w-5xl w-full bg-white rounded-3xl overflow-hidden shadow-floating border border-cream-200">
            <DesignThinkingShowcase
              isModal={true}
              onClose={() => setIsDesignThinkingModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <BreakBiteProvider>
      <MainLayout />
    </BreakBiteProvider>
  );
}

export default App;
