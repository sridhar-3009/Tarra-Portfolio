import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiHome, FiArrowLeft } from 'react-icons/fi'

export default function NotFound() {
  return (
    <div className="py-16 text-center space-y-6">
      <Helmet>
        <title>404 — Page Not Found | Sai Sridhar Tarra</title>
      </Helmet>

      <div className="space-y-2">
        <h1 className="font-mono text-6xl sm:text-8xl font-black text-zinc-900 dark:text-white">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          Lost in latent space.
        </h2>
        <p className="text-xs sm:text-sm font-mono text-zinc-500 max-w-sm mx-auto leading-relaxed">
          The requested route could not be found or has moved. Let&apos;s get you back on track.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 font-mono text-xs pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm hover:scale-105 transition-all"
        >
          <FiHome className="w-3.5 h-3.5" /> Go Home
        </Link>
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <FiArrowLeft className="w-3.5 h-3.5" /> Go Back
        </button>
      </div>
    </div>
  )
}
