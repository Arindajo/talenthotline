import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import AfricasTalking from 'africastalking';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const AT = AfricasTalking({
  apiKey: process.env.AT_API_KEY!,
  username: process.env.AT_USERNAME!,
});

const sms = AT.SMS;

export async function POST(req: Request) {
  try {
    const { username, phone_number } = await req.json();

    if (!username || !phone_number) {
      return NextResponse.json({ error: 'Username and phone number are required' }, { status: 400 });
    }

    // Generate a unique token/ID for the user (e.g., TH-7842)
    const uniqueId = `TH-${Math.floor(1000 + Math.random() * 9000)}`;

    // Save user to Supabase
    const { error: dbError } = await supabase.from('users').insert([
      {
        username,
        phone_number,
        unique_id: uniqueId,
      },
    ]);

    if (dbError) throw dbError;

    // Send the unique ID via SMS
    const message = `Welcome to TalentHotline, ${username}! Your unique creator ID is ${uniqueId}. Keep it safe for submissions and events.`;

    await sms.send({
      to: [phone_number],
      message: message,
    });

    return NextResponse.json({ success: true, unique_id: uniqueId, message: 'User registered and SMS sent successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Failed to register user' }, { status: 500 });
  }
}