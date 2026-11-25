import { useState } from 'react'
import { joinWaitlist } from '../lib/waitlist'

// The request box: an email and one button. It writes to the same waitlist table as the quiz, with the ?ref= channel.
export default function RequestBox({ show = 1, id = 'inv-email' }) {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle')   // idle | sending | done | invalid | error

  async function submit(e) {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) { setState('invalid'); return }
    setState('sending')
    const { ok, error } = await joinWaitlist({ email: clean, lang: 'en', kind: 'landing' })
    if (!ok) console.error('waitlist insert error:', error)
    setState(ok ? 'done' : 'error')
  }

  return (
    <div className="mt-5 border-2 border-[#2a1a10] p-3" style={{ opacity: show, pointerEvents: show > 0.6 ? 'auto' : 'none', transform: `translateY(${(1 - show) * 16}px)` }}>
      {state === 'done' ? (
        <p className="text-[clamp(1.1rem,4.6vw,1.4rem)] leading-snug tracking-[-0.03em]">You’re on the list.<br />Soon you will have access.</p>
      ) : (
        <form onSubmit={submit} noValidate className="flex flex-col gap-2">
          <label htmlFor={id} className="text-[11px] font-medium tracking-[0.2em] text-[#4a342a]">REQUEST AN INVITATION</label>
          <input
            id={id} type="email" inputMode="email" autoComplete="email" placeholder="Your email" value={email}
            onChange={(e) => { setEmail(e.target.value); if (state !== 'sending') setState('idle') }}
            className="w-full min-h-12 bg-transparent border-b-2 border-[#2a1a10] px-0 text-base tracking-[-0.02em] placeholder:text-[#4a342a]/60 outline-none focus-visible:border-b-4"
          />
          <button type="submit" disabled={state === 'sending'} className="min-h-12 bg-[#2a1a10] text-[#f5f0e8] text-[15px] font-medium tracking-[-0.01em] active:opacity-80 disabled:opacity-60 transition-opacity">
            {state === 'sending' ? 'Sending…' : 'Request an invitation'}
          </button>
          <p className="min-h-[1.1em] text-[13px] text-[#7a2e1d]" role="alert" aria-live="polite">
            {state === 'invalid' ? 'Please enter a valid email.' : state === 'error' ? 'Something went wrong. Please try again.' : ''}
          </p>
        </form>
      )}
    </div>
  )
}
