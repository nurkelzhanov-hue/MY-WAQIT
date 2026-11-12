type Props = { code: 'kaa' | 'uz' | 'ru' }

const STARS = [
  [26, 6],
  [31, 9],
  [26, 12],
]

export default function Flag({ code }: Props) {
  const clipId = `flag-clip-${code}`
  return (
    <svg width="72" height="48" viewBox="0 0 72 48" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect width="72" height="48" rx="9" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {code === 'ru' && (
          <>
            <rect width="72" height="16" fill="#ffffff" />
            <rect y="16" width="72" height="16" fill="#0039a6" />
            <rect y="32" width="72" height="16" fill="#d52b1e" />
          </>
        )}
        {code === 'uz' && (
          <>
            <rect width="72" height="16" fill="#0099b5" />
            <rect y="16" width="72" height="16" fill="#ffffff" />
            <rect y="32" width="72" height="16" fill="#1eb53a" />
            <rect y="15.6" width="72" height="1.4" fill="#ce1126" />
            <rect y="31" width="72" height="1.4" fill="#ce1126" />
          </>
        )}
        {code === 'kaa' && (
          <>
            <rect width="72" height="16" fill="#1ba3dd" />
            <rect y="16" width="72" height="16" fill="#ffd400" />
            <rect y="32" width="72" height="16" fill="#1f9d3a" />
          </>
        )}
        {code !== 'ru' && (
          <>
            <circle cx="13" cy="8.5" r="6" fill="#ffffff" />
            <circle cx="15.5" cy="8.5" r="5.2" fill={code === 'uz' ? '#0099b5' : '#1ba3dd'} />
            {STARS.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="1.3" fill="#ffffff" />
            ))}
          </>
        )}
      </g>
    </svg>
  )
}
