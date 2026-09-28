const BASE = 'http://localhost:8080/api/matches'
export const MATCH_ID = 1

async function get(path) {
  const res = await fetch(`${BASE}/${MATCH_ID}${path}`)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

async function send(method, path, body) {
  const res = await fetch(`${BASE}/${MATCH_ID}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export async function fetchAll() {
  const [match, players, bowlers, balls] = await Promise.all([
    get(''),
    get('/players'),
    get('/bowlers'),
    get('/balls'),
  ])
  return { match, players, bowlers, balls }
}

export const recordBall = (payload) => send('PUT', '/ball', payload)
export const undoBall = () => send('POST', '/undo')
export const resetMatch = () => send('POST', '/reset')