/**
 * Component to display ratings properly based on form type
 */
interface RatingDisplayProps {
  rating: number
  formType: string
  showLabel?: boolean
}

export function RatingDisplay({ rating, formType, showLabel = true }: RatingDisplayProps) {
  if (formType === 'nps') {
    // NPS scale 0-10
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-indigo-600">{rating}</span>
          <span className="text-xs text-gray-500">/10</span>
        </div>
        {showLabel && (
          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
            {rating >= 9 ? 'Promoter' : rating >= 7 ? 'Passive' : 'Detractor'}
          </span>
        )}
      </div>
    )
  } else if (formType === 'rating') {
    // Star rating 1-5
    return (
      <div className="flex items-center gap-2">
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
              ⭐
            </span>
          ))}
        </div>
        {showLabel && <span className="text-sm text-gray-600">({rating}/5)</span>}
      </div>
    )
  } else {
    // Default numeric display
    return (
      <span className="text-sm font-medium text-gray-900">{rating}</span>
    )
  }
}

/**
 * Component to display average ratings in analytics
 */
interface AverageRatingDisplayProps {
  averageRating: string
  formType: string
}

export function AverageRatingDisplay({ averageRating, formType }: AverageRatingDisplayProps) {
  const numRating = parseFloat(averageRating)
  
  if (formType === 'nps') {
    // NPS average display
    return (
      <div className="text-center">
        <p className="text-3xl font-bold text-indigo-600">{averageRating}</p>
        <p className="text-sm text-gray-600 mt-1">Average NPS Score</p>
        <div className="mt-2 text-xs text-gray-500">
          {numRating >= 9 ? 'Promoter Range' : numRating >= 7 ? 'Passive Range' : 'Detractor Range'}
        </div>
      </div>
    )
  } else if (formType === 'rating') {
    // Star rating average
    return (
      <div className="text-center">
        <p className="text-3xl font-bold text-yellow-600">{averageRating}</p>
        <p className="text-sm text-gray-600 mt-1">Average Rating</p>
        <div className="flex justify-center mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`text-sm ${star <= Math.round(numRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
              ⭐
            </span>
          ))}
        </div>
      </div>
    )
  } else {
    // Default numeric display
    return (
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-600">{averageRating}</p>
        <p className="text-sm text-gray-600 mt-1">Average Score</p>
      </div>
    )
  }
}

