/**
 * Static illustration used as the hero accent when the 3D scene is not
 * loaded (mobile, reduced motion, no WebGL, or before the scene is ready).
 */
export function DumbbellMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 320" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="dm-plate" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3e44" />
          <stop offset="1" stopColor="#1c1e21" />
        </linearGradient>
        <linearGradient id="dm-bar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9ced6" />
          <stop offset="0.5" stopColor="#7f858f" />
          <stop offset="1" stopColor="#3f434a" />
        </linearGradient>
        <radialGradient id="dm-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#c8ef3a" stopOpacity="0.28" />
          <stop offset="1" stopColor="#c8ef3a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="160" cy="170" r="150" fill="url(#dm-glow)" />
      <g transform="rotate(-24 160 160)">
        {/* bar */}
        <rect x="70" y="150" width="180" height="20" rx="10" fill="url(#dm-bar)" />
        {/* collars */}
        <rect x="96" y="141" width="14" height="38" rx="5" fill="#c8ef3a" />
        <rect x="210" y="141" width="14" height="38" rx="5" fill="#c8ef3a" />
        {/* inner plates */}
        <rect x="52" y="112" width="40" height="96" rx="12" fill="url(#dm-plate)" />
        <rect x="228" y="112" width="40" height="96" rx="12" fill="url(#dm-plate)" />
        {/* outer plates */}
        <rect x="24" y="124" width="26" height="72" rx="10" fill="url(#dm-plate)" />
        <rect x="270" y="124" width="26" height="72" rx="10" fill="url(#dm-plate)" />
        {/* highlights */}
        <rect x="60" y="120" width="6" height="80" rx="3" fill="#ffffff" opacity="0.08" />
        <rect x="236" y="120" width="6" height="80" rx="3" fill="#ffffff" opacity="0.08" />
      </g>
    </svg>
  );
}
