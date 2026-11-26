-- ==============================================================
-- BREAKBITE — DATABASE SCHEMA (PostgreSQL / Supabase)
-- 15 MIN. 1 SAMOSA. — Skip the Queue. Not Your Break.
-- ==============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('student', 'vendor', 'admin')),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. STUDENT PROFILES
CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  student_id_number VARCHAR(50) NOT NULL,
  university_name VARCHAR(255) DEFAULT 'Demo University' NOT NULL,
  department VARCHAR(100),
  year_of_study INT DEFAULT 3
);

-- 3. CANTEENS & DINING COUNTERS
CREATE TABLE IF NOT EXISTS public.canteens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  counter_number VARCHAR(50) NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  rating DECIMAL(2,1) DEFAULT 4.8,
  rush_level VARCHAR(20) DEFAULT 'low' CHECK (rush_level IN ('low', 'moderate', 'high')),
  opening_time TIME DEFAULT '08:30:00',
  closing_time TIME DEFAULT '19:00:00',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. VENDORS TABLE
CREATE TABLE IF NOT EXISTS public.vendors (
  id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE SET NULL,
  shop_name VARCHAR(255) NOT NULL,
  upi_id VARCHAR(100) DEFAULT '9211437989@ptyes',
  merchant_name VARCHAR(100) DEFAULT 'Deepak Das',
  requires_manual_payment_verification BOOLEAN DEFAULT TRUE,
  max_orders_per_slot INT DEFAULT 10,
  slot_interval_minutes INT DEFAULT 5,
  prep_buffer_minutes INT DEFAULT 5
);

-- 5. FOOD CATEGORIES
CREATE TABLE IF NOT EXISTS public.food_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  display_order INT DEFAULT 0
);

-- 6. FOOD ITEMS
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.food_categories(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  prep_time_minutes INT DEFAULT 8 NOT NULL,
  is_veg BOOLEAN DEFAULT TRUE,
  is_available BOOLEAN DEFAULT TRUE,
  image_url TEXT,
  calories INT DEFAULT 200,
  is_bestseller BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PICKUP SLOTS & CAPACITY
CREATE TABLE IF NOT EXISTS public.pickup_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE CASCADE NOT NULL,
  slot_date DATE NOT NULL,
  slot_time VARCHAR(20) NOT NULL, -- e.g. '12:35 PM'
  max_capacity INT DEFAULT 10 NOT NULL,
  booked_count INT DEFAULT 0 NOT NULL,
  is_blocked BOOLEAN DEFAULT FALSE,
  CONSTRAINT slot_unique_per_canteen UNIQUE (canteen_id, slot_date, slot_time)
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. 'BB-2026-1024'
  student_id UUID REFERENCES public.users(id) ON DELETE RESTRICT NOT NULL,
  vendor_id UUID REFERENCES public.users(id) ON DELETE RESTRICT,
  canteen_id UUID REFERENCES public.canteens(id) ON DELETE RESTRICT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time VARCHAR(20) NOT NULL,
  break_name VARCHAR(100) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  platform_fee DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  order_status VARCHAR(30) DEFAULT 'placed' CHECK (
    order_status IN ('placed', 'accepted', 'preparing', 'ready', 'collected', 'cancelled')
  ),
  payment_status VARCHAR(30) DEFAULT 'payment_pending' CHECK (
    payment_status IN ('payment_pending', 'verification_required', 'verified', 'failed', 'refunded')
  ),
  payment_method VARCHAR(30) DEFAULT 'UPI',
  qr_data_url TEXT,
  estimated_ready_time VARCHAR(50),
  cancellation_reason TEXT,
  collected_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE RESTRICT NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  notes TEXT
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(30) NOT NULL,
  utr_reference VARCHAR(100),
  screenshot_url TEXT,
  merchant_vpa VARCHAR(100) DEFAULT '9211437989@ptyes',
  status VARCHAR(30) DEFAULT 'pending_verification' CHECK (
    status IN ('pending_verification', 'verified', 'failed', 'refunded')
  ),
  verified_by UUID REFERENCES public.users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  target_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  target_role VARCHAR(20) DEFAULT 'all',
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'order',
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. REVIEWS & RATINGS
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================
-- INDEXES FOR ULTRA-FAST LOOKUPS & CAPACITY QUERIES
-- ==============================================================
CREATE INDEX IF NOT EXISTS idx_orders_student ON public.orders(student_id);
CREATE INDEX IF NOT EXISTS idx_orders_canteen ON public.orders(canteen_id);
CREATE INDEX IF NOT EXISTS idx_orders_slot ON public.orders(pickup_date, pickup_time);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status, payment_status);
CREATE INDEX IF NOT EXISTS idx_pickup_slots_date_canteen ON public.pickup_slots(canteen_id, slot_date);

-- ==============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Students can only read/create their own orders
CREATE POLICY student_orders_policy ON public.orders
  FOR ALL USING (auth.uid() = student_id);

-- Vendors can only manage orders for their assigned canteen
CREATE POLICY vendor_orders_policy ON public.orders
  FOR ALL USING (
    canteen_id IN (SELECT canteen_id FROM public.vendors WHERE id = auth.uid())
  );
