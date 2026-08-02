import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/ui/LoadingScreen'
import ScrollToTop from './components/utils/ScrollToTop'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ReelLinksPage = lazy(() => import('./pages/ReelLinksPage'))
const ReelLinkDetailPage = lazy(() => import('./pages/ReelLinkDetailPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function PageLoader() {
  return (
    <div className="py-24 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 rounded-full border-2 border-zinc-800 border-t-white"
      />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/blog"
          element={
            <PageTransition>
              <BlogListPage />
            </PageTransition>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <PageTransition>
              <BlogPostPage />
            </PageTransition>
          }
        />
        <Route
          path="/code-drops"
          element={
            <PageTransition>
              <ReelLinksPage />
            </PageTransition>
          }
        />
        <Route
          path="/code-drops/:slug"
          element={
            <PageTransition>
              <ReelLinkDetailPage />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <AppRoutes />
          </Suspense>
        </Layout>
      </BrowserRouter>
    </>
  )
}
