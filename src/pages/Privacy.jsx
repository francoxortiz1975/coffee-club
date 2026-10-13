import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/geist'
import '@fontsource/parisienne/latin-400.css'
import './landing.css'
import { copy } from '../lib/landingCopy'
import { privacyCopy } from '../lib/privacyCopy'
import { useLandingLang } from '../lib/useLandingLang'
import { useTheme } from '../lib/useTheme'
import { LangToggle, ThemeToggle } from '../components/LandingChrome'

export default function Privacy() {
  const [lang, setLang] = useLandingLang()
  const [theme, chooseTheme] = useTheme()
  const t = privacyCopy[lang]
  const chrome = copy[lang]

  useEffect(() => {
    const previous = document.title
    document.title = t.docTitle
    return () => { document.title = previous }
  }, [t])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // El fondo del body queda a la vista en el overscroll: lo alineamos con el tema.
  useEffect(() => {
    const root = document.querySelector('.sl')
    const bg = root ? getComputedStyle(root).getPropertyValue('--bg').trim() : ''
    if (bg) document.body.style.backgroundColor = bg
    return () => { document.body.style.backgroundColor = '' }
  }, [theme])

  return (
    <div className="sl" data-theme={theme ?? undefined}>
      <nav className="nav" aria-label="Main">
        <div className="wrap nav-inner">
          <Link to="/landing" aria-label="Sumay Coffee Club">
            <img className="logo" src="/logo.png" alt="Sumay Coffee Club" />
          </Link>
          <span className="spacer" />
          <LangToggle lang={lang} setLang={setLang} />
          <Link className="btn btn-primary" to="/landing">{t.back}</Link>
        </div>
      </nav>

      <main>
        <article className="wrap prose">
          <h1>{t.title}</h1>
          <p className="updated">{t.updated}</p>
          <p className="lead">{t.intro}</p>
          {t.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.items.map((text) => <p key={text}>{text}</p>)}
            </section>
          ))}
        </article>
      </main>

      <footer className="footer">
        <div className="wrap footer-inner">
          <img className="logo" src="/logo.png" alt="Sumay" />
          <span className="made">{chrome.footer.made}</span>
          <span className="spacer" />
          <a className="link" href="mailto:hola@sumayclub.app">{chrome.footer.contact}</a>
          <ThemeToggle t={chrome.footer} effective={theme ?? 'dark'} onChoose={chooseTheme} />
        </div>
      </footer>
    </div>
  )
}
