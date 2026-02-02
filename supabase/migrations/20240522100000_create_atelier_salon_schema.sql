-- Create the hair style categories table
CREATE TABLE IF NOT EXISTS public.hair_style_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- Create the hair styles table
CREATE TABLE IF NOT EXISTS public.hair_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.hair_style_categories(id) ON DELETE SET NULL,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  overlay_image_url TEXT,
  transform_values JSONB DEFAULT '{"scale": 1, "positionX": 0, "positionY": 0}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, name)
);

-- Enable RLS
ALTER TABLE public.hair_style_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hair_styles ENABLE ROW LEVEL SECURITY;

-- Create policies for tenant access
CREATE POLICY "Allow tenant access to hair style categories" ON public.hair_style_categories FOR ALL USING (tenant_id = (select auth.jwt() ->> 'app_metadata' ->> 'tenant_id')::uuid);
CREATE POLICY "Allow tenant access to hair styles" ON public.hair_styles FOR ALL USING (tenant_id = (select auth.jwt() ->> 'app_metadata' ->> 'tenant_id')::uuid);
