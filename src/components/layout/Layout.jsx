import Navbar from './Navbar'
import Footer from './Footer'
import CustomCursor from '../ui/CustomCursor'
import ScrollProgress from '../ui/ScrollProgress'
import NoiseOverlay from '../ui/NoiseOverlay'
import SmoothScroll from '../ui/SmoothScroll'

export default function Layout({ children }) {
  return (
    <SmoothScroll>
      <CustomCursor />
      <ScrollProgress />
      <NoiseOverlay />
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SmoothScroll>
  )
}
