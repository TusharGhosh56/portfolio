import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../hooks/useTheme'

export interface GradientBarsBackgroundProps {
  numBars?: number
  gradientColor?: string
  className?: string
  children?: React.ReactNode
  interactive?: boolean
  showGlow?: boolean
}

export function GradientBarsBackground({
  numBars = 15,
  gradientColor = 'rgb(0, 136, 255)',
  className = '',
  children,
  interactive = true,
  showGlow = true,
}: GradientBarsBackgroundProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const containerRef = useRef<HTMLDivElement>(null)
  const barsRef = useRef<(HTMLDivElement | null)[]>([])
  const mouseTargetRef = useRef<number | null>(null)
  const currentMouseRef = useRef<number | null>(null)
  const mouseInfluenceRef = useRef<number>(0)
  const [isVisible, setIsVisible] = useState(true)

  // Pause animation when scrolled off-screen for maximum performance
  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting)
        })
      },
      { threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Smooth wave animation loop
  useEffect(() => {
    if (!isVisible) return

    let animId: number
    const centerIndex = (numBars - 1) / 2

    const render = () => {
      const t = performance.now() / 1000

      // Smooth mouse tracking
      if (mouseTargetRef.current !== null) {
        if (currentMouseRef.current === null) {
          currentMouseRef.current = mouseTargetRef.current
        } else {
          currentMouseRef.current += (mouseTargetRef.current - currentMouseRef.current) * 0.12
        }
        mouseInfluenceRef.current += (1 - mouseInfluenceRef.current) * 0.1
      } else {
        mouseInfluenceRef.current += (0 - mouseInfluenceRef.current) * 0.06
        if (mouseInfluenceRef.current < 0.005) {
          mouseInfluenceRef.current = 0
          currentMouseRef.current = null
        }
      }

      for (let i = 0; i < numBars; i++) {
        const bar = barsRef.current[i]
        if (!bar) continue

        // 1. Symmetrical V-shaped valley baseline (as seen in reference screenshot)
        const normDistFromCenter = Math.abs(i - centerIndex) / centerIndex // 0 at center, 1 at edges
        const baseHeight = 0.28 + 0.48 * Math.pow(normDistFromCenter, 1.45)

        // 2. Dual-frequency gentle sinusoidal wave ripple
        const wave1 = Math.sin(t * 1.8 + i * 0.42) * 0.09
        const wave2 = Math.cos(t * 1.15 - i * 0.28) * 0.05

        // 3. Interactive cursor lift
        let mouseLift = 0
        if (interactive && currentMouseRef.current !== null && mouseInfluenceRef.current > 0) {
          const distToMouse = Math.abs(i - currentMouseRef.current)
          mouseLift = Math.exp(-(distToMouse * distToMouse) / 3.8) * 0.22 * mouseInfluenceRef.current
        }

        const targetScale = Math.max(0.12, Math.min(0.96, baseHeight + wave1 + wave2 + mouseLift))
        bar.style.transform = `scaleY(${targetScale.toFixed(4)})`

        // Subtle dynamic opacity boost near mouse or wave crest
        if (interactive && mouseLift > 0.04) {
          bar.style.filter = `brightness(${(1 + mouseLift * 1.2).toFixed(3)})`
        } else {
          bar.style.filter = 'brightness(1)'
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [numBars, isVisible, interactive])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = (e.clientX - rect.left) / rect.width
    mouseTargetRef.current = Math.max(0, Math.min(numBars - 1, relativeX * numBars))
  }

  const handleMouseLeave = () => {
    mouseTargetRef.current = null
  }

  // Active gradient color customized for dark vs light mode
  const activeColor = gradientColor
  const activeTopFade = isDark ? '#0B0F19' : '#FFFFFF'

  return (
    <div
      ref={containerRef}
      className={`gradient-bars-wrapper ${className}`.trim()}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        {
          '--bar-color': activeColor,
          '--top-fade': activeTopFade,
        } as React.CSSProperties
      }
    >
      {/* Background Bars Stage */}
      <div className="gradient-bars-stage" aria-hidden="true">
        {Array.from({ length: numBars }).map((_, index) => (
          <div
            key={index}
            ref={(el) => { barsRef.current[index] = el }}
            className="gradient-bar-column"
          >
            <div className="gradient-bar-inner" />
          </div>
        ))}
      </div>

      {/* Top Gradient Dissolve: Smoothly blends bars into section canvas */}
      <div className="gradient-bars-top-fade" aria-hidden="true" />

      {/* Optional Ambient Bottom Glow */}
      {showGlow && <div className="gradient-bars-ambient-glow" aria-hidden="true" />}

      {/* Foreground Content */}
      <div className="gradient-bars-content">
        {children}
      </div>
    </div>
  )
}

export const GradientBars = GradientBarsBackground
