import React from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import ScrollProgress from '../ui/ScrollProgress'
import NoiseOverlay from '../ui/NoiseOverlay'
import SmoothScroll from '../ui/SmoothScroll'
import ThemeBackground from '../ui/ThemeBackground'

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 flex flex-col font-sans">
        <ThemeBackground />
        <ScrollProgress />
        <NoiseOverlay />
        
        {/* Top Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <div className="grow max-w-6xl w-full mx-auto px-4 sm:px-6 pt-24 pb-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
            
            {/* Desktop Sticky Profile Sidebar */}
            <div className="w-full lg:w-80 lg:sticky lg:top-24">
              <Sidebar />
            </div>

            {/* Right Scroll Region */}
            <main className="w-full grow min-w-0 space-y-12 sm:space-y-16" id="main-content">
              {children}
            </main>

          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScroll>
  )
}
