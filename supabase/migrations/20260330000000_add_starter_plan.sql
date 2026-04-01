-- Add 'starter' to the plan check constraint
-- and update the billing columns RLS policy to allow webhook service role writes

ALTER TABLE public.photographers
  DROP CONSTRAINT IF EXISTS photographers_plan_check;

ALTER TABLE public.photographers
  ADD CONSTRAINT photographers_plan_check
  CHECK (plan IN ('free', 'starter', 'pro', 'professional'));
