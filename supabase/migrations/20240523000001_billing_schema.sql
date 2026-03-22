-- Add billing fields to the photographers table
alter table public.photographers
add column stripe_customer_id text,
add column stripe_subscription_id text,
add column stripe_price_id text,
add column stripe_current_period_end timestamp with time zone;
