export default function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star
        const half = !filled && rating >= star - 0.5
        return (
          <span key={star} className="text-lg leading-none">
            {filled ? '★' : half ? '⯨' : '☆'}
          </span>
        )
      })}
      <span className="text-sm text-cafe-accent/70 ml-1">{rating.toFixed(1)}</span>
    </div>
  )
}
