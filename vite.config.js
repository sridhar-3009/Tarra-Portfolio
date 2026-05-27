import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sitemap from 'vite-plugin-sitemap'
import path from 'path'

const blogSlugs = [
  'arima_to_sarima',
  'artemis-2-mission-complete-guide',
  'building-ml-pipelines',
  'byte-latent-transformers',
  'claude-mythos-anthropic-cybersecurity-model',
  'forge-go-ai-coding-agent',
  'future-of-ai',
  'hopfield-networks-modern-associative-memory',
  'kv-cache-compression',
  'langchain-projects',
  'mcp-server-starter',
  'mixture-of-experts',
  'multimodal-ai-beyond-text',
  'rag-beyond-naive-chunking',
  'superposition-polysemanticity-neural-networks',
  'tribe-v2-in-silico-neuroscience',
  'understanding-transformers',
]

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://saisridhartarra.in',
      dynamicRoutes: [
        '/',
        '/blog',
        '/code-drops',
        ...blogSlugs.map(s => `/blog/${s}`),
      ],
      changefreq: 'weekly',
      priority: 0.8,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          animations: ['framer-motion', 'gsap', '@gsap/react'],
          markdown: ['react-markdown', 'remark-gfm', 'rehype-highlight', 'rehype-slug'],
          icons: ['react-icons'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  assetsInclude: ['**/*.md'],
})
