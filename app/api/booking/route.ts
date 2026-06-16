import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const result = await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: ['contact@harrisonministries.org'],
      subject: `New Booking Request: ${data.bookingType}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Booking Type:</strong> ${data.bookingType}</p>
        <p><strong>Name:</strong> ${data.fullName}</p>
        <p><strong>Church:</strong> ${data.church}</p>
        <p><strong>Event:</strong> ${data.eventName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Website:</strong> ${data.website}</p>
        <p><strong>Start Date:</strong> ${data.startDate}</p>
        <p><strong>End Date:</strong> ${data.endDate}</p>
        <hr />
        <p>${data.eventDetails}</p>
      `,
    });
    await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: [data.email],
      subject: 'Booking Request Received!',
      html: `
        <p>Greetings,</p>

        <p>Thank you so much for reaching out and for considering ${data.bookingType} for your upcoming event.</p>

        <p>Please know that we have received your booking request and our team will prayerfully review the details. You can expect a response regarding availability and next steps within 7–14 business days.</p>

        <p>We are thankful for your consideration and look forward to the possibility of serving alongside you.</p>

        <p>Blessings,</p>

        <p><strong>Carter & Tori Harrison Ministries</strong></p>
      `,
    });
    console.log('RESEND RESULT:', result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
