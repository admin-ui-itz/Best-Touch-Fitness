import { NextResponse } from "next/server";

import { getIntegrationStatus } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Health/status endpoint. Useful for an external uptime monitor (UptimeRobot,
 * Better Uptime, a status page) since Netlify itself does not require a
 * custom healthcheck for deploys. Exposes only boolean configuration flags,
 * never values.
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
