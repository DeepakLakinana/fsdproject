import { DatabaseSync } from 'node:sqlite'
import path from 'path'
import fs from 'fs'
import crypto from 'crypto'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

const dbPath = path.join(dataDir, 'app.db')

declare global {
  // eslint-disable-next-line no-var
  var __app_db: DatabaseSync | undefined
}

function getDatabase(): DatabaseSync {
  if (global.__app_db) {
    return global.__app_db
  }

  const db = new DatabaseSync(dbPath)

  // Initialize schema if not exists
  db.exec(`
    CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      displayName TEXT NOT NULL,
      category TEXT NOT NULL,
      upvotes INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      postId TEXT NOT NULL,
      body TEXT NOT NULL,
      displayName TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      supportType TEXT NOT NULL,
      date TEXT NOT NULL,
      preferredDate TEXT,
      preferredTime TEXT,
      contactName TEXT,
      contactEmail TEXT,
      meetingFormat TEXT,
      notes TEXT,
      acceptedBy TEXT,
      status TEXT DEFAULT 'pending'
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT DEFAULT 'user',
      createdAt TEXT NOT NULL
    );
  `)

  // Ensure role column exists if table was created previously without it
  try {
    db.exec(`ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'`)
  } catch {
    // Column already exists
  }

  // Seed default admin user if not exists
  const adminCheck = db.prepare('SELECT id FROM users WHERE email = ?').get('admin@sahara.org')
  if (!adminCheck) {
    const adminHash = crypto.createHash('sha256').update('Admin@123').digest('hex')
    db.prepare(`
      INSERT INTO users (id, name, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run('user-admin-1', 'SAHARA Admin', 'admin@sahara.org', adminHash, 'admin', new Date().toISOString())
  }

  // Seed sample community posts if empty
  const countRow = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number }
  if (countRow.count === 0) {
    const insertPost = db.prepare(`
      INSERT INTO posts (id, title, body, displayName, category, upvotes, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `)

    const insertReply = db.prepare(`
      INSERT INTO replies (id, postId, body, displayName, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `)

    insertPost.run(
      'post-1',
      'Feeling overwhelmed with work and life changes',
      'Lately everything feels like too much at once. Taking small steps every day, but wanted to ask if anyone has grounding techniques that truly helped them.',
      'Aria S.',
      'emotional-wellbeing',
      14,
      new Date(Date.now() - 3600000 * 24).toISOString()
    )

    insertReply.run(
      'reply-1',
      'post-1',
      'The 5-4-3-2-1 technique really helps me when anxiety peaks. Sending you so much warmth!',
      'Elena R.',
      new Date(Date.now() - 3600000 * 12).toISOString()
    )

    insertPost.run(
      'post-2',
      'Safe spaces and community workshops this month',
      'Just wanted to share that the weekend community circle is hosting peer listening sessions. You are never alone here.',
      'Community Guide',
      'general-support',
      28,
      new Date(Date.now() - 3600000 * 48).toISOString()
    )
  }

  global.__app_db = db
  return db
}

export const db = getDatabase()
