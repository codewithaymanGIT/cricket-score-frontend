import { chipClass, chipText, overIndex } from '../utils'

function OverTimeline({ inningsBalls }) {
  if (inningsBalls.length === 0) {
    return (
      <section className="card">
        <h3 className="card-title">This over</h3>
        <p className="muted">Waiting for the first ball of the innings.</p>
      </section>
    )
  }

  const last = inningsBalls[inningsBalls.length - 1]
  const current = overIndex(last.ballNumber)
  const overBalls = inningsBalls.filter((b) => overIndex(b.ballNumber) === current)
  const overRuns = overBalls.reduce((sum, b) => sum + b.runs, 0)
  const slots = Array.from({ length: 6 }, (_, i) => overBalls[i])

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Over {current + 1}</h3>
        <span className="muted">{overRuns} run{overRuns === 1 ? '' : 's'} this over</span>
      </div>
      <div className="chips">
        {slots.map((b, i) =>
          b ? (
            <span key={b.id} className={chipClass(b)}>{chipText(b)}</span>
          ) : (
            <span key={`empty-${i}`} className="chip chip-empty" />
          )
        )}
      </div>
    </section>
  )
}

export default OverTimeline