import { useSyncExternalStore } from 'react'
import { flushSync } from 'react-dom'

export type Theme = 'light' | 'dark'
export type TransitionDirection = 'left' | 'right' | 'dynamic'

function getSnapshot(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = (localStorage.getItem('portfolio-theme') || localStorage.getItem('theme')) as Theme | null
  if (stored === 'light' || stored === 'dark') {
    return stored
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getServerSnapshot(): Theme {
  return 'light'
}

const listeners = new Set<() => void>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => {
    listeners.delete(callback)
  }
}

export function setTheme(newTheme: Theme) {
  try {
    localStorage.setItem('portfolio-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  } catch {}

  if (typeof document !== 'undefined') {
    const root = document.documentElement
    if (newTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      document.body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      document.body.classList.remove('dark')
    }
  }
  emitChange()
}

export async function toggleTheme(direction: TransitionDirection = 'left') {
  const current = getSnapshot()
  const nextTheme: Theme = current === 'light' ? 'dark' : 'light'

  const doc = typeof document !== 'undefined' ? (document as any) : null
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Fallback for browsers without View Transitions or users who prefer reduced motion
  if (
    !doc ||
    typeof doc.startViewTransition !== 'function' ||
    isReducedMotion
  ) {
    setTheme(nextTheme)
    return
  }

  // Determine active wipe direction
  const activeDirection =
    direction === 'dynamic'
      ? nextTheme === 'dark'
        ? 'left'
        : 'right'
      : direction

  try {
    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
      })
    })

    await transition.ready

    if (activeDirection === 'left') {
      // Left-to-right: reveal from left edge towards right
      document.documentElement.animate(
        {
          clipPath: [
            'inset(0 100% 0 0)', // right side covered (100%), left open (0%)
            'inset(0 0 0 0)',    // fully revealed
          ],
        },
        {
          duration: 700,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        } as any
      )
    } else {
      // Right-to-left: reveal from right edge towards left
      document.documentElement.animate(
        {
          clipPath: [
            'inset(0 0 0 100%)', // left side covered (100%), right open (0%)
            'inset(0 0 0 0)',    // fully revealed
          ],
        },
        {
          duration: 700,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        } as any
      )
    }
  } catch {
    setTheme(nextTheme)
  }
}

// Listen for system preference changes or cross-tab localStorage updates
if (typeof window !== 'undefined') {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    const stored = localStorage.getItem('portfolio-theme') || localStorage.getItem('theme')
    if (!stored) {
      setTheme(e.matches ? 'dark' : 'light')
    }
  })
  window.addEventListener('storage', (e) => {
    if (e.key === 'portfolio-theme' || e.key === 'theme') {
      const newTheme = (e.newValue as Theme) || 'light'
      setTheme(newTheme)
    }
  })
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return { theme, toggleTheme, setTheme }
}
