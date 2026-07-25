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
      return NextResponse.json({ error: 'Missing required fields: phone, category, media type, and file URL are all required.' }, { status: 400 });
    }

    const validCategories = ['music', 'poetry', 'modeling', 'dance'];
    if (!validCategories.includes(category.toLowerCase())) {
      return NextResponse.json({ error: `Invalid category "${category}". Choose from: music, poetry, modeling, dance.` }, { status: 400 });
    }

    const { data, error } = await supabase.from('media_submissions').insert([
      {
        artist_phone,
        username: username || 'Anonymous Artist',
        category: category.toLowerCase(),
        media_type: media_type.toLowerCase(),
        media_url,
        description,
      },
    ]).select();

    if (error) {
      return NextResponse.json({ error: `Could not save submission: ${error.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, message: 'Media uploaded successfully' });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error('Upload error:', error);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}