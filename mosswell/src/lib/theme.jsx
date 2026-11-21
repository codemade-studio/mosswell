import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({ theme: 'light', toggle: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('mosswell-theme', theme) } catch { /* ignore */ }
  }, [theme])
  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => useContext(ThemeContext)

/** Chart colours per theme (SVG attributes can't read CSS variables). */
// eslint-disable-next-line react-refresh/only-export-components
export function chartColors(theme) {
  const dark = theme === 'dark'
  return {
    brand: dark ? '#34d399' : '#059669',
    brandFill: dark ? '#34d399' : '#10b981',
    muted: dark ? '#52525b' : '#d4d4d8',
    grid: dark ? '#27272a' : '#f0f0f2',
    axis: dark ? '#71717a' : '#a1a1aa',
    tooltipBg: dark ? '#18181b' : '#ffffff',
    tooltipBorder: dark ? '#3f3f46' : '#e4e4e7',
    text: dark ? '#f4f4f5' : '#18181b',
  }
}
