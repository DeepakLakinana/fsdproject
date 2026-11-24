'use client'

import { useState } from 'react'
import {
  deletePostAction,
  deleteReplyAction,
  acceptBookingAction,
  rejectBookingAction,
  deleteUserAction,
  updateUserRoleAction,
} from './actions'
import {
  MessageSquare,
  Calendar,
  Users,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  UserCheck,
  Video,
  Mail,
  User as UserIcon,
} from 'lucide-react'

type CurrentUser = {
  id: string
  name: string
  email: string
  role?: string
}

type PostItem = {
  id: string
  title: string
  body: string
  displayName: string
  category: string
  upvotes: number
  createdAt: string
  repliesCount: number
}

type BookingItem = {
  id: string
  supportType: string
  date: string
  preferredDate?: string
  preferredTime?: string
  contactName?: string
  contactEmail?: string
  meetingFormat?: string
  notes?: string
  acceptedBy?: string
  status: string
}

type UserItem = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

function formatDate(dateStr?: string) {
  if (!dateStr) return 'N/A'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toISOString().split('T')[0] // Always YYYY-MM-DD on both server and client
  } catch {
    return dateStr
  }
}

export function AdminDashboardView({
  currentUser,
  posts,
  bookings,
  users,
}: {
  currentUser: CurrentUser
  posts: PostItem[]
  bookings: BookingItem[]
  users: UserItem[]
}) {
  const role = currentUser.role || 'user'
  const isCounsellor = role === 'counsellor'
  const isWorker = role === 'community_worker'
  const isAdmin = role === 'admin'

  // Default tab based on role
  const [tab, setTab] = useState<'bookings' | 'posts' | 'users'>(
    isCounsellor || isWorker ? 'bookings' : 'bookings'
  )

  // Filter bookings for specialized roles
  const relevantBookings = bookings.filter((b) => {
    if (isCounsellor) {
      return (
        b.supportType.toLowerCase().includes('counsell') ||
        b.supportType.toLowerCase().includes('general')
      )
    }
    if (isWorker) {
      return (
        b.supportType.toLowerCase().includes('community') ||
        b.supportType.toLowerCase().includes('general')
      )
    }
    return true
  })

  return (
    <div className="space-y-8">
      {/* Top Banner showing Role Permissions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-3xl bg-white border border-[#43243a]/15 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#eae3ef] text-[#43243a]">
            <Shield className="size-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-xl font-bold text-[#43243a]">{currentUser.name}</span>
              <span className="rounded-full bg-[#43243a] px-3 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                {role === 'counsellor'
                  ? 'Counsellor Access'
                  : role === 'community_worker'
                  ? 'Community Worker Access'
                  : 'System Administrator'}
              </span>
            </div>
            <p className="text-xs text-[#8c657b] mt-0.5">
              {isCounsellor
                ? 'Authorized to review, accept, or decline Counselling appointments.'
                : isWorker
                ? 'Authorized to accept or decline Community Support Worker appointments.'
                : 'Full authority across all appointments, community discussions, and user moderation.'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#43243a]/15 pb-3 gap-6">
        <button
          onClick={() => setTab('bookings')}
          className={`font-serif text-lg transition pb-2 ${
            tab === 'bookings'
              ? 'text-[#43243a] border-b-2 border-[#43243a] font-bold'
              : 'text-[#8c657b] hover:text-[#43243a]'
          }`}
        >
          {isCounsellor
            ? `Counselling Queue (${relevantBookings.length})`
            : isWorker
            ? `Worker Queue (${relevantBookings.length})`
            : `All Appointments (${bookings.length})`}
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setTab('posts')}
              className={`font-serif text-lg transition pb-2 ${
                tab === 'posts'
                  ? 'text-[#43243a] border-b-2 border-[#43243a] font-bold'
                  : 'text-[#8c657b] hover:text-[#43243a]'
              }`}
            >
              Community Moderation ({posts.length})
            </button>
            <button
              onClick={() => setTab('users')}
              className={`font-serif text-lg transition pb-2 ${
                tab === 'users'
                  ? 'text-[#43243a] border-b-2 border-[#43243a] font-bold'
                  : 'text-[#8c657b] hover:text-[#43243a]'
              }`}
            >
              Accounts & Staff ({users.length})
            </button>
          </>
        )}
      </div>

      {/* Tab: Bookings Queue */}
      {tab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-[#43243a]">
              {isCounsellor
                ? 'Counselling Appointments'
                : isWorker
                ? 'Community Support Worker Appointments'
                : 'Appointments Overview'}
            </h3>
            <span className="text-xs font-semibold text-[#8c657b]">
              Showing {relevantBookings.length} total requests
            </span>
          </div>

          {relevantBookings.length === 0 ? (
            <div className="rounded-[2.5rem] border border-[#43243a]/10 bg-white p-12 text-center text-[#8c657b]">
              <Calendar className="mx-auto mb-3 size-12 opacity-40" />
              <p className="font-serif text-xl">No appointments pending in this queue.</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {relevantBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-[2rem] border border-[#43243a]/15 bg-white p-6 shadow-sm space-y-4 hover:shadow-md transition"
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-3 border-b border-[#43243a]/10 pb-3">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        {b.supportType}
                      </span>
                      <h4 className="font-serif text-xl text-[#43243a]">
                        Client: {b.contactName || 'Anonymous'}
                      </h4>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${
                        b.status === 'accepted'
                          ? 'bg-[#e6eee7] text-[#2d5a35]'
                          : b.status === 'declined'
                          ? 'bg-[#fee2e2] text-[#991b1b]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl bg-[#faf7f2] p-2.5">
                      <span className="text-[#8c657b] block font-semibold mb-0.5">Date Requested</span>
                      <span className="font-bold text-[#43243a] text-sm">
                        {b.preferredDate || formatDate(b.date)}
                      </span>
                    </div>
                    <div className="rounded-xl bg-[#faf7f2] p-2.5">
                      <span className="text-[#8c657b] block font-semibold mb-0.5">Preferred Slot</span>
                      <span className="font-bold text-[#43243a] text-sm">{b.preferredTime || 'Flexible'}</span>
                    </div>
                    <div className="rounded-xl bg-[#faf7f2] p-2.5">
                      <span className="text-[#8c657b] block font-semibold mb-0.5">Meeting Format</span>
                      <span className="font-medium text-[#43243a]">{b.meetingFormat || 'Online Call'}</span>
                    </div>
                    <div className="rounded-xl bg-[#faf7f2] p-2.5">
                      <span className="text-[#8c657b] block font-semibold mb-0.5">Contact Method</span>
                      <span className="font-medium text-[#43243a] truncate block">
                        {b.contactEmail || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {b.notes && (
                    <div className="rounded-xl bg-[#faf7f2] p-3 text-xs text-[#5b5057]">
                      <span className="font-bold text-[#43243a] block mb-1">Client Notes:</span>
                      "{b.notes}"
                    </div>
                  )}

                  {b.acceptedBy && (
                    <p className="text-xs text-[#2d5a35] font-semibold flex items-center gap-1.5">
                      <UserCheck className="size-4" />
                      Accepted by: {b.acceptedBy}
                    </p>
                  )}

                  {/* Staff Action Buttons */}
                  <div className="flex items-center justify-end gap-3 border-t border-[#43243a]/10 pt-4">
                    {b.status !== 'accepted' && (
                      <form action={() => acceptBookingAction(b.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 rounded-full bg-[#2d5a35] px-4 py-2 text-xs font-bold text-white hover:bg-[#23482a] transition"
                        >
                          <CheckCircle2 className="size-4" />
                          Accept Appointment
                        </button>
                      </form>
                    )}

                    {b.status !== 'declined' && (
                      <form action={() => rejectBookingAction(b.id)}>
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 rounded-full bg-[#fee2e2] px-4 py-2 text-xs font-bold text-[#991b1b] hover:bg-[#fcd0d0] transition"
                        >
                          <XCircle className="size-4" />
                          Decline
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Posts Moderation (Admin only) */}
      {isAdmin && tab === 'posts' && (
        <div className="rounded-[2.5rem] border border-[#43243a]/10 bg-white p-7 shadow-sm">
          <h3 className="font-serif text-2xl text-[#43243a] mb-6">Manage Community Posts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#43243a]">
              <thead>
                <tr className="border-b border-[#43243a]/10 text-xs uppercase tracking-wider text-[#8c657b]">
                  <th className="pb-3">Title & Content</th>
                  <th className="pb-3">Author</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Stats</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#43243a]/10">
                {posts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#faf7f2]/50">
                    <td className="py-4 max-w-xs">
                      <p className="font-semibold">{p.title}</p>
                      <p className="text-xs text-[#8c657b] line-clamp-1">{p.body}</p>
                    </td>
                    <td className="py-4 text-[#8c657b]">{p.displayName}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-[#eae3ef] px-2.5 py-1 text-xs font-medium">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 text-xs text-[#8c657b]">
                      ▲ {p.upvotes} · {p.repliesCount} replies
                    </td>
                    <td className="py-4 text-right">
                      <form
                        action={async () => {
                          if (confirm('Delete this post and its replies?')) {
                            await deletePostAction(p.id)
                          }
                        }}
                      >
                        <button
                          type="submit"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#991b1b] hover:underline"
                        >
                          <Trash2 className="size-4" /> Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Users & Roles (Admin only) */}
      {isAdmin && tab === 'users' && (
        <div className="rounded-[2.5rem] border border-[#43243a]/10 bg-white p-7 shadow-sm">
          <h3 className="font-serif text-2xl text-[#43243a] mb-6">Staff & Member Directory</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#43243a]">
              <thead>
                <tr className="border-b border-[#43243a]/10 text-xs uppercase tracking-wider text-[#8c657b]">
                  <th className="pb-3">Name</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">System Role</th>
                  <th className="pb-3">Joined Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#43243a]/10">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#faf7f2]/50">
                    <td className="py-4 font-semibold">{u.name}</td>
                    <td className="py-4 text-[#8c657b]">{u.email}</td>
                    <td className="py-4">
                      {u.id === currentUser.id ? (
                        <span className="rounded-full bg-[#43243a] px-3 py-1 text-xs font-bold text-white uppercase tracking-wider">
                          {u.role} (You)
                        </span>
                      ) : (
                        <select
                          value={u.role || 'user'}
                          onChange={async (e) => {
                            const newRole = e.target.value
                            if (confirm(`Change role of ${u.name} to "${newRole}"?`)) {
                              await updateUserRoleAction(u.id, newRole)
                            }
                          }}
                          className="rounded-xl border border-[#43243a]/20 bg-[#faf7f2] px-3 py-1.5 text-xs font-bold text-[#43243a] focus:border-[#43243a] focus:outline-none"
                        >
                          <option value="user">User (Member)</option>
                          <option value="counsellor">Counsellor</option>
                          <option value="community_worker">Community Support Worker</option>
                          <option value="admin">System Administrator</option>
                        </select>
                      )}
                    </td>
                    <td className="py-4 text-xs text-[#8c657b]">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="py-4 text-right">
                      {u.role !== 'admin' && (
                        <form
                          action={async () => {
                            if (confirm(`Remove account for ${u.name}?`)) {
                              await deleteUserAction(u.id)
                            }
                          }}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#991b1b] hover:underline"
                          >
                            <Trash2 className="size-4" /> Remove
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
