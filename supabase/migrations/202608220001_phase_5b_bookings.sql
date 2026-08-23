create type public.booking_status as enum (
  'pending_payment',
  'deposit_paid',
  'paid',
  'confirmed',
  'cancelled',
  'payment_failed'
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  booking_reference text not null unique check (booking_reference ~ '^BAC-[A-F0-9]{8}$'),
  idempotency_key text not null unique,
  request_fingerprint text not null,
  created_at timestamptz not null default now(),
  status public.booking_status not null default 'pending_payment',
  customer_full_name text not null,
  customer_mobile text not null,
  customer_email text not null,
  booking_notes text not null default '',
  terms_accepted_at timestamptz not null,
  pickup_place jsonb not null,
  pickup_building text not null default '',
  destination_place jsonb not null,
  destination_building text not null default '',
  outward_date date not null,
  outward_time time not null,
  return_date date,
  return_time time,
  journey_type text not null check (journey_type in ('one-way', 'return')),
  vehicle text not null check (vehicle in ('saloon', 'estate', 'mpv', 'executive', 'large-mpv')),
  passengers integer not null check (passengers > 0),
  luggage integer not null check (luggage >= 0),
  pickup_airport text,
  destination_airport text,
  outward_route jsonb not null,
  return_route jsonb,
  outward_birmingham_access text not null check (outward_birmingham_access in ('free', 'drop-and-go')),
  return_birmingham_access text check (return_birmingham_access in ('free', 'drop-and-go')),
  outward_airport_charges jsonb not null default '[]'::jsonb,
  return_airport_charges jsonb not null default '[]'::jsonb,
  outward_journey_fare_pence integer not null check (outward_journey_fare_pence >= 0),
  return_journey_fare_pence integer not null default 0 check (return_journey_fare_pence >= 0),
  outward_airport_access_pence integer not null default 0 check (outward_airport_access_pence >= 0),
  return_airport_access_pence integer not null default 0 check (return_airport_access_pence >= 0),
  return_saving_pence integer not null default 0 check (return_saving_pence >= 0),
  total_pence integer not null check (total_pence >= 0),
  deposit_percentage integer not null check (deposit_percentage between 0 and 100),
  deposit_pence integer not null check (deposit_pence >= 0),
  balance_pence integer not null check (balance_pence >= 0),
  outward_flight jsonb,
  return_flight jsonb,
  constraint booking_deposit_balance_matches_total check (deposit_pence + balance_pence = total_pence),
  constraint booking_return_details_match_type check (
    (journey_type = 'one-way' and return_date is null and return_time is null and return_route is null and return_birmingham_access is null)
    or (journey_type = 'return' and return_date is not null and return_time is not null and return_route is not null and return_birmingham_access is not null)
  )
);

alter table public.bookings enable row level security;
revoke all on table public.bookings from anon, authenticated;
grant select, insert
on table public.bookings
to service_role;
