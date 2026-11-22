import cafes from '../data/cafes.json'

// The curated rows on Discover > Browse. Each has an id so "See all" can open it.
export function buildShelves({ favoritos = [], friendCafeIds = [] }) {
  return [
    { id: 'near', title: 'Near you', cafes },
    { id: 'friends', title: 'Visited by your coffee friends', cafes: cafes.filter((c) => friendCafeIds.includes(c.id)) },
    { id: 'favorites', title: 'Favorites', cafes: cafes.filter((c) => favoritos.includes(c.id)) },
    { id: 'romantic', title: 'Something romantic', cafes: cafes.filter((c) => c.ocasiones.includes('couple')) },
    { id: 'work', title: 'Good for working', cafes: cafes.filter((c) => c.ocasiones.includes('work')) },
    { id: 'sightseeing', title: 'For sightseeing', cafes: cafes.filter((c) => c.ocasiones.includes('tourist')) },
  ]
}
