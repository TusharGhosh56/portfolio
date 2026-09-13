import { useRef, useState, useEffect } from 'react'

export function App() {
  const introVideoRef = useRef<HTMLVideoElement | null>(null)
  const loopVideoRef = useRef<HTMLVideoElement | null>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [isLoopVisible, setIsLoopVisible] = useState(false)
  const loopStartedRef = useRef(false)

  // Ensure intro video paints frame 0 immediately on load for a perfect resting state
  useEffect(() => {
    const intro = introVideoRef.current
    if (!intro) return

    const prepareInitialFrame = () => {
      if (intro.currentTime === 0) {
        intro.currentTime = 0.001
      }
    }

    if (intro.readyState >= 2) {
      prepareInitialFrame()
    } else {
      intro.addEventListener('loadeddata', prepareInitialFrame, { once: true })
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsLoopVisible(false)
    loopStartedRef.current = false

    const intro = introVideoRef.current
    const loop = loopVideoRef.current

    if (loop) {
      loop.pause()
      loop.currentTime = 0
    }

    if (intro) {
      intro.currentTime = 0
      intro.play().catch(() => {})
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsLoopVisible(false)
    loopStartedRef.current = false

    const intro = introVideoRef.current
    const loop = loopVideoRef.current

    if (intro) {
      intro.pause()
      intro.currentTime = 0.001
    }
    if (loop) {
      loop.pause()
      loop.currentTime = 0
    }
  }

  // Pre-roll and crossfade into loopVideo 350ms before intro ends
  const handleIntroTimeUpdate = () => {
    const intro = introVideoRef.current
    const loop = loopVideoRef.current
    if (!intro || !loop || loopStartedRef.current || !isHovered) return

    if (intro.duration && intro.currentTime >= intro.duration - 0.35) {
      loopStartedRef.current = true
      loop.currentTime = 0
      loop
        .play()
        .then(() => {
          setIsLoopVisible(true)
        })
        .catch(() => {
          setIsLoopVisible(true)
        })
    }
  }

  const handleIntroEnded = () => {
    if (!loopStartedRef.current && isHovered) {
      loopStartedRef.current = true
      if (loopVideoRef.current) {
        loopVideoRef.current.currentTime = 0
        loopVideoRef.current.play().catch(() => {})
      }
      setIsLoopVisible(true)
    }
  }

  return (
    <div className="page-wrapper">
      {/* Navigation Bar */}
      <header className="nav-bar">
        <div className="nav-container">
          <div className="nav-brand">
            <span>Tushar Ghosh</span>
            <span className="nav-location">
              <span className="nav-location-dot"></span>
              Bangalore, IN
            </span>
          </div>

          <nav className="nav-links">
            <a href="https://github.com/TusharGhosh56" target="_blank" rel="noopener noreferrer" className="nav-link">
              GitHub ↗
            </a>
            <a href="https://www.linkedin.com/in/tushar-ghosh-315142219/" target="_blank" rel="noopener noreferrer" className="nav-link">
              LinkedIn ↗
            </a>
            <a href="mailto:tusharghosh408@gmail.com" className="nav-link">
              Contact
            </a>
            <a href="/resume/Tushar_ghosh_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-resume">
              <span>Resume (PDF)</span>
              <span>↗</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero-section">
        {/* Left Column: Human, Content-Rich Introduction */}
        <div className="hero-content">
          <div className="status-pill">
            <span>🎓</span>
            <span>MCA @ Christ University • Software Developer</span>
          </div>

          <h1 className="hero-title">
            Crafting <span className="highlight">code intelligence</span> tools &amp; full-stack web platforms.
          </h1>

          <p className="hero-bio">
            Hi, I'm <strong>Tushar Ghosh</strong>. I'm a software engineer who builds practical developer tools,
            AST-powered repository analysis engines, and high-performance web applications with Python, FastAPI, React, and TypeScript.
          </p>

          <p className="hero-bio" style={{ fontSize: '0.975rem', color: '#64748B' }}>
            Previously engineered enterprise compliance systems at <strong>CISOGenie</strong> and high-performance Astro applications at <strong>APLYD</strong>.
          </p>

          <div className="hero-cta-row">
            <a href="mailto:tusharghosh408@gmail.com" className="btn-primary">
              <span>Get in Touch</span>
              <span>→</span>
            </a>
            <a href="https://github.com/TusharGhosh56" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <span>View GitHub</span>
            </a>
            <a href="/resume/Tushar_ghosh_resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <span>View Resume</span>
            </a>
          </div>

          {/* Featured Highlights */}
          <div className="projects-preview">
            <span className="projects-label">Featured Works &amp; Systems</span>
            <div className="projects-chips">
              <a href="https://github.com/TusharGhosh56" target="_blank" rel="noopener noreferrer" className="project-chip">
                <strong>ArchitectAI</strong>
                <span className="project-chip-tag">LangGraph • Code Graphs</span>
              </a>
              <a href="https://github.com/TusharGhosh56" target="_blank" rel="noopener noreferrer" className="project-chip">
                <strong>MRanalysis</strong>
                <span className="project-chip-tag">Git Analytics • Celery/Redis</span>
              </a>
              <a href="https://github.com/TusharGhosh56" target="_blank" rel="noopener noreferrer" className="project-chip">
                <strong>Signwise</strong>
                <span className="project-chip-tag">Legal AI • Gemini</span>
              </a>
              <span className="project-chip" style={{ cursor: 'default' }}>
                <strong>APLYD</strong>
                <span className="project-chip-tag">Astro • Canvas Map</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Character Stage with Zero-Shift Resting State */}
        <div className="character-stage">
          <div
            className="character-wrapper"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Interactive Speech Bubble */}
            <div className={`speech-bubble ${isHovered ? 'active' : ''}`}>
              {isHovered ? (
                <>
                  <span>Hey there! Welcome to my portfolio</span>
                  <span>👋</span>
                </>
              ) : (
                <>
                  <span>Hover over me to say hi</span>
                  <span>👋</span>
                </>
              )}
            </div>

            {/* Character Media Box */}
            <div className="character-media-box">
              {/* 
                Zero-Shift Architecture:
                The intro video itself (at frame 0) serves as the resting state!
                Because the resting image and the playing video are the EXACT same video element,
                there is zero pixel offset, zero aspect-ratio discrepancy, and zero left-step jump.
              */}
              <video
                ref={introVideoRef}
                src="/assets/kling_20260913_VIDEO_The_charac_3498_0.mp4"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={handleIntroTimeUpdate}
                onEnded={handleIntroEnded}
                className="character-video"
                style={{
                  zIndex: 1,
                  opacity: 1
                }}
              />

              {/* Looping Waving Video: Crossfades in seamlessly on top */}
              <video
                ref={loopVideoRef}
                src="/assets/waving.mp4"
                muted
                playsInline
                loop
                preload="auto"
                className="character-video"
                style={{
                  opacity: isHovered && isLoopVisible ? 1 : 0,
                  transition: 'opacity 0.25s ease-in-out',
                  zIndex: 2
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
