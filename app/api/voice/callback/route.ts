import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import AfricasTalking from 'africastalking';

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Initialize Africa's Talking SDK
const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!, // use 'sandbox' for testing
});

const sms = AT.SMS;

export async function POST(req: Request) {
  try {
    const urlParams = new URL(req.url).searchParams;
    const category = urlParams.get('category') || 'General';

    const formData = await req.formData();
    const callerNumber = formData.get('callerNumber') as string;
    const recordingUrl = formData.get('recordingUrl') as string;
    const duration = formData.get('duration') as string;

    // 1. Save record into Supabase database
    const { error } = await supabase.from('auditions').insert([
      {
        artist_phone: callerNumber,
        category: category,
        audio_url: recordingUrl,
        duration: duration,
      },
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
      throw error;
    }

    // 2. Send SMS Confirmation to the Artist
    const message = `Thank you for submitting your ${category} audition to TalentHotline! Our judges will review your recording shortly. Good luck!`;
    
    await sms.send({
      to: [callerNumber],
      message: message,
      // from: 'YOUR_SHORTCODE_OR_SENDER_ID' // Leave commented out to use AT default sandbox/live shared ID
    });

    return NextResponse.json({ success: true, message: 'Audition saved and SMS sent successfully' });
  } catch (err) {
    console.error('Error handling voice callback & SMS:', err);
    return NextResponse.json({ error: 'Failed to process callback' }, { status: 500 });
  }
}