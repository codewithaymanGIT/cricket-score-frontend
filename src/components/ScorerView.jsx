import { useState } from 'react'
import { recordBall, undoBall, resetMatch } from '../api'
import { chipClass, chipText, formatOvers } from '../utils'

const DISMISSALS = ['Bowled', 'Caught', 'LBW', 'Stumped', 'Run Out']

function ScorerView({ data, onChange }) {
  const { match, players, bowlers, balls } = data

  const [strikerId, setStrikerId] = useState('')
  const [bowlerId, setBowlerId] = useState('')
  const [wicket, setWicket] = useState(false)
  const [dismissal, setDismissal] = useState('Bowled')
  const [fielder, setFielder] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)

  const innings = match.currentInnings
  const live = match.status === 'LIVE'
  const battingTeam = innings === 1 ? match.teamA : match.teamB
  const bowlingTeam = innings === 1 ? match.teamB : match.teamA
  const runs = innings === 1 ? match.teamARuns : match.teamBRuns
  const wickets = innings === 1 ? match.teamAWickets : match.teamBWickets
  const ballCount = innings === 1 ? match.teamABalls : match.teamBBalls

  const available = players.filter((p) => p.team === battingTeam && !p.out)
  const attack = bowlers.filter((b) => b.team === bowlingTeam)

  // Selections from a previous innings or an out batter become invalid automatically
  const striker = available.some((p) => String(p.id) === strikerId) ? strikerId : ''
  const bowler = attack.some((b) => String(b.id) === bowlerId) ? bowlerId : ''

  const recent = balls.filter((b) => b.innings === innings).slice(-12)
  const needsFielder = ['Caught', 'Stumped', 'Run Out'].includes(dismissal)
  const canScore = live && striker && bowler && !busy

  const run = async (action, successText) => {
    setBusy(true)
    setMessage(null)
    try {
      await action()
      await onChange()
      if (successText) setMessage({ type: 'ok', text: successText })
    } catch {
      setMessage({ type: 'err', text: 'Could not reach the server. Try again.' })
    } finally {
      setBusy(false)
    }
  }

  const score = (value) =>
    run(async () => {
      await recordBall({
        strikerId: Number(striker),
        bowlerId: Number(bowler),
        runs: value,
        isWicket: wicket,
        dismissalType: dismissal,
        fielderName: fielder,
      })
      if (wicket) {
        setStrikerId('')
        setWicket(false)
        setFielder('')
      }
    }, wicket ? 'Wicket recorded. Pick the incoming batter.' : null)

  const undo = () => run(() => undoBall(), 'Last ball undone.')

  const reset = () => {
    if (!window.confirm('Reset the whole match? Every ball will be cleared.')) return
    run(async () => {
      await resetMatch()
      setStrikerId('')
      setBowlerId('')
      setWicket(false)
    }, 'Match reset. Ready for the first ball.')
  }

  return (
    <div className="scorer">
      <section className="card">
        <div className="status-line">
          <div>
            <span className="stat-label dark">{battingTeam} · Innings {innings}</span>
            <div className="status-score">
              {runs}/{wickets} <span className="muted">({formatOvers(ballCount)} ov)</span>
            </div>
          </div>
          <a href="#/" className="btn-ghost">View scoreboard</a>
        </div>
        {recent.length > 0 && (
          <div className="chips chips-small">
            {recent.map((b) => (
              <span key={b.id} className={chipClass(b)}>{chipText(b)}</span>
            ))}
          </div>
        )}
      </section>

      {!live && (
        <div className="notice">
          Match complete: {match.resultSummary}. Use Reset match to play again.
        </div>
      )}

      <section className="card">
        <h3 className="card-title">Who's on</h3>
        <div className="field-row">
          <label className="field">
            <span>Striker</span>
            <select value={striker} onChange={(e) => setStrikerId(e.target.value)} disabled={!live}>
              <option value="">Select batter</option>
              {available.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.runs})</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Bowler</span>
            <select value={bowler} onChange={(e) => setBowlerId(e.target.value)} disabled={!live}>
              <option value="">Select bowler</option>
              {attack.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({formatOvers(b.ballsBowled)}-{b.runsConceded}-{b.wickets})
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <h3 className="card-title">Record delivery</h3>

        <label className="toggle">
          <input
            type="checkbox"
            checked={wicket}
            onChange={(e) => setWicket(e.target.checked)}
            disabled={!live}
          />
          <span>Wicket on this ball</span>
        </label>

        {wicket && (
          <div className="field-row">
            <label className="field">
              <span>How out</span>
              <select value={dismissal} onChange={(e) => setDismissal(e.target.value)}>
                {DISMISSALS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            {needsFielder && (
              <label className="field">
                <span>{dismissal === 'Stumped' ? 'Keeper' : 'Fielder'}</span>
                <input
                  type="text"
                  placeholder="Name"
                  value={fielder}
                  onChange={(e) => setFielder(e.target.value)}
                />
              </label>
            )}
          </div>
        )}

        <div className={`run-pad ${wicket ? 'pad-wicket' : ''}`}>
          {[0, 1, 2, 3, 4, 6].map((r) => (
            <button
              key={r}
              className={`run-key key-${r}`}
              disabled={!canScore}
              onClick={() => score(r)}
            >
              {r === 0 ? 'Dot' : r}
            </button>
          ))}
        </div>

        {live && (!striker || !bowler) && (
          <p className="hint">Select a striker and a bowler to start scoring.</p>
        )}
        {message && <p className={`flash flash-${message.type}`}>{message.text}</p>}
      </section>

      <section className="scorer-actions">
        <button className="btn-ghost" disabled={busy || balls.length === 0} onClick={undo}>
          ↶ Undo last ball
        </button>
        <button className="btn-danger" disabled={busy} onClick={reset}>
          Reset match
        </button>
      </section>
    </div>
  )
}

export default ScorerView