import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      supportType,
      preferredDate,
      preferredTime,
      contactName,
      contactEmail,
      meetingFormat,
      notes,
    } = body

    const bookingId = `book-${crypto.randomUUID()}`
    const date = new Date().toISOString()

    db.prepare(`
      INSERT INTO bookings (
        id, supportType, date, preferredDate, preferredTime,
        contactName, contactEmail, meetingFormat, notes, status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).run(
      bookingId,
      supportType || 'General consultation',
      date,
      preferredDate || '',
      preferredTime || '',
      contactName || 'Anonymous',
      contactEmail || '',
      meetingFormat || 'Online Video Call',
      notes || ''
    )

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        supportType: supportType || 'General consultation',
        date,
        preferredDate,
        preferredTime,
        contactName,
        contactEmail,
        meetingFormat,
        notes,
        status: 'pending',
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
