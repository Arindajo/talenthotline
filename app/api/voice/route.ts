import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const dtmfDigits = formData.get('dtmfDigits') as string;
    const text = formData.get('text') as string;

    let xmlResponse = '';

    // If the user hasn't made a choice yet, prompt them via IVR
    if (!dtmfDigits && !text) {
      xmlResponse = `
        <Response>
          <GetDigits numDigits="1" timeout="7" finishOnKey="#">
            <Say>Welcome to Talent Hotline. Press 1 for Music, or 2 for Comedy, followed by the hash key.</Say>
          </GetDigits>
        </Response>
      `;
    } else {
      // Determine user selection based on pressed digit
      const selectedDigit = dtmfDigits || text.trim();
      const category = selectedDigit === '1' ? 'Music' : 'Comedy';

      // Prompt user to record their performance
      xmlResponse = `
        <Response>
          <Say>You selected ${category}. Please record your 45-second performance after the beep. Press hash when done.</Say>
          <Record finishOnKey="#" maxLength="45" trimSilence="true" callbackUrl="${process.env.NEXT_PUBLIC_BASE_URL}/api/voice/callback?category=${category}"/>
        </Response>
      `;
    }

    return new Response(xmlResponse.trim(), {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Voice webhook error:', error);
    return new Response('<Response><Say>An error occurred.</Say></Response>', {
      status: 200,
      headers: { 'Content-Type': 'text/xml' },
    });
  }
}