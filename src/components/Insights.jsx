import { ballLabel } from '../utils'

function Insights({ inningsBalls, players }) {
  const nameOf = (id) => players.find((p) => p.id === id)?.name ?? 'Unknown'

  let score = 0
  let partnershipRuns = 0
  let partnershipBalls = 0
  const fallOfWickets = []

  inningsBalls.forEach((b) => {
    score += b.runs
    partnershipRuns += b.runs
    partnershipBalls += 1
    if (b.wicket) {
      fallOfWickets.push({
        number: fallOfWickets.length + 1,
        score,
        batter: nameOf(b.strikerId),
        at: ballLabel(b.ballNumber),
      })
      partnershipRuns = 0
      partnershipBalls = 0
    }
  })

  return (
    <section className="card insights">
      <div>
        <h3 className="card-title">Partnership</h3>
        <p className="big-num">
          {partnershipRuns} <span className="muted">({partnershipBalls} balls)</span>
        </p>
      </div>
      <div>
        <h3 className="card-title">Fall of wickets</h3>
        {fallOfWickets.length === 0 ? (
          <p className="muted">No wickets yet.</p>
        ) : (
          <ul className="fow">
            {fallOfWickets.map((f) => (
              <li key={f.number}>
                <strong>{f.number}-{f.score}</strong> {f.batter}{' '}
                <span className="muted">({f.at} ov)</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default Insights