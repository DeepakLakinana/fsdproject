import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  BookOpen,
  HeartHandshake,
  Leaf,
  MessageCircleHeart,
  ShieldCheck,
  Sparkles,
  ExternalLink,
  PhoneCall,
  ShieldAlert,
  Compass,
  FileText,
} from 'lucide-react'
import artwork from '@/assets/sahara-artwork.png'
import { BookingFlow } from '@/components/BookingFlow'
import { PageHero, SaharaFrame } from '@/components/SaharaShell'

const supportPaths = [
  {
    index: '01',
    title: 'Talk to someone',
    copy: 'Take the first step toward a conversation with a counsellor or community support worker.',
    action: 'Start an appointment',
    href: '/support#appointments',
    tone: 'bg-[#eadbe2]',
    icon: MessageCircleHeart,
  },
  {
    index: '02',
    title: 'Find your community',
    copy: 'Join moderated conversations, share experiences, and reply with care.',
    action: 'Enter the community',
    href: '/community',
    tone: 'bg-[#eae3ef]',
    icon: HeartHandshake,
  },
  {
    index: '03',
    title: 'Find practical help',
    copy: 'Browse safety information, useful resources, and clear support pathways.',
    action: 'Browse practical help',
    href: '/resources',
    tone: 'bg-[#eee8db]',
    icon: Leaf,
  },
]

const resources = [
  {
    title: 'Tele-MANAS (Govt. of India 24/7 Mental Health)',
    category: 'National Mental Health Helpline',
    icon: PhoneCall,
    color: 'bg-[#d9b2bb]',
    description:
      'Toll-free 24/7 tele-mental health service initiated by the Ministry of Health & Family Welfare (NIMHANS). Dial 14416 or 1800-891-4416 for free, multi-lingual psychological counseling.',
    actionLabel: 'Tele-MANAS Portal',
    href: 'https://telemanas.mohfw.gov.in/',
    badge: 'Toll-Free 14416',
  },
  {
    title: 'National Commission for Women (NCW)',
    category: 'Safety & Legal Assistance',
    icon: ShieldCheck,
    color: 'bg-[#dad0e3]',
    description:
      'Dedicated 24/7 women helpline (7827170170) and online complaint registration for domestic violence, harassment, workplace discrimination, and legal aid across all Indian states.',
    actionLabel: 'NCW Official Website',
    href: 'http://ncw.nic.in/',
    badge: 'Helpline: 7827170170',
  },
  {
    title: 'Vandrevala Foundation Helpline',
    category: 'Emotional & Crisis Support',
    icon: HeartHandshake,
    color: 'bg-[#e8d9c5]',
    description:
      'Free 24/7 counseling via phone (+91 9999 666 555) and WhatsApp chat. Experienced Indian clinical psychologists providing compassionate crisis intervention and depression care.',
    actionLabel: 'Chat via WhatsApp / Call',
    href: 'https://www.vandrevalafoundation.com/',
    badge: '+91 9999 666 555',
  },
  {
    title: 'KIRAN National Mental Health Helpline',
    category: 'Psychological First Aid',
    icon: MessageCircleHeart,
    color: 'bg-[#c9d4ca]',
    description:
      '24/7 helpline by the Department of Empowerment of Persons with Disabilities (DEPwD). Call 1800-599-0019 for early screening, psychological first aid, and distress management in 13 languages.',
    actionLabel: 'KIRAN Guidelines',
    href: 'https://pib.gov.in/PressReleasePage.aspx?PRID=1652033',
    badge: '1800-599-0019',
  },
  {
    title: 'iCall Psychosocial Helpline (TISS Mumbai)',
    category: 'Professional Counselling',
    icon: Compass,
    color: 'bg-[#e0c9cc]',
    description:
      'Run by the School of Human Ecology at Tata Institute of Social Sciences. Free, non-judgmental counseling for emotional distress, relationship issues, and mental health via phone (9152987821) and email.',
    actionLabel: 'iCall TISS Portal',
    href: 'https://icallhelpline.org/',
    badge: 'Monday–Saturday',
  },
  {
    title: 'Sneha India Suicide Prevention Helpline',
    category: 'Crisis Intervention',
    icon: Leaf,
    color: 'bg-[#eadbe2]',
    description:
      'One of India’s most trusted volunteer-run crisis lines based in Chennai. Call 044-24640050 (available 24/7) for unconditional emotional support during acute loneliness or suicidal distress.',
    actionLabel: 'Sneha India Helpline',
    href: 'https://snehaindia.org/',
    badge: '044-24640050',
  },
]

function SupportCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {supportPaths.map(({ index, title, copy, action, href, tone, icon: Icon }) => (
        <Link
          key={title}
          href={href}
          className={`${tone} group flex min-h-[470px] flex-col rounded-[2.5rem] p-5 transition duration-300 hover:-translate-y-2 hover:shadow-[0_24px_70px_rgba(67,36,58,.14)]`}
        >
          <div className="relative grid h-44 place-items-center overflow-hidden rounded-[5rem_3rem_2rem_3rem] bg-white/35">
            <div className="absolute -right-8 -top-8 size-32 rounded-full border-[20px] border-[#43243a]/10" />
            <div className="grid size-24 place-items-center rounded-full bg-[#faf7f2] shadow-sm">
              <Icon className="size-10 text-[#43243a]" strokeWidth={1.25} />
            </div>
          </div>
          <div className="flex flex-1 flex-col px-3 pb-3 pt-8">
            <span className="mb-5 text-xs font-bold tracking-[0.18em] text-[#8c657b]">{index}</span>
            <h3 className="font-serif text-4xl font-normal leading-none text-[#43243a]">{title}</h3>
            <p className="mt-4 leading-7 text-[#5c5057]">{copy}</p>
            <span className="mt-auto flex items-center justify-between border-t border-[#43243a]/15 pt-5 text-sm font-bold text-[#43243a]">
              {action}
              <span className="grid size-10 place-items-center rounded-full bg-[#43243a] text-white transition group-hover:translate-x-1">
                <ArrowRight className="size-4" />
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  )
}

function ClosingSection() {
  return (
    <section className="relative overflow-hidden bg-[#d8a6b1] px-5 py-28 md:px-10 md:py-40 lg:px-16">
      <div className="absolute -right-20 -top-12 size-72 rounded-[40%_60%_55%_45%] bg-[#eae3ef]/70" />
      <div className="absolute -bottom-28 left-[8%] size-80 rounded-full border-[45px] border-[#43243a]/10" />
      <div className="relative z-10 mx-auto max-w-[1100px] text-center">
        <p className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[#684358]">
          Your safety. Your voice. Your space.
        </p>
        <h2 className="font-serif text-[clamp(4rem,9vw,9rem)] font-normal leading-[0.86] tracking-[-0.055em] text-[#43243a]">
          Your voice
          <br />
          <em className="font-normal">matters here.</em>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-lg leading-8 text-[#56394a]">
          Start with one small step. Find the support that feels right for you.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/support"
            className="rounded-full bg-[#43243a] px-8 py-4 font-bold text-white transition hover:-translate-y-1"
          >
            Find Support
          </Link>
          <Link
            href="/resources"
            className="rounded-full border border-[#43243a]/30 px-8 py-4 font-bold text-[#43243a] transition hover:bg-white/30"
          >
            Explore Resources
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HomeContent() {
  return (
    <SaharaFrame>
      <section className="relative min-h-[850px] overflow-hidden bg-[#43243a] text-white">
        <div className="absolute inset-0">
          <Image
            src={artwork}
            alt="Layered artwork of women representing safety and solidarity"
            fill
            priority
            sizes="100vw"
            className="origin-bottom scale-[4] object-cover object-bottom opacity-45"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(43,20,38,.98)_0%,rgba(67,36,58,.86)_48%,rgba(35,20,49,.7)_100%)]" />
        </div>
        <div className="absolute -right-24 top-36 h-72 w-80 rounded-[45%_55%_61%_39%] border border-[#d8a6b1]/30 bg-[#d8a6b1]/10" />
        <div className="relative z-10 mx-auto flex min-h-[850px] max-w-[1440px] items-end px-5 pb-20 pt-36 md:px-10 lg:items-center lg:px-16 lg:pb-0">
          <div className="max-w-[44rem]">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#e6c0ca]">
              <span className="h-px w-10 bg-[#e6c0ca]" /> A community that listens
            </p>
            <h1 className="text-balance font-serif text-[clamp(3.1rem,6.5vw,6.8rem)] font-normal leading-[0.92] tracking-[-0.04em]">
              Some days, you just need a space that{' '}
              <em className="font-normal text-[#e9c8d0]">understands.</em>
            </h1>
            <p className="mt-8 max-w-lg text-lg leading-8 text-white/80">
              Find support, share your voice, and connect with a community that listens.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/support"
                className="group flex items-center justify-center gap-3 rounded-full bg-[#faf7f2] px-7 py-4 font-bold text-[#43243a] transition hover:-translate-y-1"
              >
                Find Support <ArrowRight className="size-4 transition group-hover:translate-x-1" />
              </Link>
              <Link
                href="/community"
                className="flex items-center justify-center rounded-full border border-white/35 px-7 py-4 font-bold transition hover:bg-white/10"
              >
                Explore the Community
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 border-b border-[#43243a]/15 pb-12 md:grid-cols-[.7fr_1.3fr] md:items-end">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c657b]">
              What do you need today?
            </p>
            <h2 className="font-serif text-[clamp(2.6rem,5vw,5rem)] font-normal leading-[0.98] tracking-[-0.035em] text-[#43243a]">
              Start wherever feels most comfortable.
            </h2>
          </div>
          <div className="mt-10">
            <SupportCards />
          </div>
        </div>
      </section>
      <ClosingSection />
    </SaharaFrame>
  )
}

export function SupportContent() {
  return (
    <SaharaFrame>
      <PageHero
        eyebrow="Find support"
        title="Support that begins with listening."
        copy="Choose the kind of support that feels right for you, then take one clear step at a time."
      />
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <SupportCards />
          <div id="appointments" className="scroll-mt-8 pt-28">
            <div className="grid gap-8 lg:grid-cols-[1fr_.65fr]">
              <div>
                <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#8c657b]">
                  Appointments that feel human
                </p>
                <h2 className="max-w-4xl font-serif text-[clamp(3rem,5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[#43243a]">
                  When you’re ready, someone is here to listen.
                </h2>
              </div>
              <p className="self-end text-lg leading-8 text-[#675b62]">
                Choose the kind of support you need. Professional profiles and times appear only
                when verified service availability is connected.
              </p>
            </div>
            <div className="mt-14 grid gap-5 lg:grid-cols-2">
              {[
                {
                  role: 'Counselling support',
                  areas: 'Emotional wellbeing · difficult experiences · making sense of next steps',
                  intro: 'A confidential conversation focused on what you need, at your pace.',
                  color: 'bg-[#eae3ef]',
                  Icon: MessageCircleHeart,
                },
                {
                  role: 'Community support worker',
                  areas: 'Practical guidance · safety planning · finding relevant services',
                  intro:
                    'Grounded help to understand options and connect with useful local support.',
                  color: 'bg-[#ead5da]',
                  Icon: HeartHandshake,
                },
              ].map(({ role, areas, intro, color, Icon }) => (
                <article
                  key={role}
                  className="grid overflow-hidden rounded-[2.5rem] border border-[#43243a]/10 bg-white md:grid-cols-[.4fr_.6fr]"
                >
                  <div className={`${color} flex min-h-52 items-center justify-center`}>
                    <div className="relative grid size-36 place-items-center rounded-full border border-[#43243a]/20">
                      <div className="grid size-24 place-items-center rounded-full bg-[#faf7f2]">
                        <Icon className="size-10 text-[#43243a]" strokeWidth={1.25} />
                      </div>
                      <Sparkles className="absolute -right-2 top-3 size-7 text-[#8c657b]" />
                    </div>
                  </div>
                  <div className="flex flex-col p-7 md:p-9">
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#8c657b]">
                      Support pathway
                    </p>
                    <h3 className="font-serif text-3xl font-normal text-[#43243a]">{role}</h3>
                    <p className="mt-4 text-sm font-bold leading-6 text-[#43243a]">{areas}</p>
                    <p className="mt-3 leading-7 text-[#675b62]">{intro}</p>
                    <div className="mt-8 border-t border-[#43243a]/15 pt-5">
                      <BookingFlow initialSupportType={role} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SaharaFrame>
  )
}

export function ResourcesContent() {
  return (
    <SaharaFrame>
      <PageHero
        eyebrow="Resources & Practical Help (India)"
        heading="Verified Indian helplines, support networks, and legal aid."
        lead="Direct access to verified national tele-mental health initiatives, the National Commission for Women (NCW), 24/7 crisis hotlines, and counseling services across India."
      />

      {/* Emergency Crisis Hotline Banner (India) */}
      <section className="bg-[#43243a] px-5 py-8 text-white md:px-10 lg:px-16 border-b border-white/10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="grid size-12 place-items-center rounded-2xl bg-[#fee2e2] text-[#991b1b]">
              <PhoneCall className="size-6" />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-[#d8a6b1]">
                Need immediate help in India?
              </span>
              <p className="font-serif text-xl font-bold">24/7 National Emergency Helplines</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-[#d8a6b1] block text-[10px] uppercase">Women in Distress (Govt. of India)</span>
              <span className="text-white text-sm">Dial 1091 / 112 (National Emergency)</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-[#d8a6b1] block text-[10px] uppercase">Tele-MANAS (NIMHANS, 24/7)</span>
              <span className="text-white text-sm">14416 / 1800-891-4416 (Toll-Free)</span>
            </div>
            <div className="rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-[#d8a6b1] block text-[10px] uppercase">Vandrevala Mental Health</span>
              <span className="text-white text-sm">+91 9999 666 555 (Call & WhatsApp)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Resources Cards Grid */}
      <section className="bg-[#f1ebed] px-5 py-20 md:px-10 md:py-28 lg:px-16">
        <div className="mx-auto max-w-[1320px]">
          <div className="mb-12">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#8c657b]">
              Curated External Guides & Tools
            </p>
            <h2 className="max-w-4xl font-serif text-[clamp(2.5rem,4.5vw,4.5rem)] font-normal leading-[1] tracking-[-0.035em] text-[#43243a]">
              Direct support for every step of your journey.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((item, index) => {
              const Icon = item.icon
              return (
                <div
                  id={`resource-${index + 1}`}
                  key={item.title}
                  className="flex flex-col justify-between rounded-[2.5rem] bg-[#faf7f2] p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl border border-[#43243a]/10"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`grid size-16 place-items-center rounded-2xl ${item.color}`}>
                        <Icon className="size-8 text-[#43243a]" strokeWidth={1.3} />
                      </div>
                      <span className="rounded-full bg-white border border-[#43243a]/15 px-3 py-1 text-[11px] font-bold text-[#8c657b] uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8c657b]">
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-serif text-2xl font-normal leading-snug text-[#43243a]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-xs leading-6 text-[#5c5057]">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#43243a]/10 pt-5">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-[#43243a] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-[#5b344e] hover:gap-3"
                    >
                      {item.actionLabel}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </SaharaFrame>
  )
}

export function AboutContent() {
  return (
    <SaharaFrame>
      <PageHero
        eyebrow="About SAHARA"
        title="Built around safety, dignity, and voice."
        copy="SAHARA is a women’s community support platform designed to make finding help feel clearer and more human."
      />
      <section className="px-5 py-24 md:px-10 md:py-32 lg:px-16">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
          <div className="relative h-[520px] overflow-hidden rounded-[10rem_3rem_8rem_3rem] bg-[#43243a]">
            <Image
              src={artwork}
              alt="Cropped artwork of women standing together"
              fill
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="origin-bottom scale-[4] object-cover object-bottom opacity-75"
            />
            <div className="absolute inset-0 bg-[#43243a]/25" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#8c657b]">
              A more human way to find support
            </p>
            <h2 className="mt-5 font-serif text-[clamp(3rem,5vw,5.5rem)] font-normal leading-[0.95] tracking-[-0.04em] text-[#43243a]">
              No pressure. No marketplace. Just clearer next steps.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[#675b62]">
              The platform brings supportive conversations, practical resources, and appointment
              pathways into one calm space. Community contributions are reviewed before they appear
              publicly so care comes before reach.
            </p>
          </div>
        </div>
      </section>
      <ClosingSection />
    </SaharaFrame>
  )
}
