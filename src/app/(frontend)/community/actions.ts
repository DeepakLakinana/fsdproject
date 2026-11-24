'use server'

import { db } from '@/lib/db'
import crypto from 'crypto'
import { revalidatePath } from 'next/cache'
import type { CommunityActionState } from './types'

const categories = new Set([
  'general-support',
  'emotional-wellbeing',
  'practical-help',
  'community-belonging',
  'safety-planning',
])

function textValue(formData: FormData, field: string) {
  const value = formData.get(field)
  return typeof value === 'string' ? value.trim() : ''
}

function validateDisplayName(value: string) {
  return value ? value.slice(0, 40) : 'Anonymous member'
}

export async function createCommunityPost(
  _previousState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  if (textValue(formData, 'website')) {
    return { status: 'success', message: 'Your post was sent for review.' }
  }

  const title = textValue(formData, 'title')
  const body = textValue(formData, 'body')
  const category = textValue(formData, 'category')
  const displayName = validateDisplayName(textValue(formData, 'displayName'))
  const fieldErrors: Record<string, string> = {}

  if (title.length < 5 || title.length > 120) {
    fieldErrors.title = 'Use between 5 and 120 characters.'
  }
  if (body.length < 10 || body.length > 3000) {
    fieldErrors.body = 'Use between 10 and 3,000 characters.'
  }
  if (!categories.has(category)) {
    fieldErrors.category = 'Choose a valid topic.'
  }

  if (Object.keys(fieldErrors).length) {
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
  }

  try {
    const id = `post-${crypto.randomUUID()}`
    const createdAt = new Date().toISOString()

    db.prepare(`
      INSERT INTO posts (id, title, body, displayName, category, upvotes, createdAt)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(id, title, body, displayName, category, createdAt)

    revalidatePath('/community')
    return { status: 'success', message: 'Your post has been published.' }
  } catch (err: any) {
    return { status: 'error', message: err?.message || 'Failed to publish post.' }
  }
}

export async function createCommunityReply(
  _previousState: CommunityActionState,
  formData: FormData,
): Promise<CommunityActionState> {
  const post = textValue(formData, 'post')
  const body = textValue(formData, 'body')
  const displayName = validateDisplayName(textValue(formData, 'displayName'))
  const fieldErrors: Record<string, string> = {}

  if (!post) {
    fieldErrors.post = 'Post is required.'
  }
  if (body.length < 5 || body.length > 1000) {
    fieldErrors.body = 'Use between 5 and 1,000 characters.'
  }

  if (Object.keys(fieldErrors).length) {
    return { status: 'error', message: 'Please check the highlighted fields.', fieldErrors }
  }

  try {
    const id = `reply-${crypto.randomUUID()}`
    const createdAt = new Date().toISOString()

    db.prepare(`
      INSERT INTO replies (id, postId, body, displayName, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, post, body, displayName, createdAt)

    revalidatePath('/community')
    return { status: 'success', message: 'Your reply has been added.' }
  } catch (err: any) {
    return { status: 'error', message: err?.message || 'Failed to add reply.' }
  }
}
