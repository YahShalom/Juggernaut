
-- Helper function to extract tenant_id from JWT claims
CREATE OR REPLACE FUNCTION app_current_tenant_id()
RETURNS UUID AS $$
  SELECT (auth.jwt() ->> 'app_metadata' ->> 'tenant_id')::uuid
$$ LANGUAGE sql STABLE;

-- RLS policies for atelier_sessions
ALTER TABLE public.atelier_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow tenant access to atelier_sessions" ON public.atelier_sessions;
CREATE POLICY "Allow tenant access to atelier_sessions" ON public.atelier_sessions FOR ALL USING (tenant_id = app_current_tenant_id());

-- RLS policies for atelier_inputs
ALTER TABLE public.atelier_inputs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow tenant access to atelier_inputs" ON public.atelier_inputs;
CREATE POLICY "Allow tenant access to atelier_inputs" ON public.atelier_inputs FOR ALL USING (tenant_id = app_current_tenant_id());

-- RLS policies for atelier_recommendations
ALTER TABLE public.atelier_recommendations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow tenant access to atelier_recommendations" ON public.atelier_recommendations;
CREATE POLICY "Allow tenant access to atelier_recommendations" ON public.atelier_recommendations FOR ALL USING (tenant_id = app_current_tenant_id());

-- RLS policies for tenant_credit_ledger
ALTER TABLE public.tenant_credit_ledger ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow tenant access to tenant_credit_ledger" ON public.tenant_credit_ledger;
CREATE POLICY "Allow tenant access to tenant_credit_ledger" ON public.tenant_credit_ledger FOR ALL USING (tenant_id = app_current_tenant_id());

-- RLS policies for billing_ai_events
ALTER TABLE public.billing_ai_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow tenant access to billing_ai_events" ON public.billing_ai_events;
CREATE POLICY "Allow tenant access to billing_ai_events" ON public.billing_ai_events FOR ALL USING (tenant_id = app_current_tenant_id());
