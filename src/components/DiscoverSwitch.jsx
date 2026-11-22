import { useNavigate } from 'react-router-dom'
import Segmented from './Segmented'

// Discover has two ways to pick a café: browse the feed, or swipe through the book.
export default function DiscoverSwitch({ value }) {
  const navigate = useNavigate()
  return (
    <Segmented
      label="Discover view"
      value={value}
      options={[{ id: 'browse', label: 'Browse' }, { id: 'swipe', label: 'Swipe' }]}
      onChange={(v) => navigate(v === 'browse' ? '/' : '/decidir')}
    />
  )
}
