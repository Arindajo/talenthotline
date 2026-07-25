import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { artist_phone, username, category, media_type, media_url, description } = await req.json();

    if (!artist_phone || !category || !media_type || !media_url) {
      return NextResponse.json({ error: 'Missing required fields (phone, category, media type, url)' }, { status: 400 });
    }

    // Validate category
    const validCategories = ['music', 'poetry', 'modeling', 'dance'];
    if (!validCategories.includes(category.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid category. Choose from music, poetry, modeling, dance.' }, { status: 400 });
    }

    // Save submission to Supabase
    const { data, error } = await supabase.from('media_submissions').insert([
      {
        artist_phone,
        username: username || 'Anonymous Artist',
        category: category.toLowerCase(),
        media_type: media_type.toLowerCase(), // 'audio', 'picture', 'video'
        media_url,
        description,
      },
    ]).select();

    if (error) throw error;

    return NextResponse.json({ success: true, data, message: 'Media uploaded successfully' });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to save media submission' }, { status: 500 });
  }
}