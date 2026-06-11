-- Run this in Supabase SQL Editor to set up the database

CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  condition TEXT DEFAULT 'Excellent',
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount TEXT,
  est_retail DECIMAL(10,2),
  image_url TEXT,
  images JSONB DEFAULT '[]',
  is_cardi_pick BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id BIGSERIAL PRIMARY KEY,
  items JSONB DEFAULT '[]',
  total DECIMAL(10,2) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  shipping_address TEXT,
  status TEXT DEFAULT 'pending',
  payment_method TEXT DEFAULT '',
  payment_status TEXT DEFAULT 'pending',
  payment_ref TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT '';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_ref TEXT DEFAULT '';

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read products" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can insert products" ON public.products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Admins can update products" ON public.products
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can delete products" ON public.products
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can read orders" ON public.orders
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
