import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowUp, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import { personal } from '../../data/personal'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="w-full border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-950/40 py-8 px-4 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
        
        <div className="flex items-center gap-3">
          <span>© {new Date().getFullYear()} {personal.name}</span>
          <span>•</span>
          <span>Hyderabad, India</span>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Home</Link>
          <Link to="/blog" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Articles</Link>
          <Link to="/code-drops" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Code Drops</Link>
          <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-1 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors ml-2"
          >
            <span>Top</span>
            <FiArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
