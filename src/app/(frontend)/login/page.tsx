import type { Metadata } from 'next'
import Link from 'next/link'
import { getCurrentUser } from '@/lib/auth'
import { logoutAction } from './actions'
import { PageHero, SaharaFrame } from '@/components/SaharaShell'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | SAHARA',
  description: 'Sign in to access your SAHARA community profile and appointments.',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string }>
}) {
  const { redirect: redirectPath } = await searchParams
  const user = await getCurrentUser()

  return (
    <SaharaFrame>
      <PageHero
        eyebrow="Account Access"
        heading={user ? `Signed in as ${user.name}` : 'Welcome to your safe space.'}
        lead={
          user
            ? `You are currently signed in with ${user.email} (${user.role || 'member'}). You can continue to the community or sign in with a different account below.`
            : redirectPath
              ? 'Please sign in or create an account to access community conversations, appointments, and support.'
              : 'Sign in to post discussions, reply with care, and manage your support appointments.'
        }
      />

      <section className="bg-[#faf7f2] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-md">
          {user && (
            <div className="mb-6 rounded-2xl bg-[#eae3ef] border border-[#43243a]/15 p-5 text-center text-[#43243a]">
              <p className="text-sm font-semibold">Active Session: {user.name} ({user.email})</p>
              <div className="mt-3 flex items-center justify-center gap-3">
                <Link
                  href="/community"
                  className="rounded-full bg-[#43243a] px-4 py-2 text-xs font-bold text-white hover:opacity-90"
                >
                  Go to Community
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-full border border-[#43243a]/30 px-4 py-2 text-xs font-bold text-[#43243a] hover:bg-[#43243a]/10"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            </div>
          )}

          {redirectPath && !user && (
            <div className="mb-6 rounded-2xl bg-[#eae3ef] border border-[#43243a]/15 p-4 text-center text-sm font-medium text-[#43243a]">
              🔒 Sign in required to view that page.
            </div>
          )}
          <LoginForm redirectPath={redirectPath} />
        </div>
      </section>
    </SaharaFrame>
  )
}
