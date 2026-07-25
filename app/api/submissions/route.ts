import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
  try {
    const urlParams = new URL(req.url).searchParams;
    const category = urlParams.get('category');

    let query = supabase.from('media_submissions').select('*').order('created_at', { ascending: false });

    if (category && category.toLowerCase() !== 'all') {
      query = query.eq('category', category.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: `Could not load submissions: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, submissions: data || [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Fetch submissions error:', error);
    return NextResponse.json({ error: `Failed to load submissions: ${message}` }, { status: 500 });
  }
}