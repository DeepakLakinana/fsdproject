'use client'

import { useActionState, useState } from 'react'
import { loginAction, registerAction, type AuthState } from './actions'
import { Lock, Mail, User, ArrowRight, Sparkles } from 'lucide-react'

export function LoginForm({ redirectPath }: { redirectPath?: string }) {
  const [isRegister, setIsRegister] = useState(false)
  const [loginState, runLogin, loginPending] = useActionState(loginAction, {} as AuthState)
  const [regState, runRegister, regPending] = useActionState(registerAction, {} as AuthState)

  const activeError = isRegister ? regState?.error : loginState?.error
  const isPending = isRegister ? regPending : loginPending

  return (
    <div className="rounded-[2.5rem] border border-[#43243a]/15 bg-white p-8 shadow-xl md:p-10">
      <div className="mb-8 flex items-center justify-between border-b border-[#43243a]/10 pb-5">
        <button
          type="button"
          onClick={() => setIsRegister(false)}
          className={`font-serif text-2xl font-normal transition ${
            !isRegister ? 'text-[#43243a] underline underline-offset-8' : 'text-[#8c657b] opacity-60 hover:opacity-100'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setIsRegister(true)}
          className={`font-serif text-2xl font-normal transition ${
            isRegister ? 'text-[#43243a] underline underline-offset-8' : 'text-[#8c657b] opacity-60 hover:opacity-100'
          }`}
        >
          Create Account
        </button>
      </div>

      {activeError && (
        <div className="mb-6 rounded-2xl bg-[#fee2e2] p-4 text-sm text-[#991b1b]" role="alert">
          {activeError}
        </div>
      )}

      <form action={isRegister ? runRegister : runLogin} className="space-y-5">
        <input type="hidden" name="redirect" value={redirectPath || '/community'} />

        {isRegister && (
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8c657b]" htmlFor="name">
              Your Name or Pseudonym
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
              <input
                id="name"
                name="name"
                type="text"
                required={isRegister}
                placeholder="e.g. Maya R."
                className="w-full rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] py-3.5 pl-12 pr-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/60 focus:border-[#43243a] focus:outline-none"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8c657b]" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] py-3.5 pl-12 pr-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/60 focus:border-[#43243a] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8c657b]" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              minLength={6}
              className="w-full rounded-2xl border border-[#43243a]/15 bg-[#faf7f2] py-3.5 pl-12 pr-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/60 focus:border-[#43243a] focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#43243a] py-4 text-sm font-bold text-white transition hover:bg-[#5b344e] disabled:opacity-50"
        >
          {isPending ? 'Please wait...' : isRegister ? 'Register Account' : 'Sign In'}
          <ArrowRight className="size-4" />
        </button>
      </form>

      <p className="mt-8 text-center text-xs leading-5 text-[#8c657b]">
        <Sparkles className="inline-block mr-1 size-3.5 text-[#d8a6b1]" />
        Your privacy and information remain strictly confidential.
      </p>
    </div>
  )
}
