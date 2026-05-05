import Navbar from './Navbar'
import Footer from './Footer'
import CustomCursor from '../ui/CustomCursor'
import ScrollProgress from '../ui/ScrollProgress'
import NoiseOverlay from '../ui/NoiseOverlay'
import SmoothScroll from '../ui/SmoothScroll'
import ThemeBackground from '../ui/ThemeBackground'
import ThemeToggle from '../ui/ThemeToggle'

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <ThemeBackground />
      <CustomCursor />
      <ScrollProgress />
      <NoiseOverlay />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <ThemeToggle />
    </SmoothScroll>
  )
}
