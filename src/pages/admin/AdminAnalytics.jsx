import { useState, useEffect } from 'react'
import { supabase } from '../../supabase/client'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminAnalytics() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 })
  const [monthlyData, setMonthlyData] = useState([])
  const [topBrands, setTopBrands] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [])

  async function loadAnalytics() {
    setError('')
    try {
      const { data: prods } = await supabase.from('products').select('*')
      const { data: orders } = await supabase.from('orders').select('*')
      const totalOrders = orders?.length || 0
      const revenue = orders?.reduce((sum, o) => sum + Number(o.total), 0) || 0
      const pending = orders?.filter((o) => o.status === 'pending').length || 0
      setStats({ products: prods?.length || 0, orders: totalOrders, revenue, pending })

      const monthly = Array.from({ length: 6 }, (_, i) => {
        const d = new Date()
        d.setMonth(d.getMonth() - 5 + i)
        return { label: MONTHS[d.getMonth()], orders: 0, revenue: 0 }
      })

      if (orders) {
        orders.forEach((o) => {
          const d = new Date(o.created_at)
          const now = new Date()
          const diffMonths = (now.getFullYear() - d.getFullYear()) * 12 + now.getMonth() - d.getMonth()
          if (diffMonths >= 0 && diffMonths < 6) {
            monthly[5 - diffMonths].orders += 1
            monthly[5 - diffMonths].revenue += Number(o.total)
          }
        })
      }
      setMonthlyData(monthly)

      const { data: productsData } = await supabase.from('products').select('brand, price')
      if (productsData) {
        const brandMap = {}
        productsData.forEach((p) => {
          brandMap[p.brand] = (brandMap[p.brand] || 0) + 1
        })
        setTopBrands(
          Object.entries(brandMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
        )
      }
    } catch {
      setError('Failed to load analytics data')
    }
  }

  const maxOrders = Math.max(...monthlyData.map((m) => m.orders), 1)
  const maxRevenue = Math.max(...monthlyData.map((m) => m.revenue), 1)

  return (
    <div className="admin-analytics">
      <h1 className="admin-page-title">Analytics</h1>

      {error && <p className="admin-form__error">{error}</p>}

      <div className="admin-stats-grid" style={{ marginTop: '24px' }}>
        {[
          { label: 'Total Products', value: stats.products, color: '#4f46e5' },
          { label: 'Total Orders', value: stats.orders, color: '#0891b2' },
          { label: 'Total Revenue', value: `$${stats.revenue.toLocaleString()}`, color: '#059669' },
          { label: 'Orders per Product', value: stats.products > 0 ? `${(stats.orders / stats.products).toFixed(2)}x` : '0', color: '#d97706' },
        ].map((card) => (
          <div key={card.label} className="admin-stat-card" style={{ borderTopColor: card.color }}>
            <p className="admin-stat-card__label">{card.label}</p>
            <p className="admin-stat-card__value">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="admin-chart-grid">
        <div className="admin-chart-card">
          <h3 className="admin-chart-card__title">Orders (Last 6 Months)</h3>
          <div className="admin-chart-placeholder" style={{ alignItems: 'flex-end' }}>
            {monthlyData.map((m, i) => (
              <div key={i} className="admin-chart-bar">
                <span style={{ fontSize: '11px', color: '#7d7d7d' }}>{m.orders}</span>
                <div className="admin-chart-bar__fill" style={{ height: `${(m.orders / maxOrders) * 160}px`, background: '#4f46e5' }} />
                <span className="admin-chart-bar__label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-chart-card">
          <h3 className="admin-chart-card__title">Revenue (Last 6 Months)</h3>
          <div className="admin-chart-placeholder" style={{ alignItems: 'flex-end' }}>
            {monthlyData.map((m, i) => (
              <div key={i} className="admin-chart-bar">
                <span style={{ fontSize: '11px', color: '#7d7d7d' }}>${(m.revenue / 1000).toFixed(0)}k</span>
                <div className="admin-chart-bar__fill" style={{ height: `${(m.revenue / maxRevenue) * 160}px`, background: '#059669' }} />
                <span className="admin-chart-bar__label">{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-section">
        <h2 className="admin-section__title">Top Brands</h2>
        {topBrands.length === 0 ? (
          <p className="admin-empty">No data yet.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Brand</th>
                <th>Products</th>
              </tr>
            </thead>
            <tbody>
              {topBrands.map(([brand, count]) => (
                <tr key={brand}>
                  <td><strong>{brand}</strong></td>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
