import type { BookingRecord } from "@/lib/booking-record";

export interface BookingPersistenceResult {
  record: BookingRecord;
  created: boolean;
}

export interface BookingRepository {
  insertOrGet(record: BookingRecord): Promise<BookingPersistenceResult>;
}

export class BookingPersistenceError extends Error {
  constructor(public readonly code: "UNAVAILABLE" | "IDEMPOTENCY_CONFLICT") {
    super(code === "IDEMPOTENCY_CONFLICT" ? "The booking request does not match the existing submission." : "Secure booking storage is currently unavailable.");
    this.name = "BookingPersistenceError";
  }
}

function persistenceFailure(reason: string, status?: number): BookingPersistenceError {
  console.error("BOOKING_PERSISTENCE_FAILED", { reason, ...(status === undefined ? {} : { status }) });
  return new BookingPersistenceError("UNAVAILABLE");
}

export function createSupabaseBookingRepository(options: {
  url?: string;
  serviceRoleKey?: string;
  fetchImplementation?: typeof fetch;
} = {}): BookingRepository {
  const url = options.url ?? process.env.SUPABASE_URL;
  const serviceRoleKey = options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) throw persistenceFailure("missing_configuration");

  let endpoint: URL;
  try {
    endpoint = new URL("/rest/v1/bookings", url);
    if (endpoint.protocol !== "https:" && endpoint.hostname !== "localhost" && endpoint.hostname !== "127.0.0.1") throw new Error("Invalid protocol");
  } catch {
    throw persistenceFailure("invalid_configuration");
  }
  const fetchImplementation = options.fetchImplementation ?? fetch;
  const headers = { apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}`, "Content-Type": "application/json" };

  return {
    async insertOrGet(record) {
      let response: Response;
      try {
        const insertUrl = new URL(endpoint);
        insertUrl.searchParams.set("on_conflict", "idempotency_key");
        response = await fetchImplementation(insertUrl, {
          method: "POST",
          headers: { ...headers, Prefer: "resolution=ignore-duplicates,return=representation" },
          body: JSON.stringify(record),
          cache: "no-store",
        });
      } catch {
        throw persistenceFailure("request_failed");
      }
      if (!response.ok) throw persistenceFailure("supabase_non_2xx", response.status);

      let inserted: BookingRecord[];
      try {
        inserted = await response.json() as BookingRecord[];
      } catch {
        throw persistenceFailure("invalid_response");
      }
      if (!Array.isArray(inserted)) throw persistenceFailure("invalid_response");
      if (inserted.length === 1 && inserted[0]?.idempotency_key === record.idempotency_key) return { record: inserted[0], created: true };
      if (inserted.length !== 0) throw new BookingPersistenceError("UNAVAILABLE");

      let existingResponse: Response;
      try {
        const existingUrl = new URL(endpoint);
        existingUrl.searchParams.set("idempotency_key", `eq.${record.idempotency_key}`);
        existingUrl.searchParams.set("limit", "1");
        existingResponse = await fetchImplementation(existingUrl, { headers, cache: "no-store" });
      } catch {
        throw persistenceFailure("replay_request_failed");
      }
      if (!existingResponse.ok) throw persistenceFailure("replay_non_2xx", existingResponse.status);
      let existing: BookingRecord[];
      try {
        existing = await existingResponse.json() as BookingRecord[];
      } catch {
        throw persistenceFailure("invalid_replay_response");
      }
      if (!Array.isArray(existing) || existing.length !== 1 || existing[0]?.idempotency_key !== record.idempotency_key) throw persistenceFailure("invalid_replay_response");
      if (existing[0].request_fingerprint !== record.request_fingerprint) throw new BookingPersistenceError("IDEMPOTENCY_CONFLICT");
      return { record: existing[0], created: false };
    },
  };
}
