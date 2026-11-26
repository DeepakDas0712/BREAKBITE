import React, { useState } from 'react';
import {
  Clock,
  ShoppingBag,
  Bell,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  User as UserIcon,
  Store,
  ShieldAlert,
  ArrowRight,
  Menu as MenuIcon,
  X,
  RotateCcw,
  BookOpen,
  LogIn,
  HelpCircle,
  GraduationCap,
  LogOut,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Role } from '../../types';
import { DEMO_USERS } from '../../data/mockData';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenDesignThinking: () => void;
  onOpenAuth: (role?: Role) => void;
  onOpenStudentLogin?: () => void;
  onOpenHelpCentre?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCart,
  onOpenDesignThinking,
  onOpenAuth,
  onOpenStudentLogin,
  onOpenHelpCentre,
}) => {
  const {
    viewMode,
    setViewMode,
    activeTab,
    setActiveTab,
    currentUser,
    currentRole,
    switchPersona,
    studentSession,
    logoutStudent,
    cartItemCount,
    cartTotal,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    breakSchedules,
    announcements,
    resetToDefaultData,
  } = useBreakBite();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const activeAnnouncement = announcements.find((a) => a.isActive);

  // Find next upcoming break (Lunch break default)
  const nextBreak = breakSchedules.find((b) => b.id === 'break-2') || breakSchedules[0];

  const handleRoleChange = (role: Role) => {
    switchPersona(role);
    setShowRoleMenu(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Campus Notice Banner */}
      {activeAnnouncement && (
        <div className="bg-charcoal-900 text-white text-xs py-1.5 px-4 flex items-center justify-between border-b border-charcoal-700">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-center md:text-left justify-center w-full">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-500 text-white">
              Campus Notice
            </span>
            <span className="font-medium text-cream-200">
              {activeAnnouncement.title}:
            </span>
            <span className="text-charcoal-300 hidden sm:inline">
              {activeAnnouncement.message}
            </span>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-cream-50/95 backdrop-blur-md border-b border-cream-200 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode('landing')}
              className="flex items-center gap-2.5 group text-left focus:outline-none"
            >
              {/* Samosa + Timer Brand Glyph */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 3 21 19 3 19 12 3" fill="rgba(255,255,255,0.25)" />
                  <circle cx="12" cy="13" r="3" fill="#FFFFFF" stroke="none" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-charcoal-900 group-hover:text-brand-500 transition-colors">
                    Break<span className="text-brand-500">Bite</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 text-brand-700 tracking-wide border border-brand-200">
                    15 MIN. 1 SAMOSA
                  </span>
                </div>
                <p className="text-[11px] text-charcoal-500 hidden sm:block -mt-0.5 font-medium">
                  Skip the Queue. Not Your Break.
                </p>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setViewMode('landing')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                viewMode === 'landing'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
              }`}
            >
              Overview & Concept
            </button>

            <button
              onClick={() => {
                setViewMode('app');
                if (currentRole === 'student') setActiveTab('home');
                else if (currentRole === 'vendor') setActiveTab('new-orders');
                else setActiveTab('overview');
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                viewMode === 'app'
                  ? 'text-brand-600 bg-brand-50 font-semibold'
                  : 'text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100'
              }`}
            >
              {currentRole === 'student' && 'Student Dashboard'}
              {currentRole === 'vendor' && 'Shopkeeper Dashboard'}
              {currentRole === 'admin' && 'Admin Portal'}
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <button
              onClick={onOpenDesignThinking}
              className="px-3 py-1.5 rounded-lg text-charcoal-600 hover:text-charcoal-900 hover:bg-cream-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4 text-brand-500" />
              Design Thinking
            </button>

            <button
              onClick={onOpenHelpCentre}
              className="px-3 py-1.5 rounded-lg text-charcoal-600 hover:text-brand-600 hover:bg-cream-100 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-brand-500" />
              <span>Help & Support</span>
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Break Countdown Pill */}
            <div className="hidden xl:flex items-center gap-2 bg-cream-100 border border-cream-300/80 px-3 py-1.5 rounded-full text-xs font-medium text-charcoal-700">
              <Clock className="w-3.5 h-3.5 text-brand-500 animate-spin-slow" />
              <span>Next: <strong>{nextBreak.name}</strong> ({nextBreak.startTime})</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                aria-label="Notifications"
                className="relative p-2 rounded-xl text-charcoal-700 hover:bg-cream-100 hover:text-charcoal-900 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-cream-50 animate-soft-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-elevated border border-cream-200 py-3 px-4 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-cream-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-charcoal-900">Notifications</span>
                      <span className="text-xs bg-cream-100 px-2 py-0.5 rounded-full text-charcoal-600">
                        {notifications.length}
                      </span>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-charcoal-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs transition-colors cursor-pointer border ${
                            n.read
                              ? 'bg-cream-50/50 border-transparent text-charcoal-500'
                              : 'bg-brand-50/40 border-brand-100 text-charcoal-900 font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-semibold text-charcoal-800">{n.title}</span>
                            <span className="text-[10px] text-charcoal-400 shrink-0">{n.timestamp}</span>
                          </div>
                          <p className="mt-1 text-[11px] text-charcoal-600 leading-relaxed">
                            {n.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Trigger (for students) */}
            {currentRole === 'student' && (
              <button
                onClick={onOpenCart}
                className="relative flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/20 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">My Tray</span>
                {cartItemCount > 0 ? (
                  <span className="bg-white text-brand-600 font-bold px-1.5 py-0.5 rounded-md text-xs">
                    {cartItemCount} • ₹{cartTotal}
                  </span>
                ) : (
                  <span className="text-white/80 text-xs">0</span>
                )}
              </button>
            )}

            {/* Persona Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-cream-300 bg-white hover:border-brand-400 transition-colors shadow-subtle text-left"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-cream-300 shrink-0 aspect-square"
                />
                <div className="hidden sm:block">
                  <div className="text-xs font-bold text-charcoal-900 leading-tight flex items-center gap-1.5">
                    {currentUser.name}
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        currentRole === 'student'
                          ? 'bg-blue-100 text-blue-700'
                          : currentRole === 'vendor'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {currentRole === 'vendor' ? 'Shopkeeper' : currentRole}
                    </span>
                  </div>
                  <div className="text-[10px] text-charcoal-400 truncate max-w-[120px]">
                    {currentUser.email}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-charcoal-400 ml-0.5" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-elevated border border-cream-200 py-3 px-3 z-50">
                  <div className="px-2 pb-2 mb-2 border-b border-cream-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal-400">
                        Switch Active Role
                      </span>
                      <p className="text-[10px] text-charcoal-500">
                        Synchronized database sessions
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        onOpenAuth();
                      }}
                      className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 bg-brand-50 px-2 py-1 rounded-lg"
                    >
                      <LogIn className="w-3 h-3" />
                      <span>Auth Form</span>
                    </button>
                  </div>

                  {/* Student OTP Session Info / Login Button */}
                  {studentSession ? (
                    <div className="p-2.5 mb-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Logged In Student
                        </span>
                        <button
                          onClick={() => {
                            setShowRoleMenu(false);
                            logoutStudent();
                          }}
                          className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Logout</span>
                        </button>
                      </div>
                      <div className="text-xs font-bold text-charcoal-900 mt-1">
                        {studentSession.name}
                      </div>
                      <div className="text-[10px] text-charcoal-500 font-mono">
                        Roll: {studentSession.registrationId} • {studentSession.mobileNumber}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        if (onOpenStudentLogin) onOpenStudentLogin();
                      }}
                      className="w-full mb-2 p-2 rounded-xl bg-brand-50 border border-brand-200 text-brand-700 font-bold text-xs flex items-center justify-between hover:bg-brand-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-brand-600" />
                        <span>Student OTP Login</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div className="space-y-1">
                    {DEMO_USERS.map((user) => {
                      const isActive = user.role === currentRole;
                      return (
                        <button
                          key={user.id}
                          onClick={() => handleRoleChange(user.role)}
                          className={`w-full flex items-center gap-3 p-2 rounded-xl text-left transition-colors ${
                            isActive
                              ? 'bg-brand-50 border border-brand-200'
                              : 'hover:bg-cream-100 text-charcoal-700'
                          }`}
                        >
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-cream-300 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-charcoal-900 flex items-center gap-1.5">
                              {user.name}
                              <span
                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                                  user.role === 'student'
                                    ? 'bg-blue-100 text-blue-700'
                                    : user.role === 'vendor'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {user.role === 'vendor' ? 'Shopkeeper' : user.role}
                              </span>
                            </div>
                            <div className="text-[11px] text-charcoal-500 truncate">
                              {user.email}
                            </div>
                          </div>
                          {isActive && (
                            <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 pt-2 border-t border-cream-100 px-2 flex items-center justify-between">
                    <button
                      onClick={resetToDefaultData}
                      className="text-[11px] text-charcoal-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                      title="Reset mock data to initial state"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset Local Data
                    </button>
                    <button
                      onClick={() => {
                        setShowRoleMenu(false);
                        if (onOpenHelpCentre) onOpenHelpCentre();
                      }}
                      className="text-[11px] text-brand-600 hover:underline font-semibold flex items-center gap-1"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Help Desk</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-charcoal-700 hover:bg-cream-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-cream-50 border-b border-cream-200 px-4 pt-2 pb-4 space-y-2">
            <div className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => {
                  setViewMode('landing');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-charcoal-700 hover:bg-cream-100"
              >
                Overview & Pitch
              </button>
              <button
                onClick={() => {
                  setViewMode('app');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-brand-600 font-bold bg-brand-50 flex items-center justify-between"
              >
                <span>
                  Go to {currentRole === 'student' ? 'Student Dashboard' : currentRole === 'vendor' ? 'Shopkeeper Dashboard' : 'Admin Portal'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (onOpenStudentLogin) onOpenStudentLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-brand-600 font-bold bg-brand-50/50 hover:bg-brand-50 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-brand-500" />
                Student Login (OTP)
              </button>
              <button
                onClick={() => {
                  if (onOpenHelpCentre) onOpenHelpCentre();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-charcoal-700 hover:bg-cream-100 flex items-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-brand-500" />
                Help & Support Centre
              </button>
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-charcoal-700 hover:bg-cream-100 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-charcoal-500" />
                Dual Role Auth Form
              </button>
              <button
                onClick={() => {
                  onOpenDesignThinking();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-charcoal-700 hover:bg-cream-100 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-brand-500" />
                Design Thinking Stages
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
