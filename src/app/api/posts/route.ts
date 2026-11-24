import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() as Array<{
      id: string
      title: string
      body: string
      displayName: string
      category: string
      upvotes: number
      createdAt: string
    }>

    const replies = db.prepare('SELECT * FROM replies ORDER BY createdAt ASC').all() as Array<{
      id: string
      postId: string
      body: string
      displayName: string
      createdAt: string
    }>

    const repliesByPost = new Map<string, typeof replies>()
    for (const reply of replies) {
      const list = repliesByPost.get(reply.postId) ?? []
      list.push(reply)
      repliesByPost.set(reply.postId, list)
    }

    const result = posts.map((post) => ({
      ...post,
      replies: repliesByPost.get(post.id) ?? [],
    }))

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, body: content, displayName, category } = body

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const id = `post-${crypto.randomUUID()}`
    const createdAt = new Date().toISOString()
    const author = displayName?.trim() || 'Anonymous member'
    const cat = category || 'general-support'

    db.prepare(`
      INSERT INTO posts (id, title, body, displayName, category, upvotes, createdAt)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `).run(id, title.trim(), content.trim(), author, cat, createdAt)

    return NextResponse.json({
      id,
      title: title.trim(),
      body: content.trim(),
      displayName: author,
      category: cat,
      upvotes: 0,
      createdAt,
      replies: [],
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

