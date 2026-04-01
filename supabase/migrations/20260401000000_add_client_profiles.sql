create table if not exists client_profiles (
  photographer_id uuid references photographers(id) on delete cascade not null,
  client_name text not null,
  email text,
  phone text,
  tags text[],
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (photographer_id, client_name)
);

alter table client_profiles enable row level security;

create policy "Photographers can view their own client profiles"
  on client_profiles for select to authenticated
  using (photographer_id = auth.uid());

create policy "Photographers can update their own client profiles"
  on client_profiles for update to authenticated
  using (photographer_id = auth.uid());

create policy "Photographers can insert their own client profiles"
  on client_profiles for insert to authenticated
  with check (photographer_id = auth.uid());
