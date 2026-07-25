import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center flex flex-col justify-center items-center">

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Unlocking Grassroots Talent, <span className="text-purple-400">Zero Hustle.</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-12 leading-relaxed">
          TalentHotline connects rural and peri-urban artists, comedians, dancers, and creators directly with industry recruiters — no internet needed.
        </p>

        {/* Creator / Recruiter Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-20">
          {/* Creator Card */}
          <Link href="/submit" className="group">
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-8 text-left hover:bg-purple-600/20 hover:border-purple-500/50 transition-all">
              <div className="text-4xl mb-4">🎤</div>
              <h2 className="text-2xl font-bold text-white mb-2">I&apos;m a Creator</h2>
              <p className="text-gray-400 text-sm mb-6">
                Upload your portfolio, get a unique Talent ID via SMS, and get discovered by recruiters.
              </p>
              <span className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                Submit Portfolio →
              </span>
            </div>
          </Link>

          {/* Recruiter Card */}
          <Link href="/dashboard" className="group">
            <div className="bg-gray-800/60 border border-gray-700/60 rounded-2xl p-8 text-left hover:bg-gray-800 hover:border-gray-600 transition-all">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-white mb-2">I&apos;m a Recruiter</h2>
              <p className="text-gray-400 text-sm mb-6">
                Browse grassroots talent across music, poetry, dance, and more. Express interest directly via SMS.
              </p>
              <span className="inline-block bg-gray-700 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                Discover Talent →
              </span>
            </div>
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Voice-First Auditions</h3>
            <p className="text-gray-400 text-sm">Artists record performances instantly via SMS and voice — no expensive mobile data needed.</p>
          </div>

          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Instant SMS ID Delivery</h3>
            <p className="text-gray-400 text-sm">Every registered creator receives a unique Talent ID straight to their phone via SMS.</p>
          </div>

          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Multi-Category Discovery</h3>
            <p className="text-gray-400 text-sm">Recruiters filter talent across Music, Poetry, Dance, Modeling, and more.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} TalentHotline. Powered by Africa&apos;s Talking APIs &amp; Supabase.
      </footer>
    </main>
  );
}
