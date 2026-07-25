'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function CreatorSubmission() {
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    category: 'music',
    media_type: 'audio',
    description: '',
  });

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setStatus({ loading: true, message: 'Please select a file to upload.', error: true });
      return;
    }

    setStatus({ loading: true, message: 'Uploading media file & registering...', error: false });

    try {
      // 1. Upload actual file to Supabase Storage Bucket
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${formData.category}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('talent-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get Public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('talent-uploads')
        .getPublicUrl(filePath);

      const mediaUrl = publicUrlData.publicUrl;

      // 2. Register User & Send Unique ID SMS
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          phone_number: formData.phone_number,
        }),
      });
      const regData = await regRes.json();
      if (!regRes.ok) throw new Error(regData.error || 'Registration failed');

      // 3. Save submission record to Supabase database
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_phone: formData.phone_number,
          username: formData.username,
          category: formData.category,
          media_type: formData.media_type,
          media_url: mediaUrl,
          description: formData.description,
        }),
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadData.error || 'Failed to save submission');

      setStatus({
        loading: false,
        message: `Success! File uploaded, record created, and unique ID (${regData.unique_id}) sent via SMS.`,
        error: false,
      });

      // Reset form
      setFormData({ username: '', phone_number: '', category: 'music', media_type: 'audio', description: '' });
      setFile(null);
    } catch (err: any) {
      setStatus({ loading: false, message: err.message || 'Something went wrong', error: true });
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">TalentHotline Creator Portal</h1>
        <p className="text-gray-400 text-sm mb-6">Upload your actual video, picture, or audio files for recruiters.</p>

        {status.message && (
          <div className={`p-4 mb-6 rounded-lg text-sm ${status.error ? 'bg-red-900/50 text-red-200 border border-red-700' : 'bg-green-900/50 text-green-200 border border-green-700'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Artist / Creator Name</label>
            <input
              type="text"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. ARINDA"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Phone Number (with country code)</label>
            <input
              type="text"
              required
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              placeholder="e.g. 256770947655"
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 capitalize"
              >
                <option value="music">Music</option>
                <option value="poetry">Poetry</option>
                <option value="modeling">Modeling</option>
                <option value="dance">Dance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Media Type</label>
              <select
                value={formData.media_type}
                onChange={(e) => setFormData({ ...formData, media_type: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500 capitalize"
              >
                <option value="audio">Audio</option>
                <option value="picture">Picture</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Upload Actual File (Video, Picture, Audio)</label>
            <input
              type="file"
              required
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Short Description / Bio</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Tell recruiters a bit about your performance..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-purple-600 hover:bg-purple-500 transition-all font-semibold py-3 rounded-lg shadow-lg disabled:opacity-50"
          >
            {status.loading ? 'Uploading & Registering...' : 'Register & Submit Portfolio'}
          </button>
        </form>
      </div>
    </main>
  );
}