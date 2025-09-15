-- Enable needed extensions
create extension if not exists pgcrypto;
create extension if not exists pgjwt;

-- Creators
create table public.creators (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  slug text unique generated always as (lower(regexp_replace(display_name,'[^a-zA-Z0-9]+','-','g'))) stored,
  image_url text not null,
  tags text[] default '{}',
  bio text,
  x_url text,
  onlyfans_url text,
  elo int not null default 1200,
  wins int not null default 0,
  losses int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Duels (pairings shown to voters)
create table public.duels (
  id bigserial primary key,
  a uuid not null references public.creators(id),
  b uuid not null references public.creators(id),
  shown_at timestamptz not null default now()
);

-- Votes (each vote recorded; store only hashed IP/fingerprint if desired)
create table public.votes (
  id bigserial primary key,
  duel_id bigint not null references public.duels(id),
  winner uuid not null references public.creators(id),
  loser uuid not null references public.creators(id),
  ip_hash text,
  fp text,
  created_at timestamptz not null default now()
);

create index on public.creators (elo desc);
create index on public.creators (active) where active = true;
create index on public.votes (created_at desc);

-- RLS: allow reads to everyone, writes only for service role
alter table public.creators enable row level security;
alter table public.duels enable row level security;
alter table public.votes enable row level security;

create policy "public read creators" on public.creators
  for select using (true);

create policy "public read duels" on public.duels
  for select using (true);

create policy "public read votes aggregate" on public.votes
  for select using (true);
