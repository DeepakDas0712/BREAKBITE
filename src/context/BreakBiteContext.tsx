import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import {
  User,
  Role,
  Canteen,
  FoodItem,
  BreakSchedule,
  PickupSlot,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  GroupOrderSession,
  Announcement,
  AppNotification,
  KitchenCapacitySettings,
  RushLevel,
  StudentSession,
  SupportTicket,
} from '../types';
import {
  DEMO_USERS,
  MOCK_CANTEENS,
  MOCK_BREAK_SCHEDULES,
  MOCK_FOOD_ITEMS,
  INITIAL_ORDERS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  DEFAULT_KITCHEN_CAPACITY,
  DEMO_PASSWORD,
  INITIAL_SUPPORT_TICKETS,
} from '../data/mockData';

interface PlaceOrderParams {
  paymentMethod: PaymentMethod;
  notes?: string;
  utrReference?: string;
  screenshotUrl?: string;
}

interface BreakBiteContextType {
  // Navigation & Mode
  viewMode: 'landing' | 'app';
  setViewMode: (mode: 'landing' | 'app') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;

  // Auth / Persona
  currentUser: User;
  currentRole: Role;
  switchPersona: (role: Role) => void;
  loginWithEmail: (email: string, password?: string) => boolean;
  registerStudent: (details: {
    name: string;
    email: string;
    password?: string;
    studentId: string;
    university: string;
    department?: string;
  }) => User;
  registerVendor: (details: {
    name: string;
    email: string;
    password?: string;
    shopName: string;
    canteenId: string;
  }) => User;
  logout: () => void;

  // Student OTP Authentication & Session
  studentSession: StudentSession | null;
  loginStudentWithOtp: (session: StudentSession) => void;
  logoutStudent: () => void;

  // Help & Support
  supportTickets: SupportTicket[];
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => SupportTicket;

  // Data
  canteens: Canteen[];
  foodItems: FoodItem[];
  orders: Order[];
  breakSchedules: BreakSchedule[];
  announcements: Announcement[];
  notifications: AppNotification[];
  capacitySettings: KitchenCapacitySettings;
  activeGroupOrder: GroupOrderSession | null;

  // Cart & Ordering State
  cart: CartItem[];
  cartCanteenId: string | null;
  selectedBreakId: string;
  setSelectedBreakId: (breakId: string) => void;
  selectedPickupDate: string;
  setSelectedPickupDate: (date: string) => void;
  selectedPickupSlot: string | null;
  setSelectedPickupSlot: (slot: string | null) => void;
  selectedCanteenId: string;
  setSelectedCanteenId: (canteenId: string) => void;

  // Cart operations
  addToCart: (item: FoodItem, quantity?: number) => void;
  removeFromCart: (foodItemId: string) => void;
  updateCartQuantity: (foodItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Order lifecycle
  placeOrder: (details: PlaceOrderParams) => Promise<Order>;
  verifyVendorPayment: (orderId: string, verified: boolean) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  verifyAndCollectToken: (tokenOrQr: string) => { success: boolean; message: string; order?: Order };
  cancelOrder: (orderId: string, reason?: string) => void;
  rateOrder: (orderId: string, score: number, comment?: string) => void;
  reorderPastOrder: (orderId: string) => void;

  // Active / Tracking
  selectedActiveOrderId: string | null;
  setSelectedActiveOrderId: (orderId: string | null) => void;

  // Vendor features
  toggleItemAvailability: (itemId: string) => void;
  updateItemPriceOrPrep: (itemId: string, price: number, prepTimeMinutes: number) => void;
  addFoodItem: (item: Omit<FoodItem, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateKitchenCapacity: (settings: Partial<KitchenCapacitySettings>) => void;

  // Admin features
  addAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt'>) => void;
  toggleAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;
  addBreakSchedule: (schedule: Omit<BreakSchedule, 'id'>) => void;
  updateBreakSchedule: (id: string, updates: Partial<BreakSchedule>) => void;
  toggleBreakActive: (id: string) => void;

  // Group ordering
  createGroupOrder: (canteenId: string, breakName: string, pickupTime: string) => GroupOrderSession;
  joinGroupOrder: (roomCode: string) => boolean;
  addItemsToGroupOrder: (roomCode: string, items: CartItem[]) => void;
  checkoutGroupOrder: (roomCode: string, paymentMethod: PaymentMethod) => Promise<Order | null>;
  leaveGroupOrder: () => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;

  // Computations
  getAvailablePickupSlots: (breakId: string, canteenId: string, itemsInCart?: CartItem[]) => PickupSlot[];
  getCanteenRush: (canteenId: string) => RushLevel;
  resetToDefaultData: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'breakbite_current_user',
  CANTEENS: 'breakbite_canteens',
  FOOD_ITEMS: 'breakbite_food_items',
  ORDERS: 'breakbite_orders',
  BREAK_SCHEDULES: 'breakbite_break_schedules',
  ANNOUNCEMENTS: 'breakbite_announcements',
  NOTIFICATIONS: 'breakbite_notifications',
  CAPACITY_SETTINGS: 'breakbite_capacity_settings',
  CART: 'breakbite_cart',
  CART_CANTEEN: 'breakbite_cart_canteen',
  STUDENT_SESSION: 'breakbite_student_session',
  SUPPORT_TICKETS: 'breakbite_support_tickets',
};

const BreakBiteContext = createContext<BreakBiteContextType | undefined>(undefined);

export const BreakBiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation & mode
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');
  const [activeTab, setActiveTab] = useState<string>('home');

  // Student Session (Persisted OTP Login)
  const [studentSession, setStudentSession] = useState<StudentSession | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENT_SESSION);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Support Tickets (Persisted)
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT_TICKETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_SUPPORT_TICKETS;
  });

  // Persona State
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    const savedSession = localStorage.getItem(STORAGE_KEYS.STUDENT_SESSION);
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        return {
          id: `student-${parsed.registrationId}`,
          name: parsed.name,
          email: `${parsed.registrationId.toLowerCase()}@student.demo`,
          role: 'student',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          studentId: parsed.registrationId,
          university: 'Demo University',
          department: 'Undergraduate Student',
          phone: parsed.mobileNumber,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return DEMO_USERS[0]; // Student by default
  });

  const currentRole: Role = currentUser.role;

  // Core Data
  const [canteens, setCanteens] = useState<Canteen[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CANTEENS);
    return saved ? JSON.parse(saved) : MOCK_CANTEENS;
  });

  const [foodItems, setFoodItems] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_ITEMS);
    return saved ? JSON.parse(saved) : MOCK_FOOD_ITEMS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [breakSchedules, setBreakSchedules] = useState<BreakSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BREAK_SCHEDULES);
    return saved ? JSON.parse(saved) : MOCK_BREAK_SCHEDULES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [capacitySettings, setCapacitySettings] = useState<KitchenCapacitySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAPACITY_SETTINGS);
    return saved ? JSON.parse(saved) : DEFAULT_KITCHEN_CAPACITY;
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [cartCanteenId, setCartCanteenId] = useState<string | null>(() => {
    return localStorage.getItem(STORAGE_KEYS.CART_CANTEEN) || 'canteen-1';
  });

  // Selection states for ordering
  const [selectedCanteenId, setSelectedCanteenId] = useState<string>('canteen-1');
  const [selectedBreakId, setSelectedBreakId] = useState<string>('break-2'); // Lunch break by default
  const [selectedPickupDate, setSelectedPickupDate] = useState<string>('27 Nov 2026');
  const [selectedPickupSlot, setSelectedPickupSlot] = useState<string | null>('12:35 PM');
  const [selectedActiveOrderId, setSelectedActiveOrderId] = useState<string | null>('order-1021');

  // Group Ordering session state
  const [activeGroupOrder, setActiveGroupOrder] = useState<GroupOrderSession | null>(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }, [canteens]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_ITEMS, JSON.stringify(foodItems));
  }, [foodItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BREAK_SCHEDULES, JSON.stringify(breakSchedules));
  }, [breakSchedules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAPACITY_SETTINGS, JSON.stringify(capacitySettings));
  }, [capacitySettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (cartCanteenId) {
      localStorage.setItem(STORAGE_KEYS.CART_CANTEEN, cartCanteenId);
    } else {
      localStorage.removeItem(STORAGE_KEYS.CART_CANTEEN);
    }
  }, [cartCanteenId]);

  useEffect(() => {
    if (studentSession) {
      localStorage.setItem(STORAGE_KEYS.STUDENT_SESSION, JSON.stringify(studentSession));
    } else {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION);
    }
  }, [studentSession]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_TICKETS, JSON.stringify(supportTickets));
  }, [supportTickets]);

  // Multi-tab real-time synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.ORDERS && e.newValue) {
        setOrders(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.FOOD_ITEMS && e.newValue) {
        setFoodItems(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.NOTIFICATIONS && e.newValue) {
        setNotifications(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.ANNOUNCEMENTS && e.newValue) {
        setAnnouncements(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.SUPPORT_TICKETS && e.newValue) {
        setSupportTickets(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.STUDENT_SESSION && e.newValue) {
        setStudentSession(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const switchPersona = (newRole: Role) => {
    const targetUser = DEMO_USERS.find((u) => u.role === newRole) || DEMO_USERS[0];
    setCurrentUser(targetUser);
    setViewMode('app');
    if (newRole === 'student') {
      setActiveTab('home');
    } else if (newRole === 'vendor') {
      setActiveTab('live-orders');
    } else {
      setActiveTab('overview');
    }
  };

  const loginWithEmail = (email: string, password?: string): boolean => {
    if (password && password !== DEMO_PASSWORD && password !== 'admin' && password !== 'demo' && password !== 'password') {
      return false;
    }
    const matched = DEMO_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setCurrentUser(matched);
      setViewMode('app');
      if (matched.role === 'student') setActiveTab('home');
      else if (matched.role === 'vendor') setActiveTab('live-orders');
      else setActiveTab('overview');
      return true;
    }
    return false;
  };

  const registerStudent = (details: {
    name: string;
    email: string;
    password?: string;
    studentId: string;
    university: string;
    department?: string;
  }): User => {
    const newUser: User = {
      id: `student-${Date.now()}`,
      name: details.name,
      email: details.email,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      studentId: details.studentId,
      university: details.university,
      department: details.department || 'Undergraduate Student',
    };
    setCurrentUser(newUser);
    setViewMode('app');
    setActiveTab('home');
    return newUser;
  };

  const registerVendor = (details: {
    name: string;
    email: string;
    password?: string;
    shopName: string;
    canteenId: string;
  }): User => {
    const newUser: User = {
      id: `vendor-${Date.now()}`,
      name: details.name,
      email: details.email,
      role: 'vendor',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      shopName: details.shopName,
      canteenId: details.canteenId,
    };
    setCurrentUser(newUser);
    setViewMode('app');
    setActiveTab('live-orders');
    return newUser;
  };

  const logout = () => {
    setViewMode('landing');
  };

  const loginStudentWithOtp = (session: StudentSession) => {
    setStudentSession(session);
    const studentUser: User = {
      id: `student-${session.registrationId}`,
      name: session.name,
      email: `${session.registrationId.toLowerCase()}@student.demo`,
      role: 'student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      studentId: session.registrationId,
      university: 'Demo University',
      department: 'Undergraduate Student',
      phone: session.mobileNumber,
    };
    setCurrentUser(studentUser);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(studentUser));
    setViewMode('app');
    setActiveTab('home');
  };

  const logoutStudent = () => {
    setStudentSession(null);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_SESSION);
    setCurrentUser(DEMO_USERS[0]);
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEMO_USERS[0]));
    setViewMode('landing');
  };

  const submitSupportTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>
  ): SupportTicket => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `BB-HELP-${randomNum}`,
      status: 'Submitted',
      createdAt: 'Just now',
    };
    setSupportTickets((prev) => [newTicket, ...prev]);

    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      targetRole: 'student',
      targetUserId: currentUser.id,
      title: `Support Ticket ${newTicket.id} Submitted 🎫`,
      message: `Your query regarding "${newTicket.subject}" has been received. Expected resolution within 15 mins during break hours.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);

    return newTicket;
  };

  // Cart operations
  const addToCart = (item: FoodItem, quantity = 1) => {
    if (cart.length > 0 && cartCanteenId && cartCanteenId !== item.canteenId) {
      if (
        !window.confirm(
          'Your tray has items from another campus counter. Clear tray and add this item instead?'
        )
      ) {
        return;
      }
      setCart([{ foodItem: item, quantity }]);
      setCartCanteenId(item.canteenId);
      return;
    }

    setCartCanteenId(item.canteenId);
    setCart((prev) => {
      const existing = prev.find((ci) => ci.foodItem.id === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.foodItem.id === item.id ? { ...ci, quantity: ci.quantity + quantity } : ci
        );
      }
      return [...prev, { foodItem: item, quantity }];
    });
  };

  const removeFromCart = (foodItemId: string) => {
    setCart((prev) => {
      const next = prev.filter((ci) => ci.foodItem.id !== foodItemId);
      if (next.length === 0) setCartCanteenId(null);
      return next;
    });
  };

  const updateCartQuantity = (foodItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(foodItemId);
      return;
    }
    setCart((prev) =>
      prev.map((ci) => (ci.foodItem.id === foodItemId ? { ...ci, quantity } : ci))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCartCanteenId(null);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.foodItem.price * curr.quantity, 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.quantity, 0);
  }, [cart]);

  // Dynamic slot generation and capacity engine
  const getAvailablePickupSlots = (
    breakId: string,
    canteenId: string,
    itemsInCart?: CartItem[]
  ): PickupSlot[] => {
    const targetBreak = breakSchedules.find((b) => b.id === breakId) || breakSchedules[1];
    const items = itemsInCart && itemsInCart.length > 0 ? itemsInCart : cart;

    const baseTimes =
      breakId === 'break-1'
        ? ['10:30 AM', '10:35 AM', '10:40 AM', '10:45 AM']
        : breakId === 'break-3'
        ? ['03:30 PM', '03:35 PM', '03:40 PM', '03:45 PM']
        : [
            '12:20 PM',
            '12:25 PM',
            '12:30 PM',
            '12:35 PM',
            '12:40 PM',
            '12:45 PM',
            '12:50 PM',
            '01:00 PM',
          ];

    const slots: PickupSlot[] = [];

    baseTimes.forEach((timeStr, idx) => {
      const activeCount = orders.filter(
        (o) =>
          o.canteenId === canteenId &&
          o.pickupTime === timeStr &&
          o.orderStatus !== 'collected' &&
          o.orderStatus !== 'cancelled'
      ).length;

      // Realistic initial load
      const simulatedBaseLoad = (idx * 2 + 1) % capacitySettings.maxOrdersPerSlot;
      const currentBooked = Math.min(
        capacitySettings.maxOrdersPerSlot,
        activeCount + simulatedBaseLoad
      );

      let status: 'available' | 'limited' | 'full' = 'available';
      if (currentBooked >= capacitySettings.maxOrdersPerSlot) {
        status = 'full';
      } else if (currentBooked >= capacitySettings.maxOrdersPerSlot - 3) {
        status = 'limited';
      }

      slots.push({
        id: `slot-${breakId}-${timeStr.replace(/\s+/g, '')}`,
        breakId,
        canteenId,
        dateString: selectedPickupDate,
        timeString: timeStr,
        maxCapacity: capacitySettings.maxOrdersPerSlot,
        currentBooked,
        status,
      });
    });

    return slots;
  };

  const getCanteenRush = (canteenId: string): RushLevel => {
    const active = orders.filter(
      (o) =>
        o.canteenId === canteenId &&
        (o.orderStatus === 'placed' ||
          o.orderStatus === 'accepted' ||
          o.orderStatus === 'preparing' ||
          o.orderStatus === 'ready')
    ).length;

    if (active >= 16) return 'high';
    if (active >= 7) return 'moderate';
    return 'low';
  };

  // Place Order with Strict Verification Gate
  const placeOrder = async (details: PlaceOrderParams): Promise<Order> => {
    if (cart.length === 0) throw new Error('Tray is empty');

    const canteen =
      canteens.find((c) => c.id === (cartCanteenId || selectedCanteenId)) || canteens[0];
    const targetBreak =
      breakSchedules.find((b) => b.id === selectedBreakId) || breakSchedules[1];
    const pickup = selectedPickupSlot || '12:35 PM';

    // Generate unique token number format: BB-2026-1024
    const nextTokenNum = 1024 + orders.length + Math.floor(Math.random() * 5);
    const tokenNumber = `BB-2026-${nextTokenNum}`;

    const estReady = `${pickup} (Ready 2m prior)`;

    // QR payload contains secure verification identifier
    const qrDataPayload = JSON.stringify({
      token: tokenNumber,
      orderId: `order-${Date.now()}`,
      canteen: canteen.name,
      pickupDate: selectedPickupDate,
      pickupTime: pickup,
      student: currentUser.name,
      vpa: '9211437989@ptyes',
      ref: details.utrReference || 'REF-DIRECT',
    });

    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(qrDataPayload, {
        width: 320,
        margin: 2,
        color: {
          dark: '#131619',
          light: '#FFFFFF',
        },
      });
    } catch (err) {
      console.error('QR code generation error', err);
    }

    // Determine payment and order status
    // For UPI: requires vendor manual verification
    let initialPaymentStatus: PaymentStatus = 'verification_required';
    let initialOrderStatus: OrderStatus = 'placed';

    if (details.paymentMethod === 'Cash at Counter') {
      initialPaymentStatus = 'payment_pending';
      initialOrderStatus = 'placed';
    } else if (details.paymentMethod === 'Card') {
      initialPaymentStatus = 'verified';
      initialOrderStatus = 'accepted';
    }

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      tokenNumber,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone || '+91 98765 43210',
      canteenId: canteen.id,
      canteenName: canteen.name,
      items: [...cart],
      breakId: targetBreak.id,
      breakName: `${targetBreak.name} (${targetBreak.startTime})`,
      pickupTime: pickup,
      pickupDate: selectedPickupDate,
      subtotal: cartTotal,
      platformFee: 0,
      tax: 0,
      totalAmount: cartTotal,
      paymentMethod: details.paymentMethod,
      paymentStatus: initialPaymentStatus,
      orderStatus: initialOrderStatus,
      utrReference: details.utrReference,
      screenshotUrl: details.screenshotUrl,
      qrDataUrl,
      createdAt: new Date().toISOString(),
      estimatedReadyTime: estReady,
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedActiveOrderId(newOrder.id);

    // Fire celebration confetti!
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5722', '#10B981', '#F59E0B', '#131619'],
    });

    // Notify student & vendor
    addNotification({
      targetRole: 'student',
      targetUserId: currentUser.id,
      title: `Order Submitted: ${tokenNumber}`,
      message:
        details.paymentMethod === 'UPI'
          ? `UPI Payment reference ${details.utrReference || ''} submitted for ₹${cartTotal}. Awaiting shopkeeper verification.`
          : `Order confirmed for ${pickup} pickup at ${canteen.name}.`,
      type: 'order',
      orderId: newOrder.id,
    });

    addNotification({
      targetRole: 'vendor',
      title: `New Order: ${tokenNumber}`,
      message: `${currentUser.name} scheduled ${newOrder.items.length} items for ${pickup}. ${
        details.paymentMethod === 'UPI' ? 'Verify UTR payment.' : ''
      }`,
      type: 'order',
      orderId: newOrder.id,
    });

    return newOrder;
  };

  // Vendor Payment Verification Action
  const verifyVendorPayment = (orderId: string, verified: boolean) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        return {
          ...o,
          paymentStatus: verified ? 'verified' : 'failed',
          orderStatus: verified ? 'accepted' : 'cancelled',
          paymentVerifiedAt: new Date().toISOString(),
          paymentVerifiedBy: currentUser.name,
        };
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      addNotification({
        targetRole: 'student',
        targetUserId: targetOrder.studentId,
        title: verified
          ? `Payment Verified! Order ${targetOrder.tokenNumber} Confirmed`
          : `Payment Failed for Order ${targetOrder.tokenNumber}`,
        message: verified
          ? `Your UPI payment of ₹${targetOrder.totalAmount} has been verified by ${currentUser.name}. Food is queued for ${targetOrder.pickupTime} pickup.`
          : `Shopkeeper could not verify transaction UTR ${targetOrder.utrReference || ''}. Please check with counter.`,
        type: 'order',
        orderId: targetOrder.id,
      });
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updated = { ...o, orderStatus: status };
        if (status === 'collected') {
          updated.collectedAt = new Date().toISOString();
        }
        return updated;
      })
    );

    const targetOrder = orders.find((o) => o.id === orderId);
    if (targetOrder) {
      const statusLabels: Record<OrderStatus, string> = {
        placed: 'placed',
        accepted: 'accepted by kitchen',
        preparing: 'now being prepared hot',
        ready: 'READY for pickup! Please proceed to counter',
        collected: 'collected',
        cancelled: 'cancelled',
      };

      addNotification({
        targetRole: 'student',
        targetUserId: targetOrder.studentId,
        title: `Order ${targetOrder.tokenNumber} is ${status.toUpperCase()}!`,
        message: `Your food at ${targetOrder.canteenName} is ${statusLabels[status]}.`,
        type: 'order',
        orderId: targetOrder.id,
      });
    }
  };

  const verifyAndCollectToken = (
    tokenOrQr: string
  ): { success: boolean; message: string; order?: Order } => {
    const cleaned = tokenOrQr.trim().toUpperCase();

    const foundOrder = orders.find(
      (o) =>
        o.tokenNumber.toUpperCase() === cleaned ||
        (o.qrDataUrl && o.qrDataUrl.toUpperCase().includes(cleaned)) ||
        cleaned.includes(o.tokenNumber.toUpperCase())
    );

    if (!foundOrder) {
      return {
        success: false,
        message: `No order found matching token "${tokenOrQr}". Please check token code.`,
      };
    }

    if (foundOrder.orderStatus === 'collected') {
      return {
        success: false,
        message: `Order ${foundOrder.tokenNumber} has ALREADY been collected at ${
          foundOrder.collectedAt ? new Date(foundOrder.collectedAt).toLocaleTimeString() : 'earlier'
        }. Duplicate collection prevented.`,
        order: foundOrder,
      };
    }

    if (foundOrder.orderStatus === 'cancelled') {
      return {
        success: false,
        message: `Order ${foundOrder.tokenNumber} was cancelled. Cannot verify collection.`,
        order: foundOrder,
      };
    }

    // Success! Mark collected
    updateOrderStatus(foundOrder.id, 'collected');

    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.5 },
    });

    return {
      success: true,
      message: `Verified successfully! Order ${foundOrder.tokenNumber} for ${foundOrder.studentName} marked as Collected.`,
      order: foundOrder,
    };
  };

  const cancelOrder = (orderId: string, reason = 'Cancelled by student') => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'cancelled',
              cancellationReason: reason,
            }
          : o
      )
    );

    addNotification({
      targetRole: 'student',
      title: 'Order Cancelled',
      message: 'Your order was cancelled.',
      type: 'order',
      orderId,
    });
  };

  const rateOrder = (orderId: string, score: number, comment?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              rating: { score, comment, ratedAt: new Date().toISOString() },
            }
          : o
      )
    );
  };

  const reorderPastOrder = (orderId: string) => {
    const past = orders.find((o) => o.id === orderId);
    if (!past) return;

    clearCart();
    setCartCanteenId(past.canteenId);
    setCart(past.items.map((i) => ({ ...i })));
    setViewMode('app');
    setActiveTab('menu');
  };

  const toggleItemAvailability = (itemId: string) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
      )
    );
  };

  const updateItemPriceOrPrep = (
    itemId: string,
    price: number,
    prepTimeMinutes: number
  ) => {
    setFoodItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, price, prepTimeMinutes } : item
      )
    );
  };

  const addFoodItem = (
    itemData: Omit<FoodItem, 'id' | 'rating' | 'reviewsCount'>
  ) => {
    const newItem: FoodItem = {
      ...itemData,
      id: `food-${Date.now()}`,
      rating: 4.8,
      reviewsCount: 1,
    };
    setFoodItems((prev) => [newItem, ...prev]);
  };

  const updateKitchenCapacity = (settings: Partial<KitchenCapacitySettings>) => {
    setCapacitySettings((prev) => ({ ...prev, ...settings }));
  };

  const addAnnouncement = (ann: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: 'Just now',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
  };

  const toggleAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const addBreakSchedule = (schedule: Omit<BreakSchedule, 'id'>) => {
    const newBreak: BreakSchedule = {
      ...schedule,
      id: `break-${Date.now()}`,
    };
    setBreakSchedules((prev) => [...prev, newBreak]);
  };

  const updateBreakSchedule = (id: string, updates: Partial<BreakSchedule>) => {
    setBreakSchedules((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const toggleBreakActive = (id: string) => {
    setBreakSchedules((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isActive: !b.isActive } : b))
    );
  };

  const createGroupOrder = (
    canteenId: string,
    breakName: string,
    pickupTime: string
  ): GroupOrderSession => {
    const canteen = canteens.find((c) => c.id === canteenId) || canteens[0];
    const roomCode = Math.floor(100000 + Math.random() * 900000).toString();

    const session: GroupOrderSession = {
      id: `group-${Date.now()}`,
      roomCode,
      hostUserId: currentUser.id,
      hostUserName: currentUser.name,
      canteenId: canteen.id,
      canteenName: canteen.name,
      breakName,
      pickupTime,
      members: [
        {
          userId: currentUser.id,
          userName: currentUser.name,
          userAvatar: currentUser.avatar,
          joinedAt: 'Just now',
          items: [...cart],
        },
      ],
      status: 'open',
    };

    setActiveGroupOrder(session);
    return session;
  };

  const joinGroupOrder = (roomCode: string): boolean => {
    if (activeGroupOrder && activeGroupOrder.roomCode === roomCode.trim()) {
      if (!activeGroupOrder.members.some((m) => m.userId === currentUser.id)) {
        setActiveGroupOrder({
          ...activeGroupOrder,
          members: [
            ...activeGroupOrder.members,
            {
              userId: currentUser.id,
              userName: currentUser.name,
              userAvatar: currentUser.avatar,
              joinedAt: 'Just now',
              items: [],
            },
          ],
        });
      }
      return true;
    }
    return false;
  };

  const addItemsToGroupOrder = (roomCode: string, items: CartItem[]) => {
    if (!activeGroupOrder || activeGroupOrder.roomCode !== roomCode) return;
    setActiveGroupOrder({
      ...activeGroupOrder,
      members: activeGroupOrder.members.map((m) =>
        m.userId === currentUser.id ? { ...m, items: [...m.items, ...items] } : m
      ),
    });
  };

  const checkoutGroupOrder = async (
    roomCode: string,
    paymentMethod: PaymentMethod
  ): Promise<Order | null> => {
    if (!activeGroupOrder || activeGroupOrder.roomCode !== roomCode) return null;

    const allItems: CartItem[] = [];
    activeGroupOrder.members.forEach((m) => {
      m.items.forEach((item) => {
        const found = allItems.find((i) => i.foodItem.id === item.foodItem.id);
        if (found) {
          found.quantity += item.quantity;
        } else {
          allItems.push({ ...item });
        }
      });
    });

    if (allItems.length === 0) return null;

    setCart(allItems);
    setCartCanteenId(activeGroupOrder.canteenId);
    setSelectedPickupSlot(activeGroupOrder.pickupTime);

    const order = await placeOrder({ paymentMethod });
    order.groupCode = roomCode;

    setActiveGroupOrder({
      ...activeGroupOrder,
      status: 'ordered',
      finalOrderId: order.id,
    });

    return order;
  };

  const leaveGroupOrder = () => {
    setActiveGroupOrder(null);
  };

  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const resetToDefaultData = () => {
    localStorage.clear();
    setCurrentUser(DEMO_USERS[0]);
    setCanteens(MOCK_CANTEENS);
    setFoodItems(MOCK_FOOD_ITEMS);
    setOrders(INITIAL_ORDERS);
    setBreakSchedules(MOCK_BREAK_SCHEDULES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCapacitySettings(DEFAULT_KITCHEN_CAPACITY);
    setCart([]);
    setCartCanteenId('canteen-1');
    setSelectedBreakId('break-2');
    setSelectedPickupDate('27 Nov 2026');
    setSelectedPickupSlot('12:35 PM');
    setActiveGroupOrder(null);
    window.location.reload();
  };

  return (
    <BreakBiteContext.Provider
      value={{
        viewMode,
        setViewMode,
        activeTab,
        setActiveTab,
        currentUser,
        currentRole,
        switchPersona,
        loginWithEmail,
        registerStudent,
        registerVendor,
        logout,
        studentSession,
        loginStudentWithOtp,
        logoutStudent,
        supportTickets,
        submitSupportTicket,
        canteens,
        foodItems,
        orders,
        breakSchedules,
        announcements,
        notifications,
        capacitySettings,
        activeGroupOrder,
        cart,
        cartCanteenId,
        selectedBreakId,
        setSelectedBreakId,
        selectedPickupDate,
        setSelectedPickupDate,
        selectedPickupSlot,
        setSelectedPickupSlot,
        selectedCanteenId,
        setSelectedCanteenId,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        placeOrder,
        verifyVendorPayment,
        updateOrderStatus,
        verifyAndCollectToken,
        cancelOrder,
        rateOrder,
        reorderPastOrder,
        selectedActiveOrderId,
        setSelectedActiveOrderId,
        toggleItemAvailability,
        updateItemPriceOrPrep,
        addFoodItem,
        updateKitchenCapacity,
        addAnnouncement,
        toggleAnnouncement,
        deleteAnnouncement,
        addBreakSchedule,
        updateBreakSchedule,
        toggleBreakActive,
        createGroupOrder,
        joinGroupOrder,
        addItemsToGroupOrder,
        checkoutGroupOrder,
        leaveGroupOrder,
        markNotificationRead,
        clearAllNotifications,
        addNotification,
        getAvailablePickupSlots,
        getCanteenRush,
        resetToDefaultData,
      }}
    >
      {children}
    </BreakBiteContext.Provider>
  );
};

export const useBreakBite = () => {
  const context = useContext(BreakBiteContext);
  if (!context) {
    throw new Error('useBreakBite must be used within a BreakBiteProvider');
  }
  return context;
};
