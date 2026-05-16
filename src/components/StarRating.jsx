function Star({ fill }) {
  const id = `half-${Math.random().toString(36).slice(2)}`
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
      {fill === 'half' && (
        <defs>
          <clipPath id={id}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
      )}
      {/* Empty star base */}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill="none"
        stroke="#d4a843"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Filled portion */}
      {fill !== 'empty' && (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="#b8d04a"
          clipPath={fill === 'half' ? `url(#${id})` : undefined}
        />
      )}
    </svg>
  )
}

export default function StarRating({ rating }) {
  // Round to nearest 0.5: .0-.24 → floor, .25-.74 → .5, .75+ → ceil
  const rounded = Math.round(rating * 2) / 2

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const fill = rounded >= star ? 'full' : rounded >= star - 0.5 ? 'half' : 'empty'
        return <Star key={star} fill={fill} />
      })}
      <span className="text-xs text-cafe-accent/60 ml-1.5">{rating.toFixed(1)}</span>
    </div>
  )
}
