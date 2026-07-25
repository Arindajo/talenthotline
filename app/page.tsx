
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-6 py-20 text-center flex-grow flex flex-col justify-center items-center">
       

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Unlocking Grassroots Talent, <span className="text-purple-400">Zero Hustle .</span>
        </h1>

        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          CreatorConnect connects rural and peri-urban artists, comedians, dancers, and creators directly with industry recruiters using Africa’s Talking SMS, Voice, and USSD technology.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-md">
          <Link
            href="/submit"
            className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition-all text-center"
          >
            Submit Portfolio / Register
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold px-8 py-4 rounded-xl border border-gray-700 transition-all text-center"
          >
            Recruiter Dashboard
          </Link>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left w-full">
          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Voice-First Auditions</h3>
            <p className="text-gray-400 text-sm">Artists call a dedicated phone number to record performances instantly without needing expensive mobile data.</p>
          </div>

          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Instant SMS ID Delivery</h3>
            <p className="text-gray-400 text-sm">Every registered creator receives an official, unique ID straight to their mobile device via SMS.</p>
          </div>

          <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700/60">
            <h3 className="font-bold text-purple-300 text-lg mb-2">Multi-Category Discovery</h3>
            <p className="text-gray-400 text-sm">Recruiters can effortlessly filter talent submissions across Music, Poetry, Modeling, and Dance.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} CreatorConnect Kampala. Powered by Africa’s Talking APIs & Supabase.
      </footer>
    </main>
  );
}