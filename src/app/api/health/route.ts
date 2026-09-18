import { NextResponse } from "next/server";

import { getIntegrationStatus } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Liveness/readiness probe for Coolify and the Docker HEALTHCHECK.
 * Exposes only boolean configuration flags, never values.
 */
export function GET() {
  return NextResponse.json(
    {
      status: "ok",
      time: new Date().toISOString(),
      uptimeSeconds: Math.round(process.uptime()),
      integrations: getIntegrationStatus(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
