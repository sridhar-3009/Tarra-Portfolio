import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMenu, FiX, FiSun, FiMoon } from 'react-icons/fi'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark'
  })

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const handleNavClick = (href, e) => {
    setMobileOpen(false)

    if (href === '/') {
      if (location.pathname === '/') {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }

    if (href.startsWith('/#')) {
      e.preventDefault()
      const targetId = href.replace('/#', '')

      if (location.pathname !== '/') {
        navigate('/', { state: { scrollTo: targetId } })
      } else {
        const elem = document.getElementById(targetId)
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/#projects' },
    { label: 'Experience', href: '/#experience' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Articles', href: '/blog' },
    { label: 'Code Drops', href: '/code-drops' },
    { label: 'Contact', href: '/#contact' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 py-3 shadow-sm'
          : 'bg-white/80 dark:bg-black/80 backdrop-blur-sm py-4 border-b border-zinc-100 dark:border-zinc-900'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Brand */}
        <Link
          to="/"
          onClick={(e) => handleNavClick('/', e)}
          className="flex items-center gap-3 group"
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-300 dark:border-zinc-700 group-hover:border-zinc-900 dark:group-hover:border-white transition-colors">
            <img
              src="/profile.jpg"
              alt="Sai Sridhar Tarra"
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
          <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100 tracking-tight">
            Sai Sridhar Tarra
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs">
          {navItems.map((item) => {
            const isBlog = item.href === '/blog' && location.pathname.startsWith('/blog')
            const isCode = item.href === '/code-drops' && location.pathname.startsWith('/code-drops')
            const isHome = item.href === '/' && location.pathname === '/'
            const isActive = isBlog || isCode || isHome

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-black font-semibold shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all"
          >
            {theme === 'dark' ? <FiSun className="w-4 h-4 text-amber-400" /> : <FiMoon className="w-4 h-4 text-indigo-600" />}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile menu"
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 px-4 py-4 space-y-2 font-mono text-sm"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className="block px-4 py-2.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
