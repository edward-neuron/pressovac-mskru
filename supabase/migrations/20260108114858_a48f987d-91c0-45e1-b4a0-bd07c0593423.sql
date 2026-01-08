-- Create products table for store catalog
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  currency_id TEXT DEFAULT 'RUB',
  category_id TEXT NOT NULL,
  picture TEXT,
  vendor_code TEXT,
  description TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create categories table
CREATE TABLE public.product_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES public.product_categories(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_products_vendor_code ON public.products(vendor_code);
CREATE INDEX idx_categories_parent ON public.product_categories(parent_id);

-- Enable RLS (public read access for store)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Public read access for products
CREATE POLICY "Products are publicly readable"
ON public.products
FOR SELECT
USING (true);

-- Public read access for categories
CREATE POLICY "Categories are publicly readable"
ON public.product_categories
FOR SELECT
USING (true);

-- Admin write access for products
CREATE POLICY "Admins can manage products"
ON public.products
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Admin write access for categories
CREATE POLICY "Admins can manage categories"
ON public.product_categories
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();