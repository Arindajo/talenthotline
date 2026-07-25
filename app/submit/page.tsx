'use client';

import { useState } from 'react'; // or standard React useState
import { useState as useReactState } from 'react';

export default function CreatorSubmission() {
  const [formData, setFormData] = useState({
    username: '',
    phone_number: '',
    category: 'music',
    media_type: 'audio',
    media_url: '',
    description: '',
  });

  const [status, setStatus] = useState({ loading: false, message: '', error: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, message: 'Submitting and registering...', error: false });

    try {
      // 1. Register User / Send Unique ID SMS
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

      // 2. Upload/Save Content Submission
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artist_phone: formData.phone_number,
          username: formData.username,
          category: formData.category,
          media_type: formData.media_type,
          media_url: formData.media_url,
          description: formData.description,
        }),
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed');

      setStatus({
        loading: false,
        message: `Success! Your unique creator ID (${regData.unique_id}) has been sent via SMS.`,
        error: false,
      });

      // Reset form
      setFormData({
        username: '',
        phone_number: '',
        category: 'music',
        media_type: 'audio',
        media_url: '',
        description: '',
      });
    } catch (err: any) {
      setStatus({ loading: false, message: err.message || 'Something went wrong', error: true });
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <h1 className="text-2xl font-bold mb-2">TalentHotline Creator Portal</h1>
        <p className="text-gray-400 text-sm mb-6">Register your talent, get your unique ID via SMS, and get discovered by recruiters.</p>

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
              placeholder="e.g. Kidra Fresh"
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
              placeholder="e.g. +256700000000"
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
            <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Media Public URL (Cloudinary / Drive / Link)</label>
            <input
              type="url"
              required
              value={formData.media_url}
              onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
              placeholder="https://..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-purple-500"
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
            {status.loading ? 'Processing...' : 'Register & Submit Portfolio'}
          </button>
        </form>
      </div>
    </main>
  );
}