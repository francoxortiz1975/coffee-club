import { supabase } from './supabase'

const REF_KEY = 'sumay_ref'

// Canal que trajo a la persona (?ref=ig, ?ref=tiktok, ?ref=ruta...). Se guarda en la sesión
// para que sobreviva a la navegación interna.
export function getRef() {
  try {
    const fromUrl = new URLSearchParams(window.location.search).get('ref')
    const clean = (fromUrl || '').toLowerCase().replace(/[^a-z0-9_-]/g, '').slice(0, 24)
    if (clean) sessionStorage.setItem(REF_KEY, clean)
    return sessionStorage.getItem(REF_KEY) || ''
  } catch {
    return ''
  }
}

function isMissingColumn(error) {
  return error?.code === 'PGRST204' || /could not find the .* column|column .* does not exist/i.test(error?.message || '')
}

// Codifica el perfil en `source` para cuando la tabla todavía no tiene la columna `profile`.
function compactProfile(profile) {
  const list = (v) => (v?.length ? v.join('+') : '-')
  return [profile.archetype || '-', list(profile.look), list(profile.mood), profile.level || '-', profile.freq || '-', list(profile.hoods)].join(':')
}

// Inserta en `waitlist`. Con columnas `profile` y `ref` si existen; si no, cae a `source`.
export async function joinWaitlist({ email, lang, kind = 'quiz', profile = null, message = null }) {
  const ref = getRef()
  const base = {
    email,
    mensaje: message,
    user_agent: navigator.userAgent.slice(0, 500),
    source: `${kind}:${lang}:${ref || 'direct'}`,
  }
  let { error } = await supabase.from('waitlist').insert({ ...base, ...(profile ? { profile } : {}), ...(ref ? { ref } : {}) })
  if (error && isMissingColumn(error)) {
    const encoded = profile ? `${base.source}:${compactProfile(profile)}` : base.source
    ;({ error } = await supabase.from('waitlist').insert({ ...base, source: encoded.slice(0, 240) }))
  }
  // 23505 = email duplicado: para la persona es éxito.
  const duplicate = error?.code === '23505'
  return { ok: !error || duplicate, duplicate, error: duplicate ? null : error }
}
