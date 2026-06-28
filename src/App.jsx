import { useState, useEffect } from 'react'
import AnnouncementBar from './components/AnnouncementBar'
import Header from './components/Header'
import Hero from './components/Hero'
import ShopCardiPicks from './components/ShopCardiPicks'
import TwoColSection from './components/TwoColSection'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import Router from './Router'
import NewArrivals from './pages/NewArrivals'
import DesignerCollection from './pages/DesignerCollection'
import AllBags from './pages/AllBags'
import CollectionPage from './pages/CollectionPage'
import CardiBPicks from './pages/CardiBPicks'
import DesignersPage from './pages/DesignersPage'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderHistory from './pages/OrderHistory'
import MyAccount from './pages/MyAccount'
import GenericPage from './pages/GenericPage'
import SupportModal from './components/SupportModal'
import SupportButton from './components/SupportButton'
import { AdminProvider } from './context/AdminContext'
import { ToastProvider } from './context/ToastContext'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminProductForm from './pages/admin/AdminProductForm'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminAnalytics from './pages/admin/AdminAnalytics'
import AdminSettings from './pages/admin/AdminSettings'
import { CartProvider } from './context/CartContext'
import { ProductProvider, useProducts } from './context/ProductContext'
import './App.css'

function NotFoundPage() {
  return (
    <main className="new-arrivals" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', padding: '40px' }}>
      <h1 style={{ fontSize: '72px', margin: '0 0 16px', color: '#191c1f' }}>404</h1>
      <p style={{ fontSize: '18px', color: '#7d7d7d', margin: '0 0 32px' }}>Page not found. Let&rsquo;s get you back on track.</p>
      <a href="/" className="btn btn--dark">Go Home</a>
    </main>
  )
}

function ProtectedAdmin({ children }) {
  return <AdminLayout isLoginPage={false}>{children}</AdminLayout>
}

function AdminLoginWrapper() {
  return <AdminLayout isLoginPage={true}><AdminLogin /></AdminLayout>
}

function HomePage() {
  const { products, loading } = useProducts()

  return (
    <>
      <Hero />
      <ShopCardiPicks />
      <ProductGrid
        title=""
        products={loading ? [] : products.slice(0, 8)}
      />
      <TwoColSection />
    </>
  )
}

export default function App() {
  const [isAdmin, setIsAdmin] = useState(() => window.location.pathname.startsWith('/admin/'))

  useEffect(() => {
    function check() {
      setIsAdmin(window.location.pathname.startsWith('/admin/'))
    }
    window.addEventListener('popstate', check)
    window.addEventListener('app:navigate', check)
    return () => {
      window.removeEventListener('popstate', check)
      window.removeEventListener('app:navigate', check)
    }
  }, [])

  useEffect(() => {
    function handleClick(e) {
      const link = e.target.closest('a')
      if (!link) return
      const href = link.getAttribute('href')
      if (!href) return
      const isInternal = href.startsWith('/') && !href.startsWith('//')
      const isHashInternal = href.startsWith('#/')
      if (!isInternal && !isHashInternal) return
      if (link.target === '_blank') return
      e.preventDefault()
      const path = isHashInternal ? href.slice(1) : href
      window.history.pushState(null, '', path)
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: path.replace(/^\//, '').replace(/\/$/, '') || '' }))
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const routes = {
    '': <HomePage />,
    'designers': <DesignersPage />,
    'new-arrivals': <NewArrivals />,
    'all-bags': <AllBags />,
    'shoes': <CollectionPage category="Shoes" />,
    'accessories': <CollectionPage category="Accessories" />,
    'jewelry': <CollectionPage category="Jewelry" />,
    'watches': <CollectionPage category="Watches" />,
    'cardi-b-picks': <CardiBPicks />,
    'cart': <Cart />,
    'checkout': <Checkout />,
    'orders': <OrderHistory />,
    'sale': <GenericPage title="Sale" desc="Score luxury at incredible prices. Over 50% off retail on pre-owned designer items." />,
    'sell': <GenericPage title="Sell With Us" desc="Turn your luxury items into cash. Sell online or in person." />,
    'about': <GenericPage title="About FASHIONPHILE" desc="The world's premier destination for authenticated pre-owned luxury." />,
    'help': <GenericPage title="Help & FAQ" desc="Find answers to common questions about shipping, returns, authenticity, and more." />,
    'stores': <GenericPage title="Our Locations" desc="Visit us in person or select in-store pickup at checkout." />,
    'account': <MyAccount />,
    'admin/login': <AdminLoginWrapper />,
    'admin/dashboard': <ProtectedAdmin><AdminDashboard /></ProtectedAdmin>,
    'admin/products': <ProtectedAdmin><AdminProducts /></ProtectedAdmin>,
    'admin/products/new': <ProtectedAdmin><AdminProductForm /></ProtectedAdmin>,
    'admin/orders': <ProtectedAdmin><AdminOrders /></ProtectedAdmin>,
    'admin/customers': <ProtectedAdmin><AdminCustomers /></ProtectedAdmin>,
    'admin/analytics': <ProtectedAdmin><AdminAnalytics /></ProtectedAdmin>,
    'admin/settings': <ProtectedAdmin><AdminSettings /></ProtectedAdmin>,
  }

  return (
    <AdminProvider>
      <CartProvider>
        <ProductProvider>
        <ToastProvider>
        {!isAdmin && <AnnouncementBar />}
        {!isAdmin && <Header />}
        <Router
          routes={routes}
          defaultRoute=""
          notFound={<NotFoundPage />}
          resolve={(path) => {
            const editMatch = path.match(/^admin\/products\/(\d+)\/edit$/)
            if (editMatch) {
              return <ProtectedAdmin><AdminProductForm productId={parseInt(editMatch[1], 10)} /></ProtectedAdmin>
            }
            if (path.startsWith('designer/')) {
              const name = path.slice(9)
              return <DesignerCollection designerName={name} />
            }
            if (path.startsWith('product/')) {
              const id = parseInt(path.slice(8), 10)
              return <ProductDetail productId={id} />
            }
            return null
          }}
        />
        {!isAdmin && <Footer />}
        {!isAdmin && <CookieBanner />}
        {!isAdmin && <SupportButton />}
        {!isAdmin && <SupportModal />}
        </ToastProvider>
        </ProductProvider>
      </CartProvider>
    </AdminProvider>
  )
}
