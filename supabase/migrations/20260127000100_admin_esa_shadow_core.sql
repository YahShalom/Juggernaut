-- ============================================
-- ADMIN ESA: SHADOW-MODE CORE (SAFE ADDITIVE)
-- ============================================
--
-- Adds membership-based tenant security in shadow mode.
-- Intentionally additive to avoid breaking existing flows.

-- 0) Extensions
create extension if not exists "pgcrypto";

-- 1) TENANTS: align columns expected by server code (additive)
alter table public.tenants
  add column if not exists brand_json jsonb default '{}'::jsonb,
  add column if not exists plan text default 'free',
  add column if not exists updated_at timestamptz default now();

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tenants_status_check'
  ) then
    alter table public.tenants
      add constraint tenants_status_check
      check (status in ('active','paused','archived'));
  end if;
exception when others then
  -- ignore if already exists or conflicts
end $$;

-- 2) ESA ROLE ENUM
do $$
begin
  if not exists (select 1 from pg_type where typname = 'esa_role') then
    create type public.esa_role as enum ('viewer','staff','admin','owner');
  end if;
end $$;

-- 3) TENANT MEMBERS (canonical)
create table if not exists public.tenant_members (
  tenant_id uuid not null references public.tenants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.esa_role not null default 'viewer',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (tenant_id, user_id)
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'tenant_members_status_check'
  ) then
    alter table public.tenant_members
      add constraint tenant_members_status_check
      check (status in ('active','invited','suspended','left'));
  end if;
exception when others then
end $$;

-- 4) GLOBAL TECH ROLE (optional but recommended)
create table if not exists public.global_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null,
  created_at timestamptz not null default now()
);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'global_roles_role_check'
  ) then
    alter table public.global_roles
      add constraint global_roles_role_check
      check (role in ('tech'));
  end if;
exception when others then
end $$;

-- 5) Helper functions (membership + role rank)
create or replace function public.is_tech()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.global_roles gr
    where gr.user_id = auth.uid() and gr.role = 'tech'
  );
$$;

create or replace function public.tenant_role(p_tenant_id uuid)
returns public.esa_role
language sql
stable
as $$
  select tm.role
  from public.tenant_members tm
  where tm.tenant_id = p_tenant_id
    and tm.user_id = auth.uid()
    and tm.status = 'active'
  limit 1;
$$;

create or replace function public.has_at_least(p_tenant_id uuid, p_min public.esa_role)
returns boolean
language sql
stable
as $$
  with r as (
    select public.tenant_role(p_tenant_id) as role
  )
  select
    public.is_tech()
    or (
      (select role from r) is not null
      and (
        case (select role from r)
          when 'viewer' then 1
          when 'staff'  then 2
          when 'admin'  then 3
          when 'owner'  then 4
        end
        >=
        case p_min
          when 'viewer' then 1
          when 'staff'  then 2
          when 'admin'  then 3
          when 'owner'  then 4
        end
      )
    );
$$;

create or replace function public.is_member(p_tenant_id uuid)
returns boolean
language sql
stable
as $$
  select public.is_tech()
  or exists (
    select 1 from public.tenant_members tm
    where tm.tenant_id = p_tenant_id
      and tm.user_id = auth.uid()
      and tm.status = 'active'
  );
$$;

-- 6) RLS: enable on new tables
alter table public.tenant_members enable row level security;
alter table public.global_roles enable row level security;

-- 7) RLS policies for memberships
drop policy if exists "tenant_members_select_self" on public.tenant_members;
create policy "tenant_members_select_self"
on public.tenant_members
for select
using (
  user_id = auth.uid()
  or public.is_tech()
  or public.has_at_least(tenant_id, 'admin')
);

drop policy if exists "tenant_members_manage_admin" on public.tenant_members;
create policy "tenant_members_manage_admin"
on public.tenant_members
for insert
with check (
  public.has_at_least(tenant_id, 'admin')
  or public.is_tech()
);

drop policy if exists "tenant_members_update_admin" on public.tenant_members;
create policy "tenant_members_update_admin"
on public.tenant_members
for update
using (
  public.has_at_least(tenant_id, 'admin')
  or public.is_tech()
)
with check (
  public.has_at_least(tenant_id, 'admin')
  or public.is_tech()
);

drop policy if exists "tenant_members_delete_admin" on public.tenant_members;
create policy "tenant_members_delete_admin"
on public.tenant_members
for delete
using (
  public.has_at_least(tenant_id, 'admin')
  or public.is_tech()
);

-- 8) RLS for tenants
alter table public.tenants enable row level security;

drop policy if exists "tenants_select_member" on public.tenants;
create policy "tenants_select_member"
on public.tenants
for select
using (
  public.is_tech()
  or public.is_member(id)
);

drop policy if exists "tenants_update_owner" on public.tenants;
create policy "tenants_update_owner"
on public.tenants
for update
using (
  public.has_at_least(id, 'owner')
  or public.has_at_least(id, 'admin')
  or public.is_tech()
)
with check (
  public.has_at_least(id, 'owner')
  or public.has_at_least(id, 'admin')
  or public.is_tech()
);

-- 9) ALIGN ATELIER SALON TABLES WITH UI (additive)
alter table public.hair_style_categories
  add column if not exists sort_order int not null default 0;

alter table public.hair_styles
  add column if not exists description text,
  add column if not exists status text not null default 'draft',
  add column if not exists overlay_image_path text,
  add column if not exists preview_image_path text,
  add column if not exists default_scale numeric not null default 1,
  add column if not exists default_offset_x numeric not null default 0,
  add column if not exists default_offset_y numeric not null default 0,
  add column if not exists default_rotation numeric not null default 0,
  add column if not exists default_opacity numeric not null default 1;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'hair_styles_status_check'
  ) then
    alter table public.hair_styles
      add constraint hair_styles_status_check
      check (status in ('draft','active','archived'));
  end if;
exception when others then
end $$;

-- 10) Replace hair table RLS policies (membership based)
alter table public.hair_style_categories enable row level security;
alter table public.hair_styles enable row level security;

-- Drop old policies (created in earlier migration)
drop policy if exists "Allow tenant access to hair style categories" on public.hair_style_categories;
drop policy if exists "Allow tenant access to hair styles" on public.hair_styles;

drop policy if exists "hair_categories_select_member" on public.hair_style_categories;
create policy "hair_categories_select_member"
on public.hair_style_categories
for select
using (public.is_member(tenant_id));

drop policy if exists "hair_categories_write_admin" on public.hair_style_categories;
create policy "hair_categories_write_admin"
on public.hair_style_categories
for insert
with check (public.has_at_least(tenant_id, 'admin'));

drop policy if exists "hair_categories_update_admin" on public.hair_style_categories;
create policy "hair_categories_update_admin"
on public.hair_style_categories
for update
using (public.has_at_least(tenant_id, 'admin'))
with check (public.has_at_least(tenant_id, 'admin'));

drop policy if exists "hair_categories_delete_admin" on public.hair_style_categories;
create policy "hair_categories_delete_admin"
on public.hair_style_categories
for delete
using (public.has_at_least(tenant_id, 'admin'));

drop policy if exists "hair_styles_select_member" on public.hair_styles;
create policy "hair_styles_select_member"
on public.hair_styles
for select
using (public.is_member(tenant_id));

drop policy if exists "hair_styles_write_admin" on public.hair_styles;
create policy "hair_styles_write_admin"
on public.hair_styles
for insert
with check (public.has_at_least(tenant_id, 'admin'));

drop policy if exists "hair_styles_update_admin" on public.hair_styles;
create policy "hair_styles_update_admin"
on public.hair_styles
for update
using (public.has_at_least(tenant_id, 'admin'))
with check (public.has_at_least(tenant_id, 'admin'));

drop policy if exists "hair_styles_delete_admin" on public.hair_styles;
create policy "hair_styles_delete_admin"
on public.hair_styles
for delete
using (public.has_at_least(tenant_id, 'admin'));
