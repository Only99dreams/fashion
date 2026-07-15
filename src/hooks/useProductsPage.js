import { useState, useEffect } from 'react'
import { getProductsPage } from '../data/getProducts'

/**
 * Fetch a single page of products from the server with the given filter/sort
 * options. Re-fetches whenever any option changes. Returns paginated state:
 *   { items, total, loading, error }
 *
 * `options` is serialized to detect changes, so callers can pass a fresh object
 * on every render without causing infinite loops.
 */
export function useProductsPage(options) {
  const [state, setState] = useState({ items: [], total: 0, loading: true, error: null })
  const key = JSON.stringify(options)

  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    getProductsPage(options)
      .then(({ items, total }) => {
        if (cancelled) return
        setState({ items, total, loading: false, error: null })
      })
      .catch((err) => {
        if (cancelled) return
        setState({ items: [], total: 0, loading: false, error: err })
      })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
