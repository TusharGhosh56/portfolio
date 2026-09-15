import { useRef, useState, useEffect, useMemo } from 'react'
import { IconCloud } from './components/IconCloud'
import { Navbar } from './components/Navbar'
import { Experience } from './components/Experience'
import { StickyProjects } from './components/StickyProjects'
import { PeekingMascot } from './components/PeekingMascot'
import { TypewriterTitle } from './components/TypewriterTitle'
import { GradientBarsBackground } from './components/GradientBarsBackground'
import { LiquidShaderBackground } from './components/LiquidShaderBackground'
import { useTheme } from './hooks/useTheme'

const frontendSlugs = [
  'typescript',
  'javascript',
  'react',
  'nextdotjs',
  'html5',
  'css3',
  'tailwindcss',
  'redux',
  'vite',
]

const backendSlugs = [
  'python',
  'fastapi',
  'nodedotjs',
  'express',
  'postgresql',
  'mongodb',
  'redis',
  'sqlite',
  'celery',
  'langchain',
  'pydantic',
  'docker',
  'git',
  'github',
  'postman',
  'linux',
  'cplusplus',
]

const allSlugs = [
  ...frontendSlugs,
  ...backendSlugs,
  'visualstudiocode',
]

export function App() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const introVideoRef = useRef<HTMLVideoElement | null>(null)
  const loopVideoRef = useRef<HTMLVideoElement | null>(null)
  const introDarkVideoRef = useRef<HTMLVideoElement | null>(null)
  const loopDarkVideoRef = useRef<HTMLVideoElement | null>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [isLoopVisible, setIsLoopVisible] = useState(false)
  const loopStartedRef = useRef(false)

  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend'>('all')

  const cloudSlugs = useMemo(() => {
    if (activeCategory === 'frontend') return frontendSlugs
    if (activeCategory === 'backend') return backendSlugs
    return allSlugs
  }, [activeCategory])

  // Contact section interactive sliding peeking mascot state
  const contactActionsRef = useRef<HTMLDivElement>(null)
  const contactBtnRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const [activeContactIndex, setActiveContactIndex] = useState(0)
  const [isHoveringContact, setIsHoveringContact] = useState(false)
  const [mascotPos, setMascotPos] = useState({ x: 0, y: 0 })
  const [mascotReady, setMascotReady] = useState(false)
  const [mascotAnimated, setMascotAnimated] = useState(false)

  const computeMascotPos = (index: number, hovering: boolean) => {
    const btn = contactBtnRefs.current[index]
    if (!btn) return null
    const x = btn.offsetLeft + btn.offsetWidth - 48 - 8
    const lift = hovering ? (index === 0 ? 2 : 1) : 0
    const y = btn.offsetTop - 34 - lift
    return { x, y }
  }

  useEffect(() => {
    const p = computeMascotPos(activeContactIndex, isHoveringContact)
    if (p) {
      setMascotPos(p)
      setMascotReady(true)
    }

    const t = setTimeout(() => {
      setMascotAnimated(true)
    }, 60)

    const handleResize = () => {
      const p = computeMascotPos(activeContactIndex, isHoveringContact)
      if (p) {
        setMascotPos(p)
        setMascotReady(true)
      }
    }

    window.addEventListener('resize', handleResize)
    let ro: ResizeObserver | null = null
    if (contactActionsRef.current && typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(handleResize)
      ro.observe(contactActionsRef.current)
    }

    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', handleResize)
      if (ro) ro.disconnect()
    }
  }, [activeContactIndex, isHoveringContact])

  // Ensure intro video paints frame 0 immediately on load for a perfect resting state
  useEffect(() => {
    const intro = isDark ? introDarkVideoRef.current : introVideoRef.current
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
  }, [isDark])

  // Refresh ScrollTrigger after initial mount and font/image settling
  useEffect(() => {
    const t1 = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__ScrollTrigger) {
        (window as any).__ScrollTrigger.refresh()
      }
    }, 150)
    const t2 = setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).__ScrollTrigger) {
        (window as any).__ScrollTrigger.refresh()
      }
    }, 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  const handleMouseEnter = () => {
    setIsHovered(true)
    setIsLoopVisible(false)
    loopStartedRef.current = false

    const intro = isDark ? introDarkVideoRef.current : introVideoRef.current
    const loop = isDark ? loopDarkVideoRef.current : loopVideoRef.current

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

    const intro = isDark ? introDarkVideoRef.current : introVideoRef.current
    const loop = isDark ? loopDarkVideoRef.current : loopVideoRef.current

    if (intro) {
      intro.pause()
      intro.currentTime = 0.001
    }
    if (loop) {
      loop.pause()
      loop.currentTime = 0
    }
  }

  // Switch cleanly to loopVideo as intro reaches its end
  const handleIntroTimeUpdate = () => {
    const intro = isDark ? introDarkVideoRef.current : introVideoRef.current
    const loop = isDark ? loopDarkVideoRef.current : loopVideoRef.current
    if (!intro || !loop || loopStartedRef.current || !isHovered) return

    if (intro.duration && intro.currentTime >= intro.duration - 0.12) {
      loopStartedRef.current = true
      loop.currentTime = 0
      loop
        .play()
        .then(() => {
          setIsLoopVisible(true)
          intro.pause()
        })
        .catch(() => {
          setIsLoopVisible(true)
          intro.pause()
        })
    }
  }

  const handleIntroEnded = () => {
    const intro = isDark ? introDarkVideoRef.current : introVideoRef.current
    if (intro) {
      intro.pause()
    }
    if (!loopStartedRef.current && isHovered) {
      loopStartedRef.current = true
      const loop = isDark ? loopDarkVideoRef.current : loopVideoRef.current
      if (loop) {
        loop.currentTime = 0
        loop.play().catch(() => {})
      }
      setIsLoopVisible(true)
    }
  }

  return (
    <div className="page-wrapper">
      {/* Dynamic Parallax Liquid Shader Running Across All Sections */}
      <LiquidShaderBackground />

      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section (Full Focus / About Me) */}
      <main className="hero-section" id="about">
        {/* Left Column: Pure Self Introduction */}
        <div className="hero-content">
          <TypewriterTitle />
          <p className="hero-bio">
            I'm a software developer based in Bangalore, India. I specialize in building practical developer tools, code analysis engines, and full-stack web applications with Python, FastAPI, React, and TypeScript.
          </p>
          <p className="hero-bio hero-bio-secondary">
            I enjoy exploring the intersection of AI reasoning and developer productivity—crafting systems that are robust, high-performance, and deeply useful.
          </p>
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
              {/* Light Theme Intro & Loop Videos */}
              <video
                ref={introVideoRef}
                src="/assets/kling_20260913_VIDEO_The_charac_3498_0.mp4"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={!isDark ? handleIntroTimeUpdate : undefined}
                onEnded={!isDark ? handleIntroEnded : undefined}
                className="character-video"
                style={{
                  zIndex: 1,
                  opacity: !isDark && isHovered && isLoopVisible ? 0 : 1,
                  visibility: !isDark && isHovered && isLoopVisible ? 'hidden' : 'visible',
                  display: isDark ? 'none' : 'block'
                }}
              />

              <video
                ref={loopVideoRef}
                src="/assets/waving.mp4"
                muted
                playsInline
                loop
                preload="auto"
                className="character-video"
                style={{
                  opacity: !isDark && isHovered && isLoopVisible ? 1 : 0,
                  visibility: !isDark && isHovered && isLoopVisible ? 'visible' : 'hidden',
                  zIndex: 2,
                  display: isDark ? 'none' : 'block'
                }}
              />

              {/* Dark Theme Intro & Loop Videos */}
              <video
                ref={introDarkVideoRef}
                src="/assets/kling_dark.mp4"
                muted
                playsInline
                preload="auto"
                onTimeUpdate={isDark ? handleIntroTimeUpdate : undefined}
                onEnded={isDark ? handleIntroEnded : undefined}
                className="character-video"
                style={{
                  zIndex: 1,
                  opacity: isDark && isHovered && isLoopVisible ? 0 : 1,
                  visibility: isDark && isHovered && isLoopVisible ? 'hidden' : 'visible',
                  display: isDark ? 'block' : 'none'
                }}
              />

              <video
                ref={loopDarkVideoRef}
                src="/assets/waving_dark.mp4"
                muted
                playsInline
                loop
                preload="auto"
                className="character-video"
                style={{
                  opacity: isDark && isHovered && isLoopVisible ? 1 : 0,
                  visibility: isDark && isHovered && isLoopVisible ? 'visible' : 'hidden',
                  zIndex: 2,
                  display: isDark ? 'block' : 'none'
                }}
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator: Signals next section on scroll */}
        <a href="#skills" className="hero-scroll-indicator" aria-label="Scroll to tech stack">
          <span>Explore Tech Stack</span>
          <svg className="scroll-indicator-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </a>
      </main>

      {/* Tech Stack Section (Frontend & Backend Breakdown with Interactive 3D IconCloud) */}
      <section className="skills-section" id="skills">
        <div className="skills-section-header">
          <span className="skills-subtitle">Proven Tech Stack</span>
          <h2 className="skills-title">Skills &amp; Tech Stack</h2>
          <p className="skills-intro">
            Technologies and tools I have hands-on experience building with—from high-throughput backend services and AI workflows to interactive, production-ready web applications.
          </p>
        </div>

        <div className="skills-split-layout">
          {/* Left Column: Categorized Frontend & Backend Cards */}
          <div className="skills-cards-col">
            <div className="skills-filter-row">
              <span className="skills-filter-heading">Click a card to filter sphere:</span>
              <button
                type="button"
                className={`all-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                All Skills ({allSlugs.length})
              </button>
            </div>

            {/* Frontend Skills Card */}
            <div
              className={`skill-category-card ${activeCategory === 'frontend' ? 'active-category' : ''}`}
              onClick={() => setActiveCategory(activeCategory === 'frontend' ? 'all' : 'frontend')}
              role="button"
              tabIndex={0}
            >
              <div className="skill-category-header">
                <div className="skill-category-title-wrap">
                  <span className="skill-category-badge frontend-badge">Frontend</span>
                  <h3 className="skill-category-title">Frontend &amp; Client Engineering</h3>
                </div>
                <span className={`card-filter-status ${activeCategory === 'frontend' ? 'active' : ''}`}>
                  {activeCategory === 'frontend' ? 'Active on Sphere ●' : 'Filter Sphere ↗'}
                </span>
              </div>

              <p className="skill-category-desc">
                I have worked extensively with React, Next.js, and TypeScript to build fast, responsive user interfaces and developer dashboards with clean component architectures, fluid interactions, and zero layout shift.
              </p>

              <div className="skill-pills-list">
                <span className="skill-pill">React</span>
                <span className="skill-pill">Next.js</span>
                <span className="skill-pill">TypeScript</span>
                <span className="skill-pill">JavaScript (ES6+)</span>
                <span className="skill-pill">Redux Toolkit</span>
                <span className="skill-pill">Tailwind CSS</span>
                <span className="skill-pill">HTML5 &amp; CSS3</span>
                <span className="skill-pill">Vite</span>
              </div>
            </div>

            {/* Backend Skills Card */}
            <div
              className={`skill-category-card ${activeCategory === 'backend' ? 'active-category' : ''}`}
              onClick={() => setActiveCategory(activeCategory === 'backend' ? 'all' : 'backend')}
              role="button"
              tabIndex={0}
            >
              <div className="skill-category-header">
                <div className="skill-category-title-wrap">
                  <span className="skill-category-badge backend-badge">Backend</span>
                  <h3 className="skill-category-title">Backend, APIs &amp; System Architecture</h3>
                </div>
                <span className={`card-filter-status ${activeCategory === 'backend' ? 'active' : ''}`}>
                  {activeCategory === 'backend' ? 'Active on Sphere ●' : 'Filter Sphere ↗'}
                </span>
              </div>

              <p className="skill-category-desc">
                I have hands-on experience architecting asynchronous REST APIs, distributed task workers, and relational databases using Python, FastAPI, PostgreSQL, Redis, and containerized Docker environments.
              </p>

              <div className="skill-pills-list">
                <span className="skill-pill">Python</span>
                <span className="skill-pill">FastAPI</span>
                <span className="skill-pill">Node.js</span>
                <span className="skill-pill">Express</span>
                <span className="skill-pill">PostgreSQL</span>
                <span className="skill-pill">Redis</span>
                <span className="skill-pill">Celery</span>
                <span className="skill-pill">LangGraph / LangChain</span>
                <span className="skill-pill">Pydantic v2</span>
                <span className="skill-pill">Docker</span>
                <span className="skill-pill">Git &amp; GitHub</span>
                <span className="skill-pill">Linux</span>
              </div>
            </div>
          </div>

          {/* Right Column: Frameless Floating 3D IconCloud Sphere */}
          <div className="skills-cloud-col">
            <div className="frameless-cloud-container">
              <IconCloud iconSlugs={cloudSlugs} />
            </div>
          </div>
        </div>
      </section>

      {/* Work Experience Section */}
      <Experience id="experience" />

      {/* Featured Projects Section (GSAP Sticky Pinned Showcase) */}
      <StickyProjects id="projects" />

      {/* Contact & Footer Section with Wave Gradient Bars Background */}
      <section className="contact-section-wrapper" id="contact">
        <GradientBarsBackground numBars={15} gradientColor="rgb(0, 136, 255)">
          <div className="contact-section">
            <div className="contact-content">
              <span className="skills-subtitle">Get In Touch</span>
              <h2 className="contact-title">Let's connect &amp; build together</h2>
              <p className="contact-desc">
                Whether you want to discuss developer tooling, high-performance web systems, or potential engineering opportunities—my inbox is always open.
              </p>

              <div
                className="contact-actions"
                ref={contactActionsRef}
                onMouseLeave={() => {
                  setIsHoveringContact(false)
                }}
              >
                <PeekingMascot
                  className={mascotAnimated ? 'is-animated' : ''}
                  style={{
                    transform: `translate3d(${mascotPos.x}px, ${mascotPos.y}px, 0)`,
                    opacity: mascotReady ? 1 : 0,
                  }}
                />

                <a
                  ref={(el) => { contactBtnRefs.current[0] = el }}
                  href="mailto:tusharghosh408@gmail.com"
                  className="contact-btn-primary"
                  onMouseEnter={() => {
                    setActiveContactIndex(0)
                    setIsHoveringContact(true)
                  }}
                  onFocus={() => {
                    setActiveContactIndex(0)
                    setIsHoveringContact(true)
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  Say Hello
                </a>

                <a
                  ref={(el) => { contactBtnRefs.current[1] = el }}
                  href="https://www.linkedin.com/in/tushar-ghosh-315142219/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn-secondary"
                  onMouseEnter={() => {
                    setActiveContactIndex(1)
                    setIsHoveringContact(true)
                  }}
                  onFocus={() => {
                    setActiveContactIndex(1)
                    setIsHoveringContact(true)
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>

                <a
                  ref={(el) => { contactBtnRefs.current[2] = el }}
                  href="https://github.com/TusharGhosh56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn-secondary"
                  onMouseEnter={() => {
                    setActiveContactIndex(2)
                    setIsHoveringContact(true)
                  }}
                  onFocus={() => {
                    setActiveContactIndex(2)
                    setIsHoveringContact(true)
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  GitHub
                </a>

                <a
                  ref={(el) => { contactBtnRefs.current[3] = el }}
                  href="/resume/Tushar_ghosh_resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-btn-secondary"
                  onMouseEnter={() => {
                    setActiveContactIndex(3)
                    setIsHoveringContact(true)
                  }}
                  onFocus={() => {
                    setActiveContactIndex(3)
                    setIsHoveringContact(true)
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Resume (PDF)
                </a>
              </div>
            </div>
          </div>
        </GradientBarsBackground>
      </section>
    </div>
  )
}

export default App
