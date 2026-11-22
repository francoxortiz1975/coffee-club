// Splits a description into sentences, keeping short ones joined so lines are not tiny.
export function toLines(text) {
  const parts = (text || '').match(/[^.!?]+[.!?]+(?:\s|$)|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) || []
  const out = []
  for (const p of parts) {
    if (out.length && p.length < 28) out[out.length - 1] += ' ' + p
    else out.push(p)
  }
  return out
}
