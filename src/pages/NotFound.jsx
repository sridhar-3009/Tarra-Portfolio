import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { FiHome, FiArrowLeft } from 'react-icons/fi'
import Eyes from '../components/home/Eyes'
import { Bouncy, Sparkle } from '../components/home/ui'

export default function NotFound() {
  return (
    <div className="py-16 text-center space-y-6">
      <Helmet>
        <title>404 — Page Not Found | Sai Sridhar Tarra</title>
      </Helmet>

      <div className="space-y-2">
        <Eyes className="mx-auto mb-2 w-24" />
        <h1 className="relative inline-block font-display text-6xl sm:text-8xl font-extrabold text-ink">
          <Sparkle className="-left-6 top-2 text-highlight" size={22} />
          <Sparkle className="-right-7 top-6 text-accent" size={16} delay={1} />
          <Bouncy text="404" step={0.12} />
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white">
          Lost in latent space. The eyes are looking for it too.
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
