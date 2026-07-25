import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const urlParams = new URL(req.url).searchParams;
    const category = urlParams.get('category'); // e.g., 'music', 'poetry', etc.

    let query = supabase.from('media_submissions').select('*').order('created_at', { ascending: false });

    // If a specific category is requested and it's not 'all', filter by it
    if (category && category.toLowerCase() !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ success: true, submissions: data });
  } catch (error) {
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 });
  }
}