type Props = { size?: number }

// Small gold hourglass used as the brand mark in the app header.
export default function HourglassMark({ size = 34 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="hg-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdd46e" />
          <stop offset="1" stopColor="#e39a27" />
        </linearGradient>
      </defs>
      <rect x="7" y="3.5" width="26" height="4" rx="2" fill="url(#hg-gold)" />
      <rect x="7" y="32.5" width="26" height="4" rx="2" fill="url(#hg-gold)" />
      <path
        d="M10 7.5H30C30 16 24 18 24 20C24 22 30 24 30 32.5H10C10 24 16 22 16 20C16 18 10 16 10 7.5Z"
        stroke="url(#hg-gold)"
        strokeWidth="2.4"
        strokeLinejoin="round"
        fill="rgba(244,180,63,0.12)"
      />
      <path d="M14 29.5H26L20 23Z" fill="url(#hg-gold)" />
    </svg>
  )
}
