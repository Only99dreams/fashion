import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'
import { clearProductCache } from '../../data/getProducts'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { loadProducts() }, [])

  async function loadProducts() {
    setLoading(true)
    setError('')
    try {
      const { data } = await supabase
        .from('products')
        .select('id,brand,name,category,price,condition,image_url')
        .order('created_at', { ascending: false })
      setProducts(data || [])
    } catch (err) {
      setError('Failed to load products')
    }
    setLoading(false)
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    setError('')
    try {
      await supabase.from('products').delete().eq('id', id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      clearProductCache()
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  if (loading) return <p className="admin-empty">Loading...</p>

  return (
    <div className="admin-products">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <a href="/admin/products/new" className="btn btn--dark">+ Add Product</a>
      </div>

      {error && <p className="admin-form__error">{error}</p>}

      {products.length === 0 ? (
        <p className="admin-empty">No products yet. Add your first product.</p>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Brand</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Condition</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="admin-thumb" />
                  ) : (
                    <span className="admin-thumb-placeholder">N/A</span>
                  )}
                </td>
                <td><strong>{p.brand}</strong></td>
                <td>{p.name}</td>
                <td><span className="admin-badge">{p.category}</span></td>
                <td>${Number(p.price).toLocaleString()}</td>
                <td>{p.condition}</td>
                <td className="admin-actions">
                  <a href={`/admin/products/${p.id}/edit`} className="admin-btn-sm">Edit</a>
                  <button className="admin-btn-sm admin-btn-sm--danger" onClick={() => deleteProduct(p.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
