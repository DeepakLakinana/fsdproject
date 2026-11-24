import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { PageHero, SaharaFrame } from '@/components/SaharaShell'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { AdminDashboardView } from './AdminDashboardView'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Staff & Admin Portal | SAHARA',
  description: 'Manage community posts, appointments, and member moderation.',
}

const allowedRoles = ['admin', 'counsellor', 'community_worker']

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    redirect('/login?redirect=/admin')
  }

  // Fetch all posts with reply counts
  const rawPosts = db.prepare(`
    SELECT p.*, (SELECT COUNT(*) FROM replies r WHERE r.postId = p.id) as repliesCount
    FROM posts p
    ORDER BY p.createdAt DESC
  `).all() as any[]

  // Fetch all bookings
  const rawBookings = db.prepare(`
    SELECT * FROM bookings ORDER BY date DESC
  `).all() as any[]

  // Fetch all users
  const rawUsers = db.prepare(`
    SELECT id, name, email, role, createdAt FROM users ORDER BY createdAt DESC
  `).all() as any[]

  const posts = JSON.parse(JSON.stringify(rawPosts))
  const bookings = JSON.parse(JSON.stringify(rawBookings))
  const users = JSON.parse(JSON.stringify(rawUsers))
  const plainUser = JSON.parse(JSON.stringify(user))

  return (
    <SaharaFrame>
      <PageHero
        eyebrow={
          user.role === 'counsellor'
            ? 'Counselling Portal'
            : user.role === 'community_worker'
            ? 'Community Support Worker Portal'
            : 'Administrative Portal'
        }
        heading={
          user.role === 'counsellor'
            ? 'Counsellor Workstation'
            : user.role === 'community_worker'
            ? 'Support Worker Console'
            : 'Platform Management'
        }
        lead={
          user.role === 'counsellor'
            ? 'Review counselling session requests, verify availability slots, and accept client appointments.'
            : user.role === 'community_worker'
            ? 'Manage practical support requests, community check-ins, and client scheduling.'
            : 'Oversee community moderation, track appointment allocations, and manage staff and member accounts.'
        }
      />

      <section className="bg-[#faf7f2] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <AdminDashboardView
            currentUser={plainUser}
            posts={posts}
            bookings={bookings}
            users={users}
          />
        </div>
      </section>
    </SaharaFrame>
  )
}
