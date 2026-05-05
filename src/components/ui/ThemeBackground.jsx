import { useTheme } from '../../context/ThemeContext'
import SpaceCanvas from './themes/SpaceCanvas'
import MatrixCanvas from './themes/MatrixCanvas'
import OceanCanvas from './themes/OceanCanvas'

export default function ThemeBackground() {
  const { theme } = useTheme()

  if (theme === 'space') return <SpaceCanvas />
  if (theme === 'matrix') return <MatrixCanvas />
  if (theme === 'ocean') return <OceanCanvas />
  return null // neural = existing NeuralCanvas in Hero
}
