import { getClassBySlug } from "@/config/classes";
import { siteConfig } from "@/config/site";

/**
 * Renders the weekly timetable ONLY when real schedule data exists in
 * siteConfig.timetable. Returns null otherwise so no placeholder times
 * are ever published.
 */
export function Timetable({ className = "" }: { className?: string }) {
  const entries = siteConfig.timetable;
  if (!entries || entries.length === 0) return null;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
  const byDay = days
    .map((day) => ({ day, sessions: entries.filter((e) => e.day === day) }))
    .filter((d) => d.sessions.length > 0);

  return (
    <div className={className}>
      <h3 className="text-2xl">Weekly timetable</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <caption className="sr-only">Weekly class timetable</caption>
          <thead>
            <tr className="border-b-2 border-charcoal-900">
              <th scope="col" className="py-3 pr-4 font-display text-xs uppercase tracking-[0.18em]">
                Day
              </th>
              <th scope="col" className="py-3 pr-4 font-display text-xs uppercase tracking-[0.18em]">
                Time
              </th>
              <th scope="col" className="py-3 pr-4 font-display text-xs uppercase tracking-[0.18em]">
                Class
              </th>
              <th scope="col" className="py-3 font-display text-xs uppercase tracking-[0.18em]">
                Location
              </th>
            </tr>
          </thead>
          <tbody>
            {byDay.flatMap(({ day, sessions }) =>
              sessions.map((s, i) => (
                <tr key={`${day}-${s.start}-${s.classSlug}`} className="border-b border-cream-300">
                  <th scope="row" className="py-3 pr-4 font-semibold">
                    {i === 0 ? day : <span className="sr-only">{day}</span>}
                  </th>
                  <td className="py-3 pr-4 tabular-nums">
                    {s.start}
                    {s.end ? ` to ${s.end}` : ""}
                  </td>
                  <td className="py-3 pr-4">{getClassBySlug(s.classSlug)?.name ?? s.classSlug}</td>
                  <td className="py-3 text-ink-muted">{s.location ?? ""}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
