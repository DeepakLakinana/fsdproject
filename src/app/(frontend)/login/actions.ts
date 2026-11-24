'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { hashPassword } from '@/lib/auth'

export type AuthState = {
  error?: string
  success?: boolean
}

export async function loginAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Please enter both email and password.' }
  }

  const hashedPassword = hashPassword(password)
  const user = db.prepare(
    'SELECT id, name, email, role FROM users WHERE email = ? AND passwordHash = ?'
  ).get(email, hashedPassword) as { id: string; name: string; email: string; role: string } | undefined

  if (!user) {
    return { error: 'Invalid email or password.' }
  }

  const redirectPath = (formData.get('redirect') as string) || (user.role === 'admin' ? '/admin' : '/community')

  const cookieStore = await cookies()
  cookieStore.set('sahara_user', JSON.stringify(user), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })

  redirect(redirectPath)
}

export async function registerAction(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const password = formData.get('password') as string

  if (!name || !email || !password) {
    return { error: 'All fields are required.' }
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters.' }
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
  if (existing) {
    return { error: 'An account with this email already exists.' }
  }

  const id = `user-${crypto.randomUUID()}`
  const hashedPassword = hashPassword(password)
  const createdAt = new Date().toISOString()

  db.prepare(`
    INSERT INTO users (id, name, email, passwordHash, createdAt)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, name, email, hashedPassword, createdAt)

  const cookieStore = await cookies()
  cookieStore.set('sahara_user', JSON.stringify({ id, name, email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })

  redirect('/community')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('sahara_user')
  redirect('/login')
}

