import type { Metadata } from 'next'
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

  return (
    <SaharaFrame>
      <PageHero
        eyebrow="Account Access"
        heading="Welcome to your safe space."
        lead={
          redirectPath
            ? 'Please sign in or create an account to access community conversations, appointments, and support.'
            : 'Sign in to post discussions, reply with care, and manage your support appointments.'
        }
      />

      <section className="bg-[#faf7f2] px-5 py-16 md:px-10 md:py-24 lg:px-16">
        <div className="mx-auto max-w-md">
          {redirectPath && (
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
