import { useState } from 'react'
import { formatOvers, shortName } from '../utils'

function Scorecard({ match, players, bowlers, balls }) {
  const [selected, setSelected] = useState(null)
  const innings = selected ?? match.currentInnings

  const battingTeam = innings === 1 ? match.teamA : match.teamB
  const bowlingTeam = innings === 1 ? match.teamB : match.teamA
  const inningsBalls = balls.filter((b) => b.innings === innings)
  const last = inningsBalls[inningsBalls.length - 1]
  const isLiveInnings = match.status === 'LIVE' && innings === match.currentInnings

  const count = (predicate) => inningsBalls.filter(predicate).length

  const total =
    innings === 1
      ? { runs: match.teamARuns, wickets: match.teamAWickets, balls: match.teamABalls }
      : { runs: match.teamBRuns, wickets: match.teamBWickets, balls: match.teamBBalls }

  const batters = players.filter((p) => p.team === battingTeam)
  const attack = bowlers.filter((b) => b.team === bowlingTeam)

  return (
    <section className="card">
      <div className="card-head">
        <h3 className="card-title">Scorecard</h3>
        <div className="tabs">
          {[1, 2].map((i) => (
            <button
              key={i}
              className={`tab ${innings === i ? 'tab-on' : ''}`}
              onClick={() => setSelected(i)}
            >
              {shortName(i === 1 ? match.teamA : match.teamB)} innings
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Batter</th>
              <th className="num">R</th>
              <th className="num">B</th>
              <th className="num">4s</th>
              <th className="num">6s</th>
              <th className="num">SR</th>
            </tr>
          </thead>
          <tbody>
            {batters.map((p) => {
              const yetToBat = !p.out && p.ballsFaced === 0
              const onStrike = isLiveInnings && last && last.strikerId === p.id && !p.out
              return (
                <tr key={p.id} className={yetToBat ? 'row-dim' : ''}>
                  <td>
                    <div className="player">
                      {p.name}
                      {onStrike && <span className="strike">*</span>}
                    </div>
                    <div className="dismissal">
                      {p.out ? p.dismissalInfo : yetToBat ? 'yet to bat' : 'not out'}
                    </div>
                  </td>
                  <td className="num strong">{p.runs}</td>
                  <td className="num">{p.ballsFaced}</td>
                  <td className="num">{count((b) => b.strikerId === p.id && b.runs === 4)}</td>
                  <td className="num">{count((b) => b.strikerId === p.id && b.runs === 6)}</td>
                  <td className="num">
                    {p.ballsFaced > 0 ? ((p.runs / p.ballsFaced) * 100).toFixed(1) : '–'}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td>
              <td className="num" colSpan={5}>
                {total.runs}/{total.wickets} ({formatOvers(total.balls)} ov)
              </td>
            </tr>
          </tfoot>
        </table>

        <table className="table">
          <thead>
            <tr>
              <th>Bowler</th>
              <th className="num">O</th>
              <th className="num">R</th>
              <th className="num">W</th>
              <th className="num">Dots</th>
              <th className="num">Econ</th>
            </tr>
          </thead>
          <tbody>
            {attack.map((b) => {
              const bowling = isLiveInnings && last && last.bowlerId === b.id
              return (
                <tr key={b.id} className={b.ballsBowled === 0 ? 'row-dim' : ''}>
                  <td>
                    <div className="player">
                      {b.name}
                      {bowling && <span className="strike">*</span>}
                    </div>
                  </td>
                  <td className="num">{formatOvers(b.ballsBowled)}</td>
                  <td className="num">{b.runsConceded}</td>
                  <td className="num strong">{b.wickets}</td>
                  <td className="num">{count((x) => x.bowlerId === b.id && x.runs === 0)}</td>
                  <td className="num">
                    {b.ballsBowled > 0 ? (b.runsConceded / (b.ballsBowled / 6)).toFixed(2) : '–'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Scorecard