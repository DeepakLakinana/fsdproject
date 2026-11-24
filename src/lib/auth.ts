import crypto from 'crypto'
import { cookies } from 'next/headers'
import { db } from './db'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export type UserSession = {
  id: string
  name: string
  email: string
  role?: string
}

export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies()
  const sessionUser = cookieStore.get('sahara_user')?.value

  if (!sessionUser) return null

  try {
    const parsed = JSON.parse(sessionUser) as UserSession
    const row = db
      .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
      .get(parsed.id) as UserSession | undefined
    if (!row) return null
    return {
      id: String(row.id),
      name: String(row.name),
      email: String(row.email),
      role: String(row.role || 'user'),
    }
  } catch {
    return null
  }
}
