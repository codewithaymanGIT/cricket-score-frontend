import { useState, useEffect } from 'react'
import './App.css'

const MATCH_ID = 1
const API_BASE = 'http://localhost:8080/api/matches'

const DISMISSAL_TYPES = ['Bowled', 'Caught', 'LBW', 'Stumped', 'Run Out']

function App() {
  const [match, setMatch] = useState(null)
  const [players, setPlayers] = useState([])
  const [bowlers, setBowlers] = useState([])

  const [strikerId, setStrikerId] = useState('')
  const [bowlerId, setBowlerId] = useState('')
  const [isWicket, setIsWicket] = useState(false)
  const [dismissalType, setDismissalType] = useState('Bowled')
  const [fielderName, setFielderName] = useState('')

  const fetchData = async () => {
    const matchRes = await fetch(`${API_BASE}/${MATCH_ID}`)
    setMatch(await matchRes.json())

    const playersRes = await fetch(`${API_BASE}/${MATCH_ID}/players`)
    setPlayers(await playersRes.json())

    const bowlersRes = await fetch(`${API_BASE}/${MATCH_ID}/bowlers`)
    setBowlers(await bowlersRes.json())
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const recordBall = async (runs) => {
    if (!strikerId || !bowlerId) {
      alert('Select a striker and a bowler first.')
      return
    }

    await fetch(`${API_BASE}/${MATCH_ID}/ball`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        strikerId: parseInt(strikerId),
        bowlerId: parseInt(bowlerId),
        runs,
        isWicket,
        dismissalType,
        fielderName,
      }),
    })

    setIsWicket(false)
    setFielderName('')
    fetchData()
  }

  if (!match) return <div className="loading-screen">Loading match...</div>

  if (match.status === 'COMPLETED') {
    return (
      <div className="app">
        <div className="result-screen">
          <div className="live-badge">MATCH COMPLETE</div>
          <h1>{match.resultSummary}</h1>
          <div className="final-scores">
            <div>
              <span>{match.teamA}</span>
              <strong>{match.teamARuns}/{match.teamAWickets}</strong>
              <small>({match.teamAOvers} overs)</small>
            </div>
            <div>
              <span>{match.teamB}</span>
              <strong>{match.teamBRuns}/{match.teamBWickets}</strong>
              <small>({match.teamBOvers} overs)</small>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const battingTeam = match.currentInnings === 1 ? match.teamA : match.teamB
  const bowlingTeam = match.currentInnings === 1 ? match.teamB : match.teamA
  const runs = match.currentInnings === 1 ? match.teamARuns : match.teamBRuns
  const wickets = match.currentInnings === 1 ? match.teamAWickets : match.teamBWickets
  const overs = match.currentInnings === 1 ? match.teamAOvers : match.teamBOvers

  const battingPlayers = players.filter(p => p.team === battingTeam)
  const bowlingBowlers = bowlers.filter(b => b.team === bowlingTeam)

  return (
    <div className="app">
      <div className="live-badge-wrap">
        <span className={`live-badge ${match.status === 'LIVE' ? 'pulsing' : ''}`}>
          {match.status}
        </span>
      </div>

      <div className="scoreboard">
        <div className="match-title">{match.teamA} vs {match.teamB}</div>
        <div className="innings-label">{battingTeam} batting</div>
        <div className="main-score">
          {runs}<span className="wickets">/{wickets}</span>
        </div>
        <div className="overs-label">{overs.toFixed(1)} / {match.oversLimit} overs</div>
        <div className="run-rate">
          CRR: {overs > 0 ? (runs / overs).toFixed(2) : '0.00'}
        </div>
        {match.currentInnings === 2 && (
          <div className="target-info">
            Target: {match.teamARuns + 1} · Need {Math.max(0, match.teamARuns + 1 - runs)} runs
          </div>
        )}
      </div>

      <div className="players-panel">
        <h3>Batting — {battingTeam}</h3>
        <table className="players-table">
          <thead>
            <tr><th>Player</th><th>R</th><th>B</th><th>SR</th></tr>
          </thead>
          <tbody>
            {battingPlayers.map(p => (
              <tr key={p.id} className={p.out ? 'player-out' : ''}>
                <td>
                  {p.name}
                  {p.out && <div className="dismissal-text">{p.dismissalInfo}</div>}
                </td>
                <td>{p.runs}</td>
                <td>{p.ballsFaced}</td>
                <td>{p.ballsFaced > 0 ? ((p.runs / p.ballsFaced) * 100).toFixed(1) : '0.0'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="players-panel">
        <h3>Bowling — {bowlingTeam}</h3>
        <table className="players-table">
          <thead>
            <tr><th>Bowler</th><th>O</th><th>R</th><th>W</th></tr>
          </thead>
          <tbody>
            {bowlingBowlers.map(b => (
              <tr key={b.id}>
                <td>{b.name}</td>
                <td>{b.overs.toFixed(1)}</td>
                <td>{b.runsConceded}</td>
                <td>{b.wickets}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="scorer-panel">
        <h3>Scorer Controls</h3>

        <div className="selector-row">
          <select value={strikerId} onChange={(e) => setStrikerId(e.target.value)}>
            <option value="">Select striker</option>
            {battingPlayers.filter(p => !p.out).map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select value={bowlerId} onChange={(e) => setBowlerId(e.target.value)}>
            <option value="">Select bowler</option>
            {bowlingBowlers.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>

        <div className="run-buttons">
          {[0, 1, 2, 3, 4, 6].map(r => (
            <button key={r} onClick={() => recordBall(r)} className="run-btn">{r}</button>
          ))}
        </div>

        <div className="wicket-toggle">
          <label>
            <input
              type="checkbox"
              checked={isWicket}
              onChange={(e) => setIsWicket(e.target.checked)}
            />
            Wicket on next ball
          </label>
        </div>

        {isWicket && (
          <div className="dismissal-fields">
            <select value={dismissalType} onChange={(e) => setDismissalType(e.target.value)}>
              {DISMISSAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {(dismissalType === 'Caught' || dismissalType === 'Stumped' || dismissalType === 'Run Out') && (
              <input
                type="text"
                placeholder="Fielder/keeper name"
                value={fielderName}
                onChange={(e) => setFielderName(e.target.value)}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App