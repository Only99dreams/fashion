import { createContext, useContext, useState, useEffect, useRef } from 'react'
import { getProducts, getProductImages } from '../data/getProducts'

const ProductContext = createContext()

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [imagesReady, setImagesReady] = useState(false)
  const imageMapRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    getProducts().then((data) => {
      if (cancelled) return
      const map = imageMapRef.current
      setProducts(
        map
          ? data.map((p) => ({ ...p, ...(map[p.id] || { img: '', images: [] }) }))
          : data
      )
      setLoading(false)
    })
    getProductImages().then((imageMap) => {
      if (cancelled) return
      imageMapRef.current = imageMap
      setProducts((prev) => {
        if (prev.length === 0) return prev
        return prev.map((p) => ({
          ...p,
          ...(imageMap[p.id] || { img: '', images: [] }),
        }))
      })
      setImagesReady(true)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <ProductContext.Provider value={{ products, loading, imagesReady }}>
      {children}
    </ProductContext.Provider>
  )
}

export function useProducts() {
  return useContext(ProductContext)
}
