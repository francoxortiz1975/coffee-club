import AvatarButton from './AvatarButton'

// Title on the left, profile avatar on the right, optional controls (like a segmented switch) below.
export default function AppHeader({ title, children }) {
  return (
    <header className="px-4" style={{ paddingTop: 'calc(14px + env(safe-area-inset-top))' }}>
      <div className="flex items-center justify-between min-h-11">
        <h1 className="text-2xl font-display font-bold text-cafe-dark">{title}</h1>
        <AvatarButton />
      </div>
      {children && <div className="mt-3">{children}</div>}
    </header>
  )
}
