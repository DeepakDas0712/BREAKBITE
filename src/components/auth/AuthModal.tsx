import React, { useState } from 'react';
import {
  GraduationCap,
  Store,
  Lock,
  Mail,
  User as UserIcon,
  Building,
  KeyRound,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  AlertCircle,
} from 'lucide-react';
import { useBreakBite } from '../../context/BreakBiteContext';
import { Role } from '../../types';
import { DEMO_PASSWORD } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: Role;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialRole = 'student',
}) => {
  const { loginWithEmail, registerStudent, registerVendor, canteens } = useBreakBite();

  const [selectedRole, setSelectedRole] = useState<'student' | 'vendor'>(
    initialRole === 'vendor' ? 'vendor' : 'student'
  );
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [university, setUniversity] = useState('Demo University');
  const [department, setDepartment] = useState('Computer Science');
  const [shopName, setShopName] = useState('Main Campus Canteen');
  const [canteenId, setCanteenId] = useState(canteens[0]?.id || 'canteen-1');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFillDemo = (role: 'student' | 'vendor') => {
    setSelectedRole(role);
    setAuthMode('login');
    if (role === 'student') {
      setEmail('student@breakbite.demo');
      setPassword('breakbite2025');
    } else {
      setEmail('vendor@breakbite.demo');
      setPassword('breakbite2025');
    }
    setErrorMsg('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (authMode === 'login') {
      const ok = loginWithEmail(email, password);
      if (ok) {
        onClose();
      } else {
        setErrorMsg(
          `Invalid credentials. Use password: ${DEMO_PASSWORD} or click "Fill Demo Login".`
        );
      }
    } else {
      // Registration
      if (selectedRole === 'student') {
        if (!name.trim() || !email.trim() || !studentId.trim()) {
          setErrorMsg('Please fill in all required student registration fields.');
          return;
        }
        registerStudent({
          name,
          email,
          password,
          studentId,
          university,
          department,
        });
      } else {
        if (!name.trim() || !email.trim() || !shopName.trim()) {
          setErrorMsg('Please fill in all required shopkeeper registration fields.');
          return;
        }
        registerVendor({
          name,
          email,
          password,
          shopName,
          canteenId,
        });
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-cream-200 shadow-floating flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-cream-200 flex items-center justify-between bg-cream-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-brand-500/20">
              BB
            </div>
            <div>
              <h2 className="text-lg font-black text-charcoal-900">
                BreakBite Campus Portal
              </h2>
              <span className="text-[11px] text-charcoal-500">
                Two-Sided Pre-Ordering Authentication
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-charcoal-400 hover:text-charcoal-700 hover:bg-cream-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Two Distinct Role Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedRole('student');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedRole === 'student'
                  ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white border-cream-200 hover:bg-cream-50 text-charcoal-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    selectedRole === 'student'
                      ? 'bg-blue-600 text-white'
                      : 'bg-cream-100 text-charcoal-500'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-charcoal-900">
                  A. Continue as Student
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-snug">
                Pre-order meals & skip counter queues
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedRole('vendor');
                setErrorMsg('');
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                selectedRole === 'vendor'
                  ? 'bg-amber-50/70 border-amber-400 ring-2 ring-amber-500/20 shadow-sm'
                  : 'bg-white border-cream-200 hover:bg-cream-50 text-charcoal-600'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    selectedRole === 'vendor'
                      ? 'bg-amber-600 text-white'
                      : 'bg-cream-100 text-charcoal-500'
                  }`}
                >
                  <Store className="w-4 h-4" />
                </div>
                <span className="font-extrabold text-xs text-charcoal-900">
                  B. Continue as Shopkeeper
                </span>
              </div>
              <p className="text-[11px] text-charcoal-500 leading-snug">
                Manage tickets & kitchen prep slots
              </p>
            </button>
          </div>

          {/* 1-Click Demo Login Bar */}
          <div className="p-3.5 rounded-2xl bg-cream-100/80 border border-cream-300 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" />
              <span className="font-bold text-charcoal-800">1-Click University Demo Fill:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFillDemo('student')}
                className="px-2.5 py-1 rounded-lg bg-white border border-cream-300 text-blue-700 font-bold text-[11px] hover:bg-blue-50"
              >
                Student Demo
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('vendor')}
                className="px-2.5 py-1 rounded-lg bg-white border border-cream-300 text-amber-800 font-bold text-[11px] hover:bg-amber-50"
              >
                Vendor Demo
              </button>
            </div>
          </div>

          {/* Mode Tabs (Login vs Register) */}
          <div className="flex items-center border-b border-cream-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className={`pb-2.5 px-4 border-b-2 transition-all ${
                authMode === 'login'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              Sign In to Existing Account
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className={`pb-2.5 px-4 border-b-2 transition-all ${
                authMode === 'register'
                  ? 'border-brand-500 text-brand-600'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-900'
              }`}
            >
              Register New {selectedRole === 'student' ? 'Student' : 'Vendor'}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {authMode === 'register' && (
              <div>
                <label className="text-xs font-bold text-charcoal-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder={selectedRole === 'student' ? 'e.g. Alex Verma' : 'e.g. Ramesh Gupta'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-charcoal-700 block mb-1">
                {selectedRole === 'student' ? 'Student University Email' : 'Vendor Shop Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                <input
                  type="email"
                  placeholder={
                    selectedRole === 'student'
                      ? 'student@breakbite.demo'
                      : 'vendor@breakbite.demo'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-charcoal-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-cream-300 bg-cream-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>
            </div>

            {/* Student Specific Fields for Registration */}
            {authMode === 'register' && selectedRole === 'student' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-charcoal-700 block mb-1">
                    Student ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU-2024-8841"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal-700 block mb-1">
                    University Name
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50"
                  />
                </div>
              </div>
            )}

            {/* Vendor Specific Fields for Registration */}
            {authMode === 'register' && selectedRole === 'vendor' && (
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-bold text-charcoal-700 block mb-1">
                    Canteen / Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Main Campus Canteen"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-charcoal-700 block mb-1">
                    Assign Counter Facility
                  </label>
                  <select
                    value={canteenId}
                    onChange={(e) => setCanteenId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-cream-300 bg-cream-50"
                  >
                    {canteens.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.counterNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 rounded-2xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2 transition-all mt-4 ${
                selectedRole === 'student'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'
                  : 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/20'
              }`}
            >
              <span>
                {authMode === 'login'
                  ? `Sign In as ${selectedRole === 'student' ? 'Student' : 'Shopkeeper'}`
                  : `Complete ${selectedRole === 'student' ? 'Student' : 'Vendor'} Registration`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Password Notice */}
          <div className="pt-2 text-center text-[11px] text-charcoal-400">
            Documented demo password for all accounts: <strong className="font-mono text-charcoal-700">breakbite2025</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
