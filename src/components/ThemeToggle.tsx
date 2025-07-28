'use client'

import { useTheme } from './ThemeProvider'
import { Sun, Moon } from 'lucide-react'

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button 
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="toggle-icon">
        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </div>
      <span className="toggle-text">
        {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  )
}
