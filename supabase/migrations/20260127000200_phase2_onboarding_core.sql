-- =========================================================
-- Admin ESA Phase 2: Onboarding + Feature Flags + Auditing
-- Additive, safe to run after shadow_core migration.
-- =========================================================

create extension if not exists "pgcrypto";

-- Helper: current email from JWT (works for authenticated requests)
create or replace function public.current_email()
returns text
language sql
stable
as $$
  select coalesce(nullif(auth.jwt() ->> 'email', ''), null);
$$;

-- Tenant feature flags
create table if not exists public.tenant_features (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  feature_key text not null,
  is_enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, feature_key)
);

alter table public.tenant_features enable row level security;

drop policy if exists "tenant_features_select_member" on public.tenant_features;
create policy "tenant_features_select_member"
on public.tenant_features
for select
using (public.is_member(tenant_id));

drop policy if exists "tenant_features_write_admin" on public.tenant_features;
create policy "tenant_features_write_admin"
on public.tenant_features
for insert
with check (public.has_at_least(tenant_id, 'admin') or public.is_tech());

drop policy if exists "tenant_features_update_admin" on public.tenant_features;
create policy "tenant_features_update_admin"
on public.tenant_features
for update
using (public.has_at_least(tenant_id, 'admin') or public.is_tech())
with check (public.has_at_least(tenant_id, 'admin') or public.is_tech());

drop policy if exists "tenant_features_delete_admin" on public.tenant_features;
create policy "tenant_features_delete_admin"
on public.tenant_features
for delete
using (public.has_at_least(tenant_id, 'admin') or public.is_tech());

-- Invitations (email-based)
create table if not exists public.tenant_invitations (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  email text not null,
  role public.esa_role not null default 'viewer',
  token text not null unique,
  status text not null default 'invited',
  expires_at timestamptz not null default (now() + interval '7 days'),
  accepted_at timestamptz,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'tenant_invitations_status_check') then
    alter table public.tenant_invitations
      add constraint tenant_invitations_status_check
      check (status in ('invited','accepted','revoked','expired'));
  end if;
exception when others then
end $$;

alter table public.tenant_invitations enable row level security;

-- Invited users can read their own invitation by email; admins/tech can read all for tenant
drop policy if exists "tenant_invitations_select" on public.tenant_invitations;
create policy "tenant_invitations_select"
on public.tenant_invitations
for select
using (
  public.is_tech()
  or public.has_at_least(tenant_id, 'admin')
  or (public.current_email() is not null and lower(email) = lower(public.current_email()))
);

-- Only admins/tech can create/revoke invites
drop policy if exists "tenant_invitations_insert" on public.tenant_invitations;
create policy "tenant_invitations_insert"
on public.tenant_invitations
for insert
with check (
  public.is_tech() or public.has_at_least(tenant_id, 'admin')
);

drop policy if exists "tenant_invitations_update" on public.tenant_invitations;
create policy "tenant_invitations_update"
on public.tenant_invitations
for update
using (
  public.is_tech() or public.has_at_least(tenant_id, 'admin')
  or (public.current_email() is not null and lower(email) = lower(public.current_email()))
)
with check (
  public.is_tech() or public.has_at_least(tenant_id, 'admin')
  or (public.current_email() is not null and lower(email) = lower(public.current_email()))
);

-- Audit log (append-only)
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  actor_user_id uuid references auth.users(id),
  action text not null,
  entity text,
  entity_id text,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.audit_logs enable row level security;

drop policy if exists "audit_select_admin" on public.audit_logs;
create policy "audit_select_admin"
on public.audit_logs
for select
using (
  public.is_tech()
  or (tenant_id is not null and public.has_at_least(tenant_id, 'admin'))
);

drop policy if exists "audit_insert_system" on public.audit_logs;
create policy "audit_insert_system"
on public.audit_logs
for insert
with check (
  public.is_tech()
  or (tenant_id is not null and public.is_member(tenant_id))
);
