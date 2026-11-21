import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import SmoothScroll from '../ui/SmoothScroll'

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-paper text-ink transition-colors duration-300 flex flex-col font-sans">
        <Navbar />

        <main className="grow max-w-5xl w-full mx-auto px-5 sm:px-8 pt-24 pb-16" id="main-content">
          {children}
        </main>

        <Footer />
      </div>
    </SmoothScroll>
  )
}
