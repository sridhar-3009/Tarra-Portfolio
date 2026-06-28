import { useState, Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Layout from './components/layout/Layout'
import LoadingScreen from './components/ui/LoadingScreen'

const Home = lazy(() => import('./pages/Home'))
const BlogListPage = lazy(() => import('./pages/BlogListPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const ReelLinksPage = lazy(() => import('./pages/ReelLinksPage'))
const ReelLinkDetailPage = lazy(() => import('./pages/ReelLinkDetailPage'))
const NotFound = lazy(() => import('./pages/NotFound'))

function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#0D0D0D' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-6 h-6 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#00E5A0' }}
      />
    </div>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home: full-screen 3D world — no Layout wrapper */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Blog and other routes: wrapped in Layout */}
        <Route
          path="/blog"
          element={
            <Layout>
              <PageTransition>
                <BlogListPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Layout>
              <PageTransition>
                <BlogPostPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/code-drops"
          element={
            <Layout>
              <PageTransition>
                <ReelLinksPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="/code-drops/:slug"
          element={
            <Layout>
              <PageTransition>
                <ReelLinkDetailPage />
              </PageTransition>
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout>
              <PageTransition>
                <NotFound />
              </PageTransition>
            </Layout>
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
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </BrowserRouter>
    </>
  )
}
