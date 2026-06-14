if (window.location.hash.startsWith('#/')) {
  window.history.replaceState(null, '', window.location.hash.slice(1))
}

document.addEventListener('error', function (e) {
  const img = e.target
  if (img.tagName === 'IMG' && !img.dataset.fallback) {
    img.dataset.fallback = '1'
    img.src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="%23f0f0f0"><rect width="400" height="400"/><text x="200" y="200" text-anchor="middle" dy=".3em" fill="%23999" font-size="14" font-family="sans-serif">Image unavailable</text></svg>')
  }
}, true)

import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
