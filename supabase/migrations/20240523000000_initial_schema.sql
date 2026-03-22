-- photographers
create table photographers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null unique,
  name text not null,
  bio text,
  slug text unique not null,
  avatar_url text,
  plan text default 'free' check (plan in ('free','pro','professional')),
  created_at timestamptz default now()
);

-- sessions (photo shoots)
create table sessions (
  id uuid primary key default gen_random_uuid(),
  photographer_id uuid references photographers not null,
  title text not null,
  client_name text not null,
  slug text unique not null,
  cover_photo_url text,
  style text default 'grid' check (style in ('grid','cinematic','story')),
  status text default 'draft' check (status in ('draft','active','archived')),
  password_hash text,
  expires_at timestamptz,
  view_count int default 0,
  created_at timestamptz default now()
);

-- photos
create table photos (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions not null,
  url text not null,
  thumbnail_url text,
  width int,
  height int,
  order_index int default 0,
  is_favorite bool default false,
  is_selected bool default false,
  created_at timestamptz default now()
);

-- RLS
alter table photographers enable row level security;
alter table sessions enable row level security;
alter table photos enable row level security;

create policy "own data" on photographers
  using (user_id = auth.uid());

create policy "own sessions" on sessions
  using (photographer_id = (select id from photographers where user_id = auth.uid()));

create policy "public active sessions" on sessions
  for select using (status = 'active');

create policy "own photos" on photos
  using (session_id in (
    select id from sessions where photographer_id = (
      select id from photographers where user_id = auth.uid()
    )
  ));

create policy "public photos" on photos
  for select using (
    session_id in (select id from sessions where status = 'active')
  );
