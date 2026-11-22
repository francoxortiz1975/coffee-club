import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCafeteros } from '../context/CafeterosContext'
import { supabase } from './supabase'

// Cafés that at least one of your confirmed coffee friends has visited.
export function useCafesDeCafeteros() {
  const { user } = useAuth()
  const { confirmados } = useCafeteros()
  const [cafeIds, setCafeIds] = useState([])

  useEffect(() => {
    if (!user || confirmados.length === 0) {
      setCafeIds([])
      return
    }

    let activo = true
    const ids = confirmados.map((c) => c.id)

    async function load() {
      const { data, error } = await supabase
        .from('visitas')
        .select('cafe_id')
        .in('user_id', ids)
      if (error) { console.error('cafeteros visitas error:', error); return }
      if (activo) setCafeIds([...new Set(data.map((v) => v.cafe_id))])
    }
    load()
    return () => { activo = false }
  }, [user, confirmados])

  return cafeIds
}
