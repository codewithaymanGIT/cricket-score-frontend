import { overIndex } from '../utils'

function Manhattan({ inningsBalls, oversLimit, team }) {
  const perOver = Array.from({ length: oversLimit }, () => null)

  inningsBalls.forEach((b) => {
    const o = overIndex(b.ballNumber)
    if (!perOver[o]) perOver[o] = { runs: 0, wickets: 0 }
    perOver[o].runs += b.runs
    if (b.wicket) perOver[o].wickets += 1
  })

  const max = Math.max(12, ...perOver.filter(Boolean).map((o) => o.runs))

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Runs per over</h3>
        <span className="muted">Red cap = wicket in that over</span>
      </div>

      {inningsBalls.length === 0 ? (
        <p className="muted">The chart fills in as overs are bowled.</p>
      ) : (
        <div className="manhattan">
          {perOver.map((o, i) => (
            <div
              key={i}
              className="bar-col"
              title={o ? `Over ${i + 1}: ${o.runs} runs, ${o.wickets} wkt` : `Over ${i + 1}`}
            >
              <div className="bar-track">
                <div
                  className={`bar bar-${team} ${o?.wickets ? 'bar-wkt' : ''}`}
                  style={{ height: `${o ? (o.runs / max) * 100 : 0}%` }}
                />
              </div>
              <span className="bar-label">{(i + 1) % 5 === 0 ? i + 1 : ''}</span>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default Manhattan