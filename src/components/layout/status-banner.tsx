import { env, listUnconfiguredIntegrations } from "@/lib/env";

/**
 * Shown on non-production environments only. Makes unconfigured
 * integrations obvious to the developer/owner while previewing.
 */
export function StatusBanner() {
  if (env.isProduction) return null;
  const missing = listUnconfiguredIntegrations();
  if (missing.length === 0) return null;
  return (
    <div className="border-b border-amber-300 bg-amber-50 text-amber-950" role="status">
      <div className="container-x py-2 text-xs sm:text-sm">
        <p className="font-semibold">
          Preview environment ({env.siteEnv}). Not configured: {missing.length} integration
          {missing.length === 1 ? "" : "s"}.
        </p>
        <ul className="mt-1 list-disc pl-5">
          {missing.map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
