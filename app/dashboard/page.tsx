'use client';

import { useEffect, useState } from 'react';

interface Submission {
  id: string;
  artist_phone: string;
  username: string;
  category: string;
  media_type: string;
  media_url: string;
  description: string;
  created_at: string;
}

export default function RecruiterDashboard() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [interestForm, setInterestForm] = useState({ name: '', phone: '', message: '' });
  const [interestStatus, setInterestStatus] = useState({ loading: false, message: '', error: false });

  const categories = ['all', 'music', 'poetry', 'modeling', 'dance'];

  useEffect(() => {
    async function fetchSubmissions() {
      setLoading(true);
      try {
        const res = await fetch(`/api/submissions?category=${selectedCategory}`);
        const data = await res.json();
        if (data.success) {
          setSubmissions(data.submissions);
        }
      } catch (err) {
        console.error('Error fetching submissions:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSubmissions();
  }, [selectedCategory]);

  function openInterestModal(submission: Submission) {
    setSelectedSubmission(submission);
    setInterestForm({ name: '', phone: '', message: '' });
    setInterestStatus({ loading: false, message: '', error: false });
    setModalOpen(true);
  }

  async function handleInterested(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSubmission) return;

    setInterestStatus({ loading: true, message: '', error: false });

    try {
      const res = await fetch(`/api/submissions/${selectedSubmission.id}/interested`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruiter_name: interestForm.name,
          recruiter_phone: interestForm.phone,
          message: interestForm.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send interest');

      setInterestStatus({ loading: false, message: data.message, error: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong';
      setInterestStatus({ loading: false, message: msg, error: true });
    }
  }

  return (
    <main className="flex-grow p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Recruiter Dashboard</h1>
        <p className="text-gray-400 mb-8">Discover grassroots talent across audio, visual, and performance categories.</p>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Submissions Grid */}
        {loading ? (
          <p className="text-gray-400">Loading submissions...</p>
        ) : submissions.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl text-center text-gray-400 border border-gray-700">
            No submissions found for this category yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {submissions.map((item) => (
              <div key={item.id} className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 flex flex-col justify-between">

                {/* Media Preview Box */}
                <div className="bg-black h-48 flex items-center justify-center p-2 relative">
                  {item.media_type === 'audio' && (
                    <audio controls src={item.media_url} className="w-full" />
                  )}
                  {item.media_type === 'picture' && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.media_url} alt="Submission" className="h-full object-contain" />
                  )}
                  {item.media_type === 'video' && (
                    <video controls src={item.media_url} className="h-full w-full object-contain" />
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold uppercase bg-black/70 text-purple-300 backdrop-blur-sm">
                    {item.category}
                  </span>
                </div>

                {/* Creator Details */}
                <div className="p-5 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-white">{item.username}</h3>
                    <p className="text-xs text-gray-400 mt-1">Phone: {item.artist_phone}</p>
                    {item.description && (
                      <p className="text-sm text-gray-300 mt-3 italic">&quot;{item.description}&quot;</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center">
                    <span className="text-xs text-gray-500">{new Date(item.created_at).toLocaleDateString()}</span>
                    <button
                      onClick={() => openInterestModal(item)}
                      className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    >
                      Interested
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interest Modal */}
      {modalOpen && selectedSubmission && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-1">Express Interest</h2>
            <p className="text-gray-400 text-sm mb-6">
              Send an SMS to <span className="text-purple-400 font-semibold">{selectedSubmission.username}</span> about your interest.
            </p>

            {interestStatus.message ? (
              <div className={`p-4 rounded-lg text-sm mb-4 ${
                interestStatus.error
                  ? 'bg-red-900/50 text-red-200 border border-red-700'
                  : 'bg-green-900/50 text-green-200 border border-green-700'
              }`}>
                {interestStatus.message}
              </div>
            ) : (
              <form onSubmit={handleInterested} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                    placeholder="e.g. John from Studio Africa"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Your Phone Number</label>
                  <input
                    type="text"
                    required
                    value={interestForm.phone}
                    onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                    placeholder="e.g. 256700123456"
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-semibold text-gray-400 mb-1">Message to the Artist</label>
                  <textarea
                    rows={3}
                    value={interestForm.message}
                    onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                    placeholder="I love your music! Let's collaborate."
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={interestStatus.loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-lg transition-all text-sm disabled:opacity-50"
                  >
                    {interestStatus.loading ? 'Sending...' : 'Send SMS'}
                  </button>
                </div>
              </form>
            )}

            {interestStatus.message && (
              <button
                onClick={() => setModalOpen(false)}
                className="w-full mt-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-all text-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
