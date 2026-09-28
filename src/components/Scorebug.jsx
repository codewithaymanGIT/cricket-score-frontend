import { formatOvers, runRate, shortName } from '../utils'

function TeamRow({ name, runs, wickets, balls, color, batting, yetToBat }) {
  return (
    <div className={`team-row ${batting ? 'is-batting' : ''}`}>
      <span className={`team-badge team-${color}`}>{shortName(name)}</span>
      <span className="team-name">{name}</span>
      <span className="team-score">
        {yetToBat ? <em>Yet to bat</em> : <>{runs}<span className="wk">/{wickets}</span></>}
      </span>
      <span className="team-overs">{yetToBat ? '' : `(${formatOvers(balls)})`}</span>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  )
}

function Scorebug({ match }) {
  const innings = match.currentInnings
  const live = match.status === 'LIVE'

  const battingName = innings === 1 ? match.teamA : match.teamB
  const runs = innings === 1 ? match.teamARuns : match.teamBRuns
  const balls = innings === 1 ? match.teamABalls : match.teamBBalls

  const ballsLeft = Math.max(0, match.oversLimit * 6 - balls)
  const target = innings === 2 ? match.teamARuns + 1 : null
  const need = target ? Math.max(0, target - runs) : null
  const rrr = target && ballsLeft > 0 ? (need / (ballsLeft / 6)).toFixed(2) : '–'

  return (
    <section className="scorebug">
      <div className="bug-status">
        {live ? <><span className="live-dot" /> Live</> : 'Final'}
        <span>·</span> {match.oversLimit}-over match <span>·</span> Innings {innings}
      </div>

      <div className="bug-teams">
        <TeamRow
          name={match.teamA}
          runs={match.teamARuns}
          wickets={match.teamAWickets}
          balls={match.teamABalls}
          color="a"
          batting={live && innings === 1}
        />
        <TeamRow
          name={match.teamB}
          runs={match.teamBRuns}
          wickets={match.teamBWickets}
          balls={match.teamBBalls}
          color="b"
          batting={live && innings === 2}
          yetToBat={innings === 1}
        />
      </div>

      <div className="bug-stats">
        <Stat label="CRR" value={runRate(runs, balls)} />
        {target && <Stat label="Target" value={target} />}
        {target && <Stat label="RRR" value={rrr} />}
        <Stat label="Balls left" value={ballsLeft} />
      </div>

      {target && live && (
        <div className="bug-equation">
          {battingName} need {need} run{need === 1 ? '' : 's'} from {ballsLeft} ball{ballsLeft === 1 ? '' : 's'}
        </div>
      )}
    </section>
  )
}

export default Scorebug