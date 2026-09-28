import { useCallback, useEffect, useState } from 'react'
import { fetchAll } from './api'
import ScoreboardView from './components/ScoreboardView'
import ScorerView from './components/ScorerView'
import './App.css'

function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/')

  useEffect(() => {
    const onChange = () => setRoute(window.location.hash || '#/')
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

function App() {
  const route = useHashRoute()
  const [data, setData] = useState(null)
  const [offline, setOffline] = useState(false)

  const refresh = useCallback(async () => {
    try {
      const next = await fetchAll()
      setData(next)
      setOffline(false)
    } catch {
      setOffline(true)
    }
  }, [])

  useEffect(() => {
    refresh()
    const timer = setInterval(refresh, 4000)
    return () => clearInterval(timer)
  }, [refresh])

  const isScorer = route.startsWith('#/scorer')

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-ball" aria-hidden="true" />
          <span className="brand-name">Crease</span>
          <span className="credit">Mohammed Ayman Siddiqui · CS-H · Roll 13 · PRN 12414007</span>
        </div>
        <nav className="nav">
          <a href="#/" className={isScorer ? '' : 'active'}>Scoreboard</a>
          <a href="#/scorer" className={isScorer ? 'active' : ''}>Scorer</a>
        </nav>
      </header>

      {offline && (
        <div className="conn-banner">
          Can't reach the scoring server on port 8080. Retrying every few seconds…
        </div>
      )}

      {!data ? (
        <div className="state">
          {offline ? 'Start the Spring Boot backend and this page will load automatically.' : 'Loading match…'}
        </div>
      ) : isScorer ? (
        <ScorerView data={data} onChange={refresh} />
      ) : (
        <ScoreboardView data={data} />
      )}
    </div>
  )
}

export default App