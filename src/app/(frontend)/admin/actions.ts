'use server'

import { db } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

async function checkStaffOrAdmin() {
  const user = await getCurrentUser()
  const allowed = ['admin', 'counsellor', 'community_worker']
  if (!user || !user.role || !allowed.includes(user.role)) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function deletePostAction(postId: string) {
  const user = await checkStaffOrAdmin()
  if (user.role !== 'admin') throw new Error('Admin only')
  db.prepare('DELETE FROM replies WHERE postId = ?').run(postId)
  db.prepare('DELETE FROM posts WHERE id = ?').run(postId)
  revalidatePath('/admin')
  revalidatePath('/community')
}

export async function deleteReplyAction(replyId: string) {
  const user = await checkStaffOrAdmin()
  if (user.role !== 'admin') throw new Error('Admin only')
  db.prepare('DELETE FROM replies WHERE id = ?').run(replyId)
  revalidatePath('/admin')
  revalidatePath('/community')
}

export async function acceptBookingAction(bookingId: string) {
  const user = await checkStaffOrAdmin()
  db.prepare(`
    UPDATE bookings 
    SET status = 'accepted', acceptedBy = ? 
    WHERE id = ?
  `).run(user.name, bookingId)
  revalidatePath('/admin')
}

export async function rejectBookingAction(bookingId: string) {
  await checkStaffOrAdmin()
  db.prepare(`
    UPDATE bookings 
    SET status = 'declined' 
    WHERE id = ?
  `).run(bookingId)
  revalidatePath('/admin')
}

export async function updateBookingStatusAction(bookingId: string, status: string) {
  await checkStaffOrAdmin()
  db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, bookingId)
  revalidatePath('/admin')
}

export async function updateUserRoleAction(userId: string, newRole: string) {
  const user = await checkStaffOrAdmin()
  if (user.role !== 'admin') throw new Error('Admin only')

  const validRoles = ['user', 'counsellor', 'community_worker', 'admin']
  if (!validRoles.includes(newRole)) {
    throw new Error('Invalid role specified')
  }

  db.prepare('UPDATE users SET role = ? WHERE id = ?').run(newRole, userId)
  revalidatePath('/admin')
}

export async function deleteUserAction(userId: string) {
  const user = await checkStaffOrAdmin()
  if (user.role !== 'admin') throw new Error('Admin only')
  db.prepare('DELETE FROM users WHERE id = ? AND role != "admin"').run(userId)
  revalidatePath('/admin')
}
