-- Stripe payment webhooks must be able to move a booking out of pending_payment.
-- Keep the service role permission narrowly scoped to the status column only.
grant update (status)
on table public.bookings
to service_role;
