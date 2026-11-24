'use client'

import { useState } from 'react'
import {
  CalendarDays,
  Clock,
  User,
  Mail,
  Video,
  ShieldCheck,
  X,
  Sparkles,
  Phone,
  Check,
} from 'lucide-react'

const supportOptions = ['Counselling support', 'Community support worker', 'General consultation']

const timeSlots = [
  '09:00 AM - 10:00 AM',
  '11:00 AM - 12:00 PM',
  '02:00 PM - 03:00 PM',
  '04:00 PM - 05:00 PM',
  '06:00 PM - 07:00 PM',
]

const meetingFormats = [
  { id: 'Video Call', label: 'Online Video Call', desc: 'Secure, encrypted private link' },
  { id: 'Phone Call', label: 'Phone Call', desc: 'Direct confidential telephone call' },
  { id: 'In-Person', label: 'In-Person Community Centre', desc: 'Private consultation room' },
]

export function BookingFlow({
  label = 'Begin booking',
  initialSupportType,
}: {
  label?: string
  initialSupportType?: string
}) {
  const [open, setOpen] = useState(false)
  // Step 0: Choose support (only if initialSupportType is not provided)
  // Step 1: Date, Time & Format
  // Step 2: Contact Details & Notes
  // Step 3: Review & Confirmation
  const hasInitialType = Boolean(initialSupportType)
  const totalSteps = hasInitialType ? 3 : 4
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  const [supportType, setSupportType] = useState(initialSupportType || 'Counselling support')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState(timeSlots[0])
  const [meetingFormat, setMeetingFormat] = useState('Video Call')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const openModal = () => {
    setSupportType(initialSupportType || 'Counselling support')
    setCurrentStepIndex(0)
    setConfirmed(false)
    // Default to tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setPreferredDate(tomorrow.toISOString().split('T')[0])
    setOpen(true)
  }

  const close = () => {
    setOpen(false)
    setCurrentStepIndex(0)
  }

  const handleBookingConfirm = async () => {
    setSubmitting(true)
    try {
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supportType,
          preferredDate,
          preferredTime,
          contactName: contactName.trim() || 'Anonymous',
          contactEmail: contactEmail.trim(),
          meetingFormat,
          notes: notes.trim(),
        }),
      })
      setConfirmed(true)
    } catch (e) {
      console.error('Failed to submit booking', e)
    } finally {
      setSubmitting(false)
    }
  }

  // Calculate human step labels
  // If preselected: Step 1 = Date & Time, Step 2 = Details, Step 3 = Review
  // If general: Step 1 = Pathway, Step 2 = Date & Time, Step 3 = Details, Step 4 = Review
  const activeStepNumber = currentStepIndex + 1
  const isLastStep = activeStepNumber === totalSteps

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center justify-center rounded-full bg-[#43243a] px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#5b344e]"
      >
        {label}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-[#291925]/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-title"
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-auto rounded-[2.5rem] bg-[#faf7f2] p-7 shadow-2xl md:p-10">
            {/* Header */}
            <div className="mb-6 flex items-start justify-between gap-6 border-b border-[#43243a]/10 pb-5">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#8c657b]">
                  {hasInitialType ? `Selected Pathway: ${supportType}` : 'Booking an Appointment'}
                </p>
                <h2 id="booking-title" className="font-serif text-3xl leading-tight text-[#43243a]">
                  {confirmed
                    ? 'Appointment Request Received'
                    : hasInitialType
                    ? currentStepIndex === 0
                      ? 'Choose Date & Time'
                      : currentStepIndex === 1
                      ? 'Your Contact Details'
                      : 'Review & Submit'
                    : currentStepIndex === 0
                    ? 'Select Support Type'
                    : currentStepIndex === 1
                    ? 'Choose Date & Time'
                    : currentStepIndex === 2
                    ? 'Your Contact Details'
                    : 'Review & Submit'}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full border border-[#43243a]/20 p-2 text-[#43243a] transition hover:bg-white"
                aria-label="Close booking"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            {!confirmed && (
              <div className="mb-8">
                <div className="flex gap-2">
                  {Array.from({ length: totalSteps }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                        idx <= currentStepIndex ? 'bg-[#43243a]' : 'bg-[#e5dbe1]'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-2 flex justify-between text-xs font-bold text-[#8c657b]">
                  <span>Step {activeStepNumber} of {totalSteps}</span>
                  <span>{Math.round((activeStepNumber / totalSteps) * 100)}% Complete</span>
                </div>
              </div>
            )}

            {/* Confirmation View */}
            {confirmed ? (
              <div className="rounded-3xl bg-[#e6eee7] p-7 text-center">
                <ShieldCheck className="mx-auto mb-4 size-14 text-[#2d5a35]" />
                <h3 className="font-serif text-2xl font-bold text-[#43243a]">Booking Request Sent!</h3>
                <p className="mt-3 text-sm leading-6 text-[#5b5057]">
                  Your appointment for <strong>{supportType}</strong> on <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong> via <strong>{meetingFormat}</strong> has been assigned to our staff queue.
                </p>
                <p className="mt-2 text-xs text-[#8c657b]">
                  A assigned counsellor or support worker will review and confirm this slot with you.
                </p>
                <button
                  type="button"
                  onClick={close}
                  className="mt-6 rounded-full bg-[#43243a] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#5b344e]"
                >
                  Return to SAHARA
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Step: Select Pathway (Only if not preselected) */}
                {!hasInitialType && currentStepIndex === 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                      What kind of support are you seeking?
                    </label>
                    {supportOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSupportType(opt)}
                        className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                          supportType === opt
                            ? 'border-[#43243a] bg-white shadow-sm'
                            : 'border-[#43243a]/15 hover:border-[#43243a]/40'
                        }`}
                      >
                        <span className="text-sm font-semibold text-[#43243a]">{opt}</span>
                        {supportType === opt && <Check className="size-5 text-[#43243a]" />}
                      </button>
                    ))}
                  </div>
                )}

                {/* Step: Date, Time & Format */}
                {((hasInitialType && currentStepIndex === 0) || (!hasInitialType && currentStepIndex === 1)) && (
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Preferred Appointment Date
                      </label>
                      <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full rounded-2xl border border-[#43243a]/20 bg-white py-3 pl-12 pr-4 text-sm text-[#43243a] focus:border-[#43243a] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setPreferredTime(slot)}
                            className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-medium transition ${
                              preferredTime === slot
                                ? 'border-[#43243a] bg-[#43243a] text-white'
                                : 'border-[#43243a]/15 bg-white text-[#43243a] hover:bg-[#faf7f2]'
                            }`}
                          >
                            <Clock className="size-4" />
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Meeting Format
                      </label>
                      <div className="space-y-2">
                        {meetingFormats.map((fmt) => (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setMeetingFormat(fmt.id)}
                            className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                              meetingFormat === fmt.id
                                ? 'border-[#43243a] bg-white ring-1 ring-[#43243a]'
                                : 'border-[#43243a]/15 bg-white/70 hover:bg-white'
                            }`}
                          >
                            <div>
                              <p className="text-sm font-semibold text-[#43243a]">{fmt.label}</p>
                              <p className="text-xs text-[#8c657b]">{fmt.desc}</p>
                            </div>
                            {meetingFormat === fmt.id && <Check className="size-5 text-[#43243a]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Step: Contact Info & Optional Notes */}
                {((hasInitialType && currentStepIndex === 1) || (!hasInitialType && currentStepIndex === 2)) && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Your Name / Preferred Alias
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
                        <input
                          type="text"
                          placeholder="e.g. Maya R. (or anonymous)"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full rounded-2xl border border-[#43243a]/20 bg-white py-3 pl-12 pr-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/50 focus:border-[#43243a] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Contact Email or Phone (For confirmation)
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#8c657b]" />
                        <input
                          type="text"
                          required
                          placeholder="you@example.com or phone"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full rounded-2xl border border-[#43243a]/20 bg-white py-3 pl-12 pr-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/50 focus:border-[#43243a] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#8c657b]">
                        Anything you would like us to know in advance? (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Topics you'd like to discuss, accessibility needs, or safe contact preferences..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full rounded-2xl border border-[#43243a]/20 bg-white p-4 text-sm text-[#43243a] placeholder:text-[#8c657b]/50 focus:border-[#43243a] focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Step: Review and Confirm */}
                {isLastStep && (
                  <div className="rounded-3xl border border-[#43243a]/15 bg-white p-6 space-y-4">
                    <h4 className="font-serif text-xl font-bold text-[#43243a]">Summary of Your Booking</h4>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="rounded-2xl bg-[#faf7f2] p-3">
                        <span className="text-[#8c657b] uppercase block font-semibold mb-1">Pathway</span>
                        <span className="font-bold text-[#43243a] text-sm">{supportType}</span>
                      </div>
                      <div className="rounded-2xl bg-[#faf7f2] p-3">
                        <span className="text-[#8c657b] uppercase block font-semibold mb-1">Date</span>
                        <span className="font-bold text-[#43243a] text-sm">{preferredDate || 'Tomorrow'}</span>
                      </div>
                      <div className="rounded-2xl bg-[#faf7f2] p-3">
                        <span className="text-[#8c657b] uppercase block font-semibold mb-1">Time</span>
                        <span className="font-bold text-[#43243a] text-sm">{preferredTime}</span>
                      </div>
                      <div className="rounded-2xl bg-[#faf7f2] p-3">
                        <span className="text-[#8c657b] uppercase block font-semibold mb-1">Format</span>
                        <span className="font-bold text-[#43243a] text-sm">{meetingFormat}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#faf7f2] p-3 text-xs">
                      <span className="text-[#8c657b] uppercase block font-semibold mb-1">Client Details</span>
                      <span className="font-medium text-[#43243a]">
                        {contactName || 'Anonymous'} · {contactEmail || 'No email provided'}
                      </span>
                      {notes && <p className="mt-2 text-[#5b5057] italic">"{notes}"</p>}
                    </div>

                    <p className="text-xs text-[#8c657b]">
                      🛡️ All consultations are strictly confidential and adhere to professional safety guidelines.
                    </p>
                  </div>
                )}

                {/* Footer Controls */}
                <div className="mt-8 flex items-center justify-between border-t border-[#43243a]/10 pt-5">
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
                    className={`text-sm font-semibold underline underline-offset-4 text-[#43243a] ${
                      currentStepIndex === 0 ? 'invisible' : ''
                    }`}
                  >
                    Back
                  </button>

                  {isLastStep ? (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleBookingConfirm}
                      className="rounded-full bg-[#43243a] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#5b344e] disabled:opacity-50"
                    >
                      {submitting ? 'Confirming...' : 'Confirm Appointment'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
                      className="rounded-full bg-[#43243a] px-8 py-3.5 text-sm font-bold text-white transition hover:bg-[#5b344e]"
                    >
                      Continue
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
