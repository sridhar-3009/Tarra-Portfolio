import React, { useState } from 'react'
import { FiSend } from 'react-icons/fi'
import { personal } from '../../data/personal'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <section id="contact" className="space-y-6 my-10 sm:my-12">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
          <span>Get in Touch</span>
          <span className="text-xs font-mono font-normal text-zinc-500">/ contact</span>
        </h2>
      </div>

      <div className="p-6 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/90 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white">
              Let&apos;s build something intelligent together.
            </h3>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Open to machine learning roles, AI consulting, research, and open source collaboration.
            </p>
          </div>

          <a
            href={`mailto:${personal.email}`}
            className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all text-center shrink-0 shadow-sm"
          >
            Say Hello
          </a>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              required
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white font-mono"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Your Email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white font-mono"
            />
          </div>
          <textarea
            name="message"
            required
            rows={3}
            placeholder="Your message..."
            value={form.message}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-black text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white font-mono resize-none"
          />

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <FiSend className="w-3.5 h-3.5" />
              <span>{status === 'sending' ? 'Sending...' : status === 'sent' ? 'Sent!' : 'Send Message'}</span>
            </button>

            <span className="font-mono text-xs text-zinc-500">
              Response time: &lt; 24h
            </span>
          </div>
        </form>
      </div>
    </section>
  )
}
