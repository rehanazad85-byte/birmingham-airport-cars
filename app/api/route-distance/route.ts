import { NextResponse } from "next/server";
import { computeDrivingRoute, isCoordinates } from "@/lib/routes";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid route request." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid route request." }, { status: 400 });
  }

  const { origin, destination } = body as Record<string, unknown>;
  if (!isCoordinates(origin) || !isCoordinates(destination)) {
    return NextResponse.json({ error: "Invalid journey coordinates." }, { status: 400 });
  }

  try {
    return NextResponse.json(await computeDrivingRoute(origin, destination));
  } catch {
    return NextResponse.json({ error: "Route calculation is currently unavailable." }, { status: 503 });
  }
}
