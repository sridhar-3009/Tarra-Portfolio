import { createContext, useContext, useState, useEffect } from 'react'

const THEMES = ['neural', 'space', 'matrix', 'ocean']

const THEME_META = {
  neural: { label: 'Neural', icon: '⬡', accent1: '#8B5CF6', accent2: '#06B6D4' },
  space:  { label: 'Space',  icon: '✦', accent1: '#818CF8', accent2: '#F59E0B' },
  matrix: { label: 'Matrix', icon: '⌘', accent1: '#00FF41', accent2: '#00CC33' },
  ocean:  { label: 'Ocean',  icon: '◈', accent1: '#22D3EE', accent2: '#0EA5E9' },
}

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'neural')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
    const meta = THEME_META[theme]
    document.documentElement.style.setProperty('--accent-1', meta.accent1)
    document.documentElement.style.setProperty('--accent-2', meta.accent2)
  }, [theme])

  const cycleTheme = () => {
    setTheme(t => {
      const idx = THEMES.indexOf(t)
      return THEMES[(idx + 1) % THEMES.length]
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, cycleTheme, meta: THEME_META[theme], THEME_META }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
export { THEME_META }
