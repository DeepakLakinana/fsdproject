import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: postId } = await params
    const body = await req.json()
    const delta = body.direction === 'down' ? -1 : 1

    db.prepare(`
      UPDATE posts SET upvotes = upvotes + ? WHERE id = ?
    `).run(delta, postId)

    const updated = db.prepare('SELECT upvotes FROM posts WHERE id = ?').get(postId) as { upvotes: number }

    return NextResponse.json({ upvotes: updated ? updated.upvotes : 0 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

