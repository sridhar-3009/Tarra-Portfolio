import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import { FiPlay, FiExternalLink, FiYoutube, FiX, FiCalendar } from 'react-icons/fi'
import { useYouTubeVideos } from '../hooks/useYouTubeVideos'

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

// ── Video embed modal ─────────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  return (
    <AnimatePresence>
      {video && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl"
          >
            {/* Close + title bar */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-white font-semibold text-sm line-clamp-1 max-w-[80%]">
                {video.title}
              </span>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-white transition-colors p-1"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Embed */}
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full rounded-xl"
                style={{ border: 'none' }}
              />
            </div>

            {/* Meta row */}
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-zinc-500 text-xs flex items-center gap-1.5">
                <FiCalendar size={11} />
                {formatDate(video.publishedAt)}
              </span>
              <a
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
              >
                Watch on YouTube <FiExternalLink size={11} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ── Video card ────────────────────────────────────────────────────────────────
function VideoCard({ video, index, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(video)}
      className="group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative rounded-xl overflow-hidden mb-3 aspect-video bg-zinc-900">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Play button */}
        <motion.div
          animate={{ scale: hovered ? 1 : 0.85, opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl">
            <FiPlay size={20} className="text-white ml-1" />
          </div>
        </motion.div>

        {/* Duration badge placeholder */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          YT
        </div>
      </div>

      {/* Info */}
      <h3 className="text-sm font-semibold text-zinc-100 line-clamp-2 leading-snug mb-1.5 group-hover:text-white transition-colors">
        {video.title}
      </h3>
      <p className="text-xs text-zinc-500 flex items-center gap-1.5">
        <FiCalendar size={10} />
        {formatDate(video.publishedAt)}
      </p>
    </motion.div>
  )
}

// ── Setup instructions (shown when env vars missing) ─────────────────────────
function SetupGuide({ error }) {
  return (
    <div className="max-w-xl mx-auto mt-16 p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50">
      <div className="flex items-center gap-3 mb-5">
        <FiYoutube size={28} className="text-red-500" />
        <h2 className="text-lg font-bold text-white">YouTube Setup Required</h2>
      </div>

      <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
        {error === 'missing_key'
          ? 'Add your YouTube Data API key to connect your channel.'
          : 'Add your YouTube Channel ID to display your videos.'}
      </p>

      <ol className="space-y-4">
        {[
          {
            step: '1',
            title: 'Get a free API key',
            desc: 'Go to console.cloud.google.com → Create project → Enable "YouTube Data API v3" → Create credentials → API Key',
          },
          {
            step: '2',
            title: 'Find your Channel ID',
            desc: 'Go to youtube.com → your profile → Settings → Advanced settings → copy the Channel ID',
          },
          {
            step: '3',
            title: 'Add to .env.local',
            desc: 'In the root of your portfolio project:',
            code: 'VITE_YOUTUBE_API_KEY=AIzaSy...\nVITE_YOUTUBE_CHANNEL_ID=UC...',
          },
          {
            step: '4',
            title: 'Restart the dev server',
            desc: 'Run npm run dev — your videos will load automatically.',
          },
        ].map((item) => (
          <li key={item.step} className="flex gap-4">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
              {item.step}
            </span>
            <div>
              <div className="text-sm font-semibold text-zinc-200 mb-0.5">{item.title}</div>
              <div className="text-xs text-zinc-500 leading-relaxed">{item.desc}</div>
              {item.code && (
                <pre className="mt-2 p-3 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-green-400 font-mono whitespace-pre">
                  {item.code}
                </pre>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── Skeleton loader ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="rounded-xl bg-zinc-800/60 aspect-video mb-3" />
      <div className="h-3.5 bg-zinc-800/60 rounded w-4/5 mb-2" />
      <div className="h-3.5 bg-zinc-800/60 rounded w-2/3 mb-3" />
      <div className="h-3 bg-zinc-800/40 rounded w-1/4" />
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function VideosPage() {
  const { videos, loading, error } = useYouTubeVideos(20)
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
      <Helmet>
        <title>Videos | Sai Sridhar Tarra</title>
        <meta name="description" content="YouTube videos by Sai Sridhar Tarra — ML engineering, AI systems, open source, and more." />
      </Helmet>

      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />

      <div className="space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <FiYoutube size={22} className="text-red-500" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">YouTube</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-zinc-100 tracking-tight mb-3">
            Videos
          </h1>
          <p className="text-zinc-400 text-base leading-relaxed max-w-xl">
            ML engineering, AI systems, open source projects, and everything in between.
            Click any video to watch it here, or open on YouTube.
          </p>
        </motion.div>

        {/* Error / Setup guide */}
        {error && <SetupGuide error={error} />}

        {/* Loading skeletons */}
        {loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Video grid */}
        {!loading && !error && videos.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {videos.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i}
                  onClick={setActiveVideo}
                />
              ))}
            </div>

            {/* Channel link */}
            <div className="pt-4 text-center">
              <a
                href={`https://www.youtube.com/channel/${import.meta.env.VITE_YOUTUBE_CHANNEL_ID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors border border-zinc-700 hover:border-zinc-500 px-5 py-2.5 rounded-lg"
              >
                <FiYoutube size={15} className="text-red-500" />
                View full channel on YouTube
                <FiExternalLink size={12} />
              </a>
            </div>
          </>
        )}

        {/* Empty state */}
        {!loading && !error && videos.length === 0 && (
          <div className="text-center py-20 text-zinc-600">
            <FiYoutube size={40} className="mx-auto mb-4 text-zinc-700" />
            <p>No videos found on this channel yet.</p>
          </div>
        )}
      </div>
    </>
  )
}
