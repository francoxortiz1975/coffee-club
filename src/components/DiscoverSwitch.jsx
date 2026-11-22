import { useNavigate } from 'react-router-dom'
import Segmented from './Segmented'

// Discover has three modes: browse the shelves, swipe through the book, or follow the coffee journey.
export default function DiscoverSwitch({ value }) {
  const navigate = useNavigate()
  return (
    <Segmented
      label="Discover view"
      value={value}
      options={[{ id: 'browse', label: 'Browse' }, { id: 'swipe', label: 'Swipe' }, { id: 'journey', label: 'Journey' }]}
      onChange={(v) => navigate(v === 'browse' ? '/' : v === 'swipe' ? '/decidir' : '/journey')}
    />
  )
}
