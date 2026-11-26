export type Role = 'student' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  studentId?: string;
  university?: string;
  department?: string;
  canteenId?: string;
  shopName?: string;
  phone?: string;
}

export type RushLevel = 'low' | 'moderate' | 'high';

export interface Canteen {
  id: string;
  name: string;
  location: string;
  image: string;
  rating: number;
  rushLevel: RushLevel;
  activeOrdersCount: number;
  openingHours: string;
  phone: string;
  description: string;
  counterNumber: string;
}

export type FoodCategory =
  | 'All'
  | 'Breakfast'
  | 'Snacks'
  | 'South Indian'
  | 'North Indian'
  | 'Beverages'
  | 'Meals'
  | 'Combos';

export interface FoodItem {
  id: string;
  canteenId: string;
  name: string;
  description: string;
  price: number;
  category: FoodCategory;
  prepTimeMinutes: number;
  isVeg: boolean;
  isAvailable: boolean;
  image: string;
  rating: number;
  reviewsCount: number;
  calories: number;
  tags?: string[];
  isBestSeller?: boolean;
  stockLeft?: number;
}

export interface BreakSchedule {
  id: string;
  name: string;
  startTime: string; // e.g. "12:30 PM"
  endTime: string;   // e.g. "01:20 PM"
  description: string;
  isDefault: boolean;
  isActive: boolean;
}

export type SlotStatus = 'available' | 'limited' | 'full';

export interface PickupSlot {
  id: string;
  breakId: string;
  canteenId: string;
  dateString: string; // e.g. "Today, 27 Nov"
  timeString: string; // e.g. "12:35 PM"
  maxCapacity: number;
  currentBooked: number;
  status: SlotStatus;
}

export interface CartItem {
  foodItem: FoodItem;
  quantity: number;
  notes?: string;
}

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'collected'
  | 'cancelled';

export type PaymentMethod = 'UPI' | 'Card' | 'Cash at Counter';

export type PaymentStatus =
  | 'payment_pending'
  | 'verification_required'
  | 'verified'
  | 'failed'
  | 'refunded';

export interface Order {
  id: string;
  tokenNumber: string; // e.g. "BB-2026-1024"
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  canteenId: string;
  canteenName: string;
  items: CartItem[];
  breakId: string;
  breakName: string;
  pickupTime: string; // e.g. "12:35 PM"
  pickupDate: string; // e.g. "27 Nov 2026"
  subtotal: number;
  platformFee: number;
  tax: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  utrReference?: string;
  screenshotUrl?: string;
  paymentVerifiedAt?: string;
  paymentVerifiedBy?: string;
  qrDataUrl?: string;
  createdAt: string;
  estimatedReadyTime: string;
  collectedAt?: string;
  cancellationReason?: string;
  rating?: {
    score: number;
    comment?: string;
    ratedAt: string;
  };
  groupCode?: string;
}

export interface GroupOrderMember {
  userId: string;
  userName: string;
  userAvatar?: string;
  joinedAt: string;
  items: CartItem[];
}

export interface GroupOrderSession {
  id: string;
  roomCode: string;
  hostUserId: string;
  hostUserName: string;
  canteenId: string;
  canteenName: string;
  breakName: string;
  pickupTime: string;
  members: GroupOrderMember[];
  status: 'open' | 'locked' | 'ordered';
  finalOrderId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'urgent';
  createdAt: string;
  author: string;
  isActive: boolean;
}

export interface AppNotification {
  id: string;
  targetRole: 'student' | 'vendor' | 'admin' | 'all';
  targetUserId?: string;
  title: string;
  message: string;
  type: 'order' | 'slot' | 'system' | 'reminder';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface KitchenCapacitySettings {
  maxOrdersPerSlot: number;
  bufferMinutes: number;
  averagePrepTime: number;
  activeCookingStations: number;
  slotIntervalMinutes: number;
}

export interface StudentSession {
  registrationId: string;
  name: string;
  mobileNumber: string;
  loggedInAt: string;
}

export type SupportTicketCategory =
  | 'Food Ordering'
  | 'Payments & Refunds'
  | 'Order Not Ready'
  | 'Pickup & Tokens'
  | 'Cancellations'
  | 'Account & Login'
  | 'Technical Issues'
  | 'Other';

export type SupportTicketStatus = 'Submitted' | 'Under Review' | 'Resolved';

export interface SupportTicket {
  id: string; // e.g. "BB-HELP-1024"
  studentName: string;
  registrationId: string;
  mobileNumber: string;
  category: SupportTicketCategory;
  orderId?: string;
  subject: string;
  description: string;
  status: SupportTicketStatus;
  createdAt: string;
  resolutionNote?: string;
}
