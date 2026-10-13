import { useEffect, useState } from 'react'

// Detecta WebView de apps que rompen el SPA o cachean feo.
function detectarInApp() {
  const ua = navigator.userAgent || ''
  if (/Instagram/i.test(ua)) return 'Instagram'
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return 'Facebook'
  if (/TikTok|musical_ly|Bytedance/i.test(ua)) return 'TikTok'
  if (/Twitter/i.test(ua)) return 'X / Twitter'
  if (/Line/i.test(ua)) return 'LINE'
  return null
}

function esIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

export default function InAppBrowserBanner({ t }) {
  const [app, setApp] = useState(null)

  useEffect(() => {
    setApp(detectarInApp())
  }, [])

  if (!app) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-cafe-dark text-beige shadow-lg">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <div className="text-2xl shrink-0">☕</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold leading-tight">
            {t.title}
          </p>
          <p className="text-[11px] text-beige/70 leading-snug mt-0.5">
            {t.insideBefore}{app}{t.insideAfter}<span className="font-bold">⋯</span>
            {t.topRight}<span className="font-bold">
              {esIOS() ? t.openExternal : t.openChrome}
            </span>.
          </p>
        </div>
      </div>
    </div>
  )
}
