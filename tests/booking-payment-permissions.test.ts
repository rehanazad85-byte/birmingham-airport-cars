import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("booking payment database permissions", () => {
  it("allows the service role to update only booking status", () => {
    const migration = fs.readFileSync(
      "supabase/migrations/202610250001_booking_payment_status_permission.sql",
      "utf8",
    );

    expect(migration).toContain(
      "grant update (status)\non table public.bookings\nto service_role;",
    );
    expect(migration).not.toMatch(
      /grant\s+update\s+on\s+table\s+public\.bookings\s+to\s+service_role/i,
    );
    expect(migration).not.toMatch(/grant\s+delete/i);
  });
});
