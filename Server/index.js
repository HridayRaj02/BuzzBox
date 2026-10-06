const crypto = require('node:crypto')
const { promisify } = require('node:util')
require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')

const app = express()
const port = Number(process.env.PORT || 2222)
const sessionCookie = 'buzzbox_session'
const sessionDurationMs = 7 * 24 * 60 * 60 * 1000
const scrypt = promisify(crypto.scrypt)
const pool = new Pool(process.env.DATABASE_URL ? { connectionString: process.env.DATABASE_URL } : undefined)
let schemaReady

app.disable('x-powered-by')
app.use(express.json({ limit: '16kb' }))

async function ensureDatabase() {
  if (!process.env.DATABASE_URL) {
    const error = new Error('DATABASE_URL is not configured.')
    error.code = 'DATABASE_NOT_CONFIGURED'
    throw error
  }
  if (!schemaReady) {
    schemaReady = pool.query('SELECT id FROM users LIMIT 0').catch((error) => {
      schemaReady = undefined
      throw error
    })
  }
  return schemaReady
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    const error = new Error('SESSION_SECRET must be configured with at least 32 characters.')
    error.code = 'SESSION_NOT_CONFIGURED'
    throw error
  }
  return secret
}

function createSession(userId) {
  const expires = Date.now() + sessionDurationMs
  const payload = `${userId}.${expires}`
  const signature = crypto.createHmac('sha256', sessionSecret()).update(payload).digest('base64url')
  return { value: `${payload}.${signature}`, expires }
}

function readSession(req) {
  const value = req.headers.cookie?.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${sessionCookie}=`))?.slice(sessionCookie.length + 1)
  if (!value) return null
  const [idText, expiryText, signature] = value.split('.')
  const userId = Number(idText)
  const expires = Number(expiryText)
  if (!Number.isSafeInteger(userId) || !Number.isSafeInteger(expires) || expires <= Date.now() || !signature) return null
  const payload = `${idText}.${expiryText}`
  const expected = crypto.createHmac('sha256', sessionSecret()).update(payload).digest()
  let received
  try { received = Buffer.from(signature, 'base64url') } catch { return null }
  if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) return null
  return userId
}

function setSessionCookie(res, userId) {
  const session = createSession(userId)
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${sessionCookie}=${session.value}; HttpOnly; SameSite=Lax; Path=/; Expires=${new Date(session.expires).toUTCString()}${secure}`)
}

function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  res.setHeader('Set-Cookie', `${sessionCookie}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`)
}

function publicUser(row) {
  return { id: row.id, name: row.name, email: row.email, phone: row.phone }
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function authError(res, error) {
  if (error.code === 'DATABASE_NOT_CONFIGURED' || error.code === 'SESSION_NOT_CONFIGURED') {
    return res.status(503).json({ error: 'Sign-in is not configured yet. Set up the server database and session secret.' })
  }
  console.error('Authentication request failed:', error.message)
  return res.status(503).json({ error: 'The sign-in service is temporarily unavailable. Please try again.' })
}

app.get('/api/health', async (_req, res) => {
  try {
    await ensureDatabase()
    return res.json({ status: 'ok', database: 'connected' })
  } catch (error) {
    return res.status(503).json({ status: 'unavailable', database: process.env.DATABASE_URL ? 'unavailable' : 'not_configured' })
  }
})

app.post('/api/auth/signup', async (req, res) => {
  try {
    await ensureDatabase()
    sessionSecret()
    const name = cleanText(req.body?.name)
    const email = cleanText(req.body?.email).toLowerCase()
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    const phone = cleanText(req.body?.phone) || null
    if (name.length < 2 || name.length > 100) return res.status(400).json({ error: 'Enter a name between 2 and 100 characters.' })
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' })
    if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be between 8 and 128 characters.' })
    if (phone && phone.length > 32) return res.status(400).json({ error: 'Enter a valid phone number.' })
    const salt = crypto.randomBytes(16).toString('hex')
    const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })
    const passwordHash = `${salt}:${derived.toString('hex')}`
    const result = await pool.query(
      'INSERT INTO users (name, email, phone, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email, phone',
      [name, email, phone, passwordHash],
    )
    setSessionCookie(res, result.rows[0].id)
    return res.status(201).json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists. Sign in instead.' })
    return authError(res, error)
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    await ensureDatabase()
    sessionSecret()
    const email = cleanText(req.body?.email).toLowerCase()
    const password = typeof req.body?.password === 'string' ? req.body.password : ''
    if (!email || !password) return res.status(400).json({ error: 'Enter your email and password.' })
    const result = await pool.query('SELECT id, name, email, phone, password_hash FROM users WHERE email = $1 LIMIT 1', [email])
    const row = result.rows[0]
    if (!row) return res.status(401).json({ error: 'Email or password is incorrect.' })
    const [salt, storedHex] = row.password_hash.split(':')
    const storedHash = Buffer.from(storedHex, 'hex')
    const derived = await scrypt(password, salt, storedHash.length, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 })
    if (derived.length !== storedHash.length || !crypto.timingSafeEqual(derived, storedHash)) {
      return res.status(401).json({ error: 'Email or password is incorrect.' })
    }
    setSessionCookie(res, row.id)
    return res.json({ user: publicUser(row) })
  } catch (error) {
    return authError(res, error)
  }
})

app.get('/api/auth/me', async (req, res) => {
  try {
    await ensureDatabase()
    const userId = readSession(req)
    if (!userId) return res.status(401).json({ error: 'Sign in to continue.' })
    const result = await pool.query('SELECT id, name, email, phone FROM users WHERE id = $1 LIMIT 1', [userId])
    if (!result.rows[0]) return res.status(401).json({ error: 'Sign in to continue.' })
    return res.json({ user: publicUser(result.rows[0]) })
  } catch (error) {
    return authError(res, error)
  }
})

app.post('/api/auth/logout', (_req, res) => {
  clearSessionCookie(res)
  return res.status(204).end()
})

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Request body must be valid JSON.' })
  console.error(error)
  return res.status(500).json({ error: 'Unexpected server error.' })
})

const server = app.listen(port, () => {
  console.log(`BuzzBox API listening on http://localhost:${port}`)
  ensureDatabase().then(() => console.log('PostgreSQL connected; users table is ready.')).catch((error) => {
    console.error(`Database not ready: ${error.message}`)
  })
})

async function shutdown() {
  server.close()
  await pool.end()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
