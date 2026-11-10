// Copy for the loyalty card (Spanish, like the rest of the app screens). Swap here if the app moves to English.
export const loyaltyCopyEs = {
  c0: 'Diez beans hacen una taza.',
  c1: '1 bean. Faltan 9 para una taza.',
  cN: '{n} beans. Faltan {r} para una taza.',
  c9: 'Una más y ya es una taza.',
  c10: '¡Diez beans! Ya es una taza.',
  cups: (n) => (n === 1 ? '1 taza ganada' : `${n} tazas ganadas`),
  title: 'Mi tarjeta',
  aria: (shown, cups) => `Tarjeta de lealtad: ${shown} de 10 beans${cups ? `, ${cups} tazas ganadas` : ''}`,
}
