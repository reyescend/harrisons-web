import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ route: 'booking-api-working' });
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const budget = data.budget ?? data.eventBudget ?? '';
    const bandNeeded = data.bandNeeded ?? data.band ?? '';
    const localMusicians = data.localMusicians ?? data.localMusician ?? '';
    const sessions = data.sessions ?? '';
    const panelTopic = data.panelTopic ?? '';
    const pointOfContact = data.pointOfContact ?? '';
    const attendance = data.attendance ?? '';
    const website = data.website ?? '';
    const venueAddress = data.venueAddress ?? '';

    await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: ['info@reyescend.com'],
      subject: `New Booking Request - ${data.bookingType || 'Ministry Request'}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Booking Type:</strong> ${data.bookingType || ''}</p>
        <p><strong>Request Type:</strong> ${data.requestType || ''}</p>
        ${sessions ? `<p><strong>Number of Sessions:</strong> ${sessions}</p>` : ''}
        ${bandNeeded ? `<p><strong>Band Needed:</strong> ${bandNeeded}</p>` : ''}
        ${localMusicians ? `<p><strong>Local Musicians Provided:</strong> ${localMusicians}</p>` : ''}
        ${panelTopic ? `<p><strong>Panel Topic:</strong> ${panelTopic}</p>` : ''}
        <p><strong>Name:</strong> ${data.fullName || ''}</p>
        <p><strong>Point of Contact:</strong> ${pointOfContact}</p>
        <p><strong>Email:</strong> ${data.email || ''}</p>
        <p><strong>Phone:</strong> ${data.phone || ''}</p>
        <p><strong>Church:</strong> ${data.church || ''}</p>
        <p><strong>Attendance:</strong> ${attendance}</p>
        <p><strong>Budget:</strong> ${budget}</p>
        <p><strong>Event:</strong> ${data.eventName || ''}</p>
        <p><strong>Website:</strong> ${website}</p>
        <p><strong>Venue Address:</strong> ${venueAddress}</p>
        <p><strong>Start Date:</strong> ${data.startDate || ''}</p>
        <p><strong>End Date:</strong> ${data.endDate || ''}</p>
        <p><strong>Details:</strong></p>
        <p>${data.eventDetails || ''}</p>
      `,
    });

    await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: ['info@reyescend.com'],
      subject: 'Booking Request Received!',
      html: `
        <p>Greetings,</p>
        <p>Thank you for reaching out. We have received your booking request and our team will review the details.</p>
        <p>You can expect a response regarding availability and next steps within 7–14 business days.</p>
        <p>Blessings,</p>
        <p><strong>Carter & Tori Harrison Ministries</strong><br/>contact@harrisonministries.org</p>
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
