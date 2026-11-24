import Link from 'next/link'
import { Menu, LogOut, User } from 'lucide-react'
import { getCurrentUser } from '@/lib/auth'
import { logoutAction } from '@/app/(frontend)/login/actions'

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Find Support', href: '/support' },
  { label: 'Community', href: '/community' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
]

export async function SiteHeader() {
  const user = await getCurrentUser()

  return (
    <header className="absolute inset-x-0 top-0 z-40 text-white">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-5 md:px-10 lg:px-16">
        <Link href="/" className="group flex items-center gap-3" aria-label="SAHARA home">
          <span className="grid size-10 place-items-center rounded-full border border-white/45 font-serif text-xl italic transition group-hover:bg-white group-hover:text-[#43243a]">
            S
          </span>
          <span>
            <b className="block font-serif text-xl tracking-[0.13em]">SAHARA</b>
            <small className="hidden text-[9px] uppercase tracking-[0.18em] text-white/70 sm:block">
              Your safety. Your voice. Your space.
            </small>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-white/80 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}

          {user ? (
            <div className="flex items-center gap-4">
              {['admin', 'counsellor', 'community_worker'].includes(user.role || '') && (
                <Link
                  href="/admin"
                  className="rounded-full bg-[#d8a6b1]/20 border border-[#d8a6b1]/50 px-3 py-1 text-xs font-bold text-[#f4d2db] hover:bg-[#d8a6b1]/30 transition"
                >
                  {user.role === 'admin' ? 'Admin Portal' : 'Staff Workstation'}
                </Link>
              )}
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#d8a6b1]">
                <User className="size-4" />
                {user.name}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-full border border-white/30 px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-white/10"
                >
                  <LogOut className="size-3.5" />
                  Log Out
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-white/40 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Sign In
            </Link>
          )}

          <Link
            href="/support#appointments"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#43243a] transition hover:-translate-y-0.5"
          >
            Book a conversation
          </Link>
        </nav>

        <details className="group relative lg:hidden">
          <summary className="grid size-11 cursor-pointer list-none place-items-center rounded-full border border-white/30 [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden="true" className="size-5" />
            <span className="sr-only">Open navigation</span>
          </summary>
          <nav
            className="absolute right-0 top-14 w-64 overflow-hidden rounded-3xl bg-[#faf7f2] p-3 text-[#43243a] shadow-2xl"
            aria-label="Mobile navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-[#eae3ef]"
              >
                {item.label}
              </Link>
            ))}

            <div className="mt-2 border-t border-[#43243a]/10 pt-2">
              {user ? (
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-[#991b1b] transition hover:bg-[#fee2e2]"
                  >
                    <LogOut className="size-4" />
                    Log Out ({user.name})
                  </button>
                </form>
              ) : (
                <Link
                  href="/login"
                  className="block rounded-2xl px-4 py-3 text-sm font-semibold text-[#43243a] transition hover:bg-[#eae3ef]"
                >
                  Sign In
                </Link>
              )}
            </div>
          </nav>
        </details>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="bg-[#2d1928] px-5 py-12 text-white md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-serif text-3xl tracking-[0.12em]">SAHARA</p>
          <p className="mt-2 text-sm text-white/60">Your safety. Your voice. Your space.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-white/65">
          <Link href="/support" className="hover:text-white">
            Find support
          </Link>
          <Link href="/community" className="hover:text-white">
            Community
          </Link>
          <Link href="/resources" className="hover:text-white">
            Resources
          </Link>
          <Link href="/about" className="hover:text-white">
            About
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-[1320px] flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
        <span>Community support designed with care.</span>
        <span>If you are in immediate danger, contact your local emergency service.</span>
      </div>
    </footer>
  )
}

export function PageHero({
  eyebrow,
  heading,
  lead,
}: {
  eyebrow: string
  heading: string
  lead: string
}) {
  return (
    <section className="relative overflow-hidden bg-[#43243a] px-5 pb-20 pt-36 text-white md:px-10 lg:px-16 lg:pt-40">
      <div className="mx-auto max-w-[1320px]">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-[#d8a6b1]">
          {eyebrow}
        </p>
        <h1 className="max-w-4xl font-serif text-[clamp(2.5rem,5vw,5rem)] font-normal leading-[1] tracking-[-0.035em]">
          {heading}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 md:text-lg">{lead}</p>
      </div>
    </section>
  )
}

export function SaharaFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#43243a]">
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </div>
  )
}
