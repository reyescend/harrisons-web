export async function POST(request: Request) {
  try {
    const { firstName, email } = await request.json();

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwwzW5xrT5O0jX_fFgPFLEQ_0lyMfkmnYFNuuKzWVuN6Xggs4Y8l41XTVmZhxvHZB_YeA/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          email,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Broken For Battle error:', response.status, errorText);
      throw new Error(`Failed to save signup (${response.status})`);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to save signup" },
      { status: 500 }
    );
  }
}