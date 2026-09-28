import { ballLabel, chipClass, chipText } from '../utils'

function describe(b) {
  if (b.wicket) return `OUT! ${b.dismissalInfo ?? ''}`
  if (b.runs === 0) return 'no run'
  if (b.runs === 4) return 'FOUR'
  if (b.runs === 6) return 'SIX'
  return `${b.runs} run${b.runs > 1 ? 's' : ''}`
}

function Commentary({ balls, players, bowlers }) {
  const batterName = (id) => players.find((p) => p.id === id)?.name ?? 'Batter'
  const bowlerName = (id) => bowlers.find((b) => b.id === id)?.name ?? 'Bowler'
  const items = [...balls].reverse().slice(0, 40)

  return (
    <section className="card commentary">
      <h3 className="card-title">Commentary</h3>
      {items.length === 0 ? (
        <p className="muted">Ball-by-ball updates will appear here.</p>
      ) : (
        <ol className="comm-list">
          {items.map((b) => (
            <li key={b.id} className="comm-item">
              <span className={chipClass(b)}>{chipText(b)}</span>
              <div>
                <div className="comm-over">{ballLabel(b.ballNumber)} · Innings {b.innings}</div>
                <p>
                  <strong>{bowlerName(b.bowlerId)} to {batterName(b.strikerId)}</strong>,{' '}
                  <span className={b.wicket ? 'comm-out' : ''}>{describe(b)}</span>
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

export default Commentary