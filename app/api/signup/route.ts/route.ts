import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET() {
  return NextResponse.json({ route: 'signup-api-working' });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const firstName = formData.get('firstName');
    const email = formData.get('email');

    const result = await resend.emails.send({
      from: 'contact@harrisonministries.org',
      to: ['contact@harrisonministries.org'],
      subject: 'New Broken For Battle Signup',
      html: `
        <h2>New Signup</h2>
        <p><strong>Name:</strong> ${firstName}</p>
        <p><strong>Email:</strong> ${email}</p>
      `,
    });

    console.log(result);

    return NextResponse.redirect(
      new URL('/?joined=true', req.url)
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: 'Failed' },
      { status: 500 }
    );
  }
}