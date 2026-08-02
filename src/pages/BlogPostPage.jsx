import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Helmet } from 'react-helmet-async'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import { FiArrowLeft, FiCalendar, FiClock, FiTwitter, FiLinkedin, FiLink } from 'react-icons/fi'
import 'highlight.js/styles/github-dark.css'
import { getPostBySlug } from '../blog'
import { formatDate } from '../utils/blogUtils'

export default function BlogPostPage() {
  const { slug } = useParams()
  const post = getPostBySlug(slug)
  const [copied, setCopied] = useState(false)

  if (!post) {
    return (
      <div className="text-center py-20 space-y-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Post Not Found</h1>
        <p className="text-xs sm:text-sm text-zinc-500 font-mono">The requested article &quot;{slug}&quot; could not be located.</p>
        <Link to="/blog" className="inline-flex items-center gap-2 font-mono text-xs text-zinc-900 dark:text-white hover:underline">
          <FiArrowLeft className="w-3.5 h-3.5" /> Back to Articles
        </Link>
      </div>
    )
  }

  const shareUrl = window.location.href

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6"
    >
      <Helmet>
        <title>{`${post.title} | Sai Sridhar Tarra`}</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4 font-mono text-xs">
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Articles</span>
        </Link>
        <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800">
          {post.category}
        </span>
      </div>

      {/* Article Header */}
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white leading-snug">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <FiCalendar className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            {formatDate(post.date)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <FiClock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
            {post.readTime}
          </span>
        </div>

        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-normal leading-relaxed pt-1">
          {post.excerpt}
        </p>
      </div>

      {/* Article Body */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div className="prose dark:prose-invert max-w-none text-zinc-800 dark:text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Social Share & Footer */}
      <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className="text-zinc-500">Share:</span>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <FiTwitter className="w-4 h-4" />
          </a>
          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"
          >
            <FiLinkedin className="w-4 h-4" />
          </a>
          <button
            onClick={copyLink}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-black hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all flex items-center gap-1.5"
          >
            <FiLink className="w-4 h-4" />
            <span>{copied ? 'Copied!' : 'Copy link'}</span>
          </button>
        </div>

        <Link
          to="/blog"
          className="font-semibold text-zinc-900 dark:text-white hover:underline flex items-center gap-1"
        >
          <FiArrowLeft className="w-3.5 h-3.5" /> More Articles
        </Link>
      </div>
    </motion.article>
  )
}
