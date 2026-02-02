create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  status text not null default 'active',
  created_at timestamp with time zone default now()
);

insert into public.tenants (slug, name)
values ('admin', 'Admin ESA Core')
on conflict (slug) do nothing;

alter table public.tenants enable row level security;

create policy if not exists "read tenants"
on public.tenants
for select
using (true);