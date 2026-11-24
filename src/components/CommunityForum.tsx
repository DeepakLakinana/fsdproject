'use client'

import { useActionState, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronDown,
  CircleCheck,
  MessageCircle,
  PenLine,
  Search,
  Send,
  ShieldCheck,
  X,
} from 'lucide-react'
import {
  createCommunityPost,
  createCommunityReply,
} from '@/app/(frontend)/community/actions'
import {
  initialCommunityActionState,
  type CommunityActionState,
} from '@/app/(frontend)/community/types'

export type ForumReply = {
  id: string
  body: string
  displayName: string
  createdAt: string
}

export type ForumPost = {
  id: string
  title: string
  body: string
  displayName: string
  category: string
  createdAt: string
  replies: ForumReply[]
}

const topics = [
  { value: 'all', label: 'All conversations' },
  { value: 'general-support', label: 'General support' },
  { value: 'emotional-wellbeing', label: 'Emotional wellbeing' },
  { value: 'practical-help', label: 'Practical help' },
  { value: 'community-belonging', label: 'Community & belonging' },
  { value: 'safety-planning', label: 'Safety planning' },
]

const topicLabel = Object.fromEntries(topics.map((topic) => [topic.value, topic.label]))

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value))
}

function FormMessage({ state }: { state: CommunityActionState }) {
  if (state.status === 'idle') return null

  return (
    <p
      role="status"
      className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
        state.status === 'success' ? 'bg-[#e4eee6] text-[#31553a]' : 'bg-[#f6e1e5] text-[#7a2f42]'
      }`}
    >
      {state.message}
    </p>
  )
}

function NewPostPanel({ onClose }: { onClose: () => void }) {
  const [state, action, pending] = useActionState(createCommunityPost, initialCommunityActionState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  return (
    <div className="mb-6 rounded-[2rem] border border-[#43243a]/12 bg-white p-5 shadow-[0_20px_60px_rgba(67,36,58,.08)] md:p-7">
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8c657b]">
            Start a conversation
          </p>
          <h2 className="mt-2 font-serif text-3xl text-[#43243a]">What’s on your mind?</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close post form"
          className="rounded-full border border-[#43243a]/15 p-2 text-[#43243a] hover:bg-[#f1ebed]"
        >
          <X className="size-5" />
        </button>
      </div>

      <form ref={formRef} action={action} className="space-y-5">
        <div className="hidden" aria-hidden="true">
          <label htmlFor="post-website">Website</label>
          <input id="post-website" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-[#43243a]">
            Display name
            <input
              name="displayName"
              maxLength={40}
              placeholder="Anonymous member"
              className="rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] px-4 py-3 font-normal outline-none transition focus:border-[#8c657b] focus:ring-2 focus:ring-[#d8a6b1]/30"
            />
          </label>
          <label className="grid gap-2 text-sm font-bold text-[#43243a]">
            Topic
            <select
              name="category"
              required
              defaultValue="general-support"
              className="rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] px-4 py-3 font-normal outline-none transition focus:border-[#8c657b] focus:ring-2 focus:ring-[#d8a6b1]/30"
            >
              {topics.slice(1).map((topic) => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
            {state.fieldErrors?.category && (
              <span className="font-normal text-[#9b3c55]">{state.fieldErrors.category}</span>
            )}
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-[#43243a]">
          Title
          <input
            name="title"
            required
            minLength={5}
            maxLength={120}
            placeholder="Give your conversation a clear title"
            className="rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] px-4 py-3 font-normal outline-none transition focus:border-[#8c657b] focus:ring-2 focus:ring-[#d8a6b1]/30"
          />
          {state.fieldErrors?.title && (
            <span className="font-normal text-[#9b3c55]">{state.fieldErrors.title}</span>
          )}
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#43243a]">
          Your post
          <textarea
            name="body"
            required
            minLength={10}
            maxLength={3000}
            rows={6}
            placeholder="Share only what feels comfortable. Avoid including identifying details."
            className="resize-y rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] px-4 py-3 font-normal leading-7 outline-none transition focus:border-[#8c657b] focus:ring-2 focus:ring-[#d8a6b1]/30"
          />
          {state.fieldErrors?.body && (
            <span className="font-normal text-[#9b3c55]">{state.fieldErrors.body}</span>
          )}
        </label>
        <div className="flex flex-col gap-4 border-t border-[#43243a]/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-md text-xs leading-5 text-[#73666d]">
            Posts are reviewed before appearing publicly. Please don’t share names, addresses, or
            other identifying details.
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#43243a] px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60"
          >
            <Send className="size-4" />
            {pending ? 'Sending…' : 'Submit for review'}
          </button>
        </div>
        <FormMessage state={state} />
      </form>
    </div>
  )
}

function ReplyForm({ postID }: { postID: string }) {
  const [state, action, pending] = useActionState(createCommunityReply, initialCommunityActionState)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state.status === 'success') formRef.current?.reset()
  }, [state.status])

  return (
    <form ref={formRef} action={action} className="mt-5 rounded-2xl bg-[#f1ebed] p-4">
      <input type="hidden" name="post" value={postID} />
      <div className="hidden" aria-hidden="true">
        <label htmlFor={`reply-website-${postID}`}>Website</label>
        <input id={`reply-website-${postID}`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
        <input
          name="displayName"
          maxLength={40}
          placeholder="Anonymous member"
          aria-label="Display name"
          className="rounded-xl border border-[#43243a]/12 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8c657b]"
        />
        <textarea
          name="body"
          required
          minLength={2}
          maxLength={1500}
          rows={3}
          placeholder="Write a thoughtful reply…"
          aria-label="Your reply"
          className="resize-y rounded-xl border border-[#43243a]/12 bg-white px-3 py-2.5 text-sm leading-6 outline-none focus:border-[#8c657b]"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="text-xs text-[#73666d]">Replies are reviewed before they appear.</p>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-[#43243a] px-5 py-2.5 text-xs font-bold text-white disabled:opacity-60"
        >
          {pending ? 'Sending…' : 'Submit reply'}
        </button>
      </div>
      <FormMessage state={state} />
    </form>
  )
}

function PostCard({ post }: { post: ForumPost }) {
  return (
    <article className="rounded-[2rem] border border-[#43243a]/10 bg-white p-5 shadow-[0_14px_45px_rgba(67,36,58,.06)] md:p-7">
      <div className="flex items-start gap-4">
        <div className="grid size-11 shrink-0 place-items-center rounded-full bg-[#eae3ef] font-serif text-lg uppercase text-[#43243a]">
          {post.displayName.charAt(0) || 'A'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
            <span className="font-bold text-[#43243a]">{post.displayName}</span>
            <span className="text-[#8b7f85]">·</span>
            <time className="text-[#73666d]" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
          <span className="mt-2 inline-flex rounded-full bg-[#f1ebed] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-[#795568]">
            {topicLabel[post.category] ?? 'Community'}
          </span>
        </div>
      </div>

      <h2 className="mt-6 font-serif text-[clamp(1.7rem,3vw,2.25rem)] font-normal leading-tight text-[#43243a]">
        {post.title}
      </h2>
      <p className="mt-4 whitespace-pre-wrap leading-7 text-[#5f545a]">{post.body}</p>

      <details className="group mt-6 border-t border-[#43243a]/10 pt-5">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-[#43243a] [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <MessageCircle className="size-4" />
            {post.replies.length
              ? `${post.replies.length} ${post.replies.length === 1 ? 'reply' : 'replies'}`
              : 'Be the first to reply'}
          </span>
          <ChevronDown className="size-4 transition group-open:rotate-180" />
        </summary>

        <div className="mt-5 space-y-3">
          {post.replies.map((reply) => (
            <div
              key={reply.id}
              className="rounded-2xl border-l-4 border-[#d8a6b1] bg-[#faf7f2] p-4"
            >
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-bold text-[#43243a]">{reply.displayName}</span>
                <span className="text-[#8b7f85]">·</span>
                <time className="text-[#73666d]" dateTime={reply.createdAt}>
                  {formatDate(reply.createdAt)}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#5f545a]">
                {reply.body}
              </p>
            </div>
          ))}
          <ReplyForm postID={post.id} />
        </div>
      </details>
    </article>
  )
}

export function CommunityForum({ posts }: { posts: ForumPost[] }) {
  const [activeTopic, setActiveTopic] = useState('all')
  const [query, setQuery] = useState('')
  const [composing, setComposing] = useState(false)

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return posts.filter((post) => {
      const matchesTopic = activeTopic === 'all' || post.category === activeTopic
      const matchesQuery =
        !normalizedQuery ||
        post.title.toLowerCase().includes(normalizedQuery) ||
        post.body.toLowerCase().includes(normalizedQuery)
      return matchesTopic && matchesQuery
    })
  }, [activeTopic, posts, query])

  return (
    <section className="bg-[#f3edef] px-5 py-16 md:px-10 md:py-24 lg:px-16">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex flex-col gap-5 rounded-[2rem] bg-[#43243a] p-5 text-white md:flex-row md:items-center md:justify-between md:p-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5b8c3]">
              Community conversations
            </p>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Read, respond, or begin a new discussion. Every contribution is reviewed with care.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setComposing((current) => !current)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#faf7f2] px-6 py-3.5 text-sm font-bold text-[#43243a] transition hover:-translate-y-0.5"
          >
            <PenLine className="size-4" />
            {composing ? 'Close form' : 'Create a post'}
          </button>
        </div>

        {composing && <NewPostPanel onClose={() => setComposing(false)} />}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-6 rounded-[1.5rem] border border-[#43243a]/10 bg-white p-4">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#8c657b]" />
                <span className="sr-only">Search conversations</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search conversations"
                  className="w-full rounded-full border border-[#43243a]/12 bg-[#faf7f2] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#8c657b]"
                />
              </label>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Filter by topic">
                {topics.map((topic) => (
                  <button
                    key={topic.value}
                    type="button"
                    onClick={() => setActiveTopic(topic.value)}
                    aria-pressed={activeTopic === topic.value}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                      activeTopic === topic.value
                        ? 'bg-[#43243a] text-white'
                        : 'bg-[#f1ebed] text-[#674b5c] hover:bg-[#e7dce1]'
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}

              {!filteredPosts.length && (
                <div className="rounded-[2rem] border border-dashed border-[#43243a]/20 bg-[#faf7f2] px-6 py-16 text-center">
                  <MessageCircle className="mx-auto size-9 text-[#a77b90]" strokeWidth={1.4} />
                  <h2 className="mt-5 font-serif text-3xl text-[#43243a]">
                    {posts.length ? 'No conversations match yet.' : 'This space is ready for you.'}
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-[#675b62]">
                    {posts.length
                      ? 'Try another topic or search phrase.'
                      : 'There are no approved posts yet. Begin a thoughtful conversation when you feel ready.'}
                  </p>
                  {!posts.length && (
                    <button
                      type="button"
                      onClick={() => setComposing(true)}
                      className="mt-6 rounded-full bg-[#43243a] px-6 py-3 text-sm font-bold text-white"
                    >
                      Create the first post
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-5 lg:self-start">
            <div className="rounded-[2rem] bg-[#eae3ef] p-6">
              <ShieldCheck className="size-8 text-[#43243a]" strokeWidth={1.35} />
              <h2 className="mt-8 font-serif text-2xl text-[#43243a]">A moderated space</h2>
              <p className="mt-3 text-sm leading-6 text-[#62556a]">
                Posts and replies are reviewed before publication. Moderation supports safety; it is
                not emergency monitoring.
              </p>
            </div>
            <div className="rounded-[2rem] bg-white p-6">
              <h2 className="font-serif text-2xl text-[#43243a]">How we show up</h2>
              <ul className="mt-5 space-y-4 text-sm leading-6 text-[#62565d]">
                {[
                  'Respond with care, not judgement.',
                  'Protect your identity and the identity of others.',
                  'Share experience, not professional advice.',
                  'Do not post graphic or identifying details.',
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <CircleCheck className="mt-0.5 size-4 shrink-0 text-[#8c657b]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2rem] border border-[#43243a]/10 p-6 text-sm leading-6 text-[#62565d]">
              <p className="font-bold text-[#43243a]">Need immediate help?</p>
              <p className="mt-2">
                This forum is not an emergency service. If you are in immediate danger, contact your
                local emergency service.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
