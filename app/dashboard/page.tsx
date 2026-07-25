'use client';

import { useEffect, useState } from 'react';

export default function RecruiterDashboard() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

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

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">TalentHotline Recruiter Dashboard</h1>
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
                      <p className="text-sm text-gray-300 mt-3 italic">"{item.description}"</p>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <span className="text-purple-400 uppercase font-semibold">{item.media_type}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}