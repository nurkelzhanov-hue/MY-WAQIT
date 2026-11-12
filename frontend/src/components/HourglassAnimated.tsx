import './hourglass.css'

// A living hourglass drawn in SVG: sand drains from the top bulb, falls through the neck,
// piles up in the bottom bulb, then the glass turns over and it starts again.
// The glass, frame and gold caps are symmetric, so the 180 degree turn loops seamlessly;
// the sand layers are drawn outside the turning group and fade while the glass turns.
export default function HourglassAnimated() {
  const glass =
    'M58,40 C58,88 94,108 97,135 C94,162 58,182 58,230 L142,230 C142,182 106,162 103,135 C106,108 142,88 142,40 Z'

  return (
    <svg className="hg" viewBox="0 0 200 270" role="img" aria-label="MY WAQIT">
      <defs>
        <radialGradient id="hgGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f4b43f" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#f4b43f" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hgGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffe08a" />
          <stop offset="55%" stopColor="#f4b43f" />
          <stop offset="100%" stopColor="#b9731a" />
        </linearGradient>
        <linearGradient id="hgSand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd46b" />
          <stop offset="100%" stopColor="#e39a27" />
        </linearGradient>
        <linearGradient id="hgGlass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9fd0ff" stopOpacity="0.28" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#9fd0ff" stopOpacity="0.2" />
        </linearGradient>
        <clipPath id="hgClipGlass">
          <path d={glass} />
        </clipPath>
        <clipPath id="hgClipUpper">
          <rect x="0" y="0" width="200" height="135" />
        </clipPath>
        <clipPath id="hgClipLower">
          <rect x="0" y="135" width="200" height="135" />
        </clipPath>
      </defs>

      <circle cx="100" cy="135" r="104" fill="url(#hgGlow)" />

      {/* sand (does not turn; fades while the glass turns) */}
      <g className="hg-sand" clipPath="url(#hgClipGlass)">
        <g clipPath="url(#hgClipUpper)">
          <rect className="hg-top" x="40" y="58" width="120" height="78" fill="url(#hgSand)" />
        </g>
        <g clipPath="url(#hgClipLower)">
          <rect className="hg-stream" x="99.2" y="135" width="1.6" height="100" fill="#ffd46b" />
          <path
            className="hg-pile"
            d="M52,232 C76,218 90,184 100,176 C110,184 124,218 148,232 Z"
            fill="url(#hgSand)"
          />
        </g>
      </g>

      {/* glass + frame (symmetric, turns over) */}
      <g className="hg-frame">
        <path d={glass} fill="url(#hgGlass)" stroke="#bfe0ff" strokeOpacity="0.7" strokeWidth="2" />
        <rect x="46" y="38" width="5" height="196" rx="2.5" fill="url(#hgGold)" />
        <rect x="149" y="38" width="5" height="196" rx="2.5" fill="url(#hgGold)" />
        <rect x="40" y="20" width="120" height="19" rx="7" fill="url(#hgGold)" />
        <rect x="40" y="231" width="120" height="19" rx="7" fill="url(#hgGold)" />
      </g>

      {/* glass shine (static) */}
      <path d="M66,52 C66,84 80,98 86,112" fill="none" stroke="#fff" strokeOpacity="0.35" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}
