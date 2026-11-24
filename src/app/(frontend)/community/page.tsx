import type { Metadata } from 'next'
import { CommunityForum, type ForumPost } from '@/components/CommunityForum'
import { PageHero, SaharaFrame } from '@/components/SaharaShell'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Community | SAHARA',
  description: 'Join moderated conversations and share support in the SAHARA community.',
}

async function getCommunityPosts(): Promise<ForumPost[]> {
  try {
    const posts = db.prepare('SELECT * FROM posts ORDER BY createdAt DESC').all() as Array<{
      id: string
      title: string
      body: string
      displayName: string
      category: string
      createdAt: string
    }>

    const replies = db.prepare('SELECT * FROM replies ORDER BY createdAt ASC').all() as Array<{
      id: string
      postId: string
      body: string
      displayName: string
      createdAt: string
    }>

    const repliesByPost = new Map<string, ForumPost['replies']>()
    for (const reply of replies) {
      const list = repliesByPost.get(reply.postId) ?? []
      list.push({
        id: reply.id,
        body: reply.body,
        displayName: reply.displayName,
        createdAt: reply.createdAt,
      })
      repliesByPost.set(reply.postId, list)
    }

    return posts.map((post) => ({
      id: post.id,
      title: post.title,
      body: post.body,
      displayName: post.displayName,
      category: post.category,
      createdAt: post.createdAt,
      replies: repliesByPost.get(post.id) ?? [],
    }))
  } catch (error) {
    console.error('[community] Database query failed:', error)
    return []
  }
}

export default async function CommunityPage() {
  const posts = await getCommunityPosts()

  return (
    <SaharaFrame>
      <PageHero
        eyebrow="Community Forum"
        heading="A safe place to share, listen, and connect."
        lead="Our community brings together people navigating life changes, emotional wellbeing, and safety planning. Posts and replies are moderated with compassion."
      />

      <CommunityForum posts={posts} />
    </SaharaFrame>
  )
}
