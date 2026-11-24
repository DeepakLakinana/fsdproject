import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const body = await req.json()
    const { body: content, displayName } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Reply content cannot be empty' }, { status: 400 })
    }

    const replyId = `reply-${crypto.randomUUID()}`
    const createdAt = new Date().toISOString()
    const author = displayName?.trim() || 'Anonymous member'

    db.prepare(`
      INSERT INTO replies (id, postId, body, displayName, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `).run(replyId, postId, content.trim(), author, createdAt)

    return NextResponse.json({
      id: replyId,
      postId,
      body: content.trim(),
      displayName: author,
      createdAt,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

