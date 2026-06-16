import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ route: 'booking-api-working' });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: ['contact@harrisonministries.org'],
      subject: `New Booking Request - ${data.bookingType || 'Ministry Request'}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Booking Type:</strong> ${data.bookingType || ''}</p>
        <p><strong>Request Type:</strong> ${data.requestType || ''}</p>
        <p><strong>Name:</strong> ${data.fullName || ''}</p>
        <p><strong>Email:</strong> ${data.email || ''}</p>
        <p><strong>Phone:</strong> ${data.phone || ''}</p>
        <p><strong>Church:</strong> ${data.church || ''}</p>
        <p><strong>Event:</strong> ${data.eventName || ''}</p>
        <p><strong>Start Date:</strong> ${data.startDate || ''}</p>
        <p><strong>End Date:</strong> ${data.endDate || ''}</p>
        <p><strong>Details:</strong></p>
        <p>${data.eventDetails || ''}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Booking error:', error);

    return NextResponse.json(
      { error: 'Failed to send booking request' },
      { status: 500 }
    );
  }
}
