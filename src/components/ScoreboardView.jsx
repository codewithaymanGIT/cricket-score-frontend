import Scorebug from './Scorebug'
import OverTimeline from './OverTimeline'
import Insights from './Insights'
import Manhattan from './Manhattan'
import Scorecard from './Scorecard'
import Commentary from './Commentary'

function ScoreboardView({ data }) {
  const { match, players, bowlers, balls } = data
  const innings = match.currentInnings
  const inningsBalls = balls.filter((b) => b.innings === innings)

  return (
    <div className="board">
      {match.status === 'COMPLETED' && (
        <section className="result-banner">
          <span className="result-kicker">Match complete</span>
          <h2>{match.resultSummary}</h2>
        </section>
      )}

      <Scorebug match={match} />

      <div className="board-grid">
        <div className="board-main">
          <OverTimeline inningsBalls={inningsBalls} />
          <Insights inningsBalls={inningsBalls} players={players} />
          <Manhattan
            inningsBalls={inningsBalls}
            oversLimit={match.oversLimit}
            team={innings === 1 ? 'a' : 'b'}
          />
          <Scorecard match={match} players={players} bowlers={bowlers} balls={balls} />
        </div>
        <aside className="board-side">
          <Commentary balls={balls} players={players} bowlers={bowlers} />
        </aside>
      </div>
    </div>
  )
}

export default ScoreboardView