import { useRef, useState, useEffect, useMemo } from 'react'
import { IconCloud } from './components/IconCloud'
import { Navbar } from './components/Navbar'

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
  const introVideoRef = useRef<HTMLVideoElement | null>(null)
  const loopVideoRef = useRef<HTMLVideoElement | null>(null)

  const [isHovered, setIsHovered] = useState(false)
  const [isLoopVisible, setIsLoopVisible] = useState(false)
  const loopStartedRef = useRef(false)

  const [activeCategory, setActiveCategory] = useState<'all' | 'frontend' | 'backend'>('all')

  const cloudSlugs = useMemo(() => {
    if (activeCategory === 'frontend') return frontendSlugs
    if (activeCategory === 'backend') return backendSlugs
    return allSlugs
  }, [activeCategory])

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
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Section (Full Focus / About Me) */}
      <main className="hero-section" id="about">
        {/* Left Column: Pure Self Introduction */}
        <div className="hero-content">
          <h1 className="hero-title">
            Hi, I'm <span className="highlight">Tushar Ghosh</span>.
          </h1>

          <p className="hero-bio">
            I'm a software developer based in Bangalore, India. I specialize in building practical developer tools,
            code analysis engines, and full-stack web applications with Python, FastAPI, React, and TypeScript.
          </p>

          <p className="hero-bio" style={{ fontSize: '1rem', color: '#64748B' }}>
            I enjoy exploring the intersection of AI reasoning and developer productivity—crafting systems
            that are robust, high-performance, and deeply useful.
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
          <span className="skills-subtitle">Technical Expertise</span>
          <h2 className="skills-title">Skills &amp; Tech Stack</h2>
          <p className="skills-intro">
            A practical focus on building robust full-stack applications, scalable APIs, and responsive user interfaces.
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
                  <h3 className="skill-category-title">Client &amp; Interface Engineering</h3>
                </div>
                <span className={`card-filter-status ${activeCategory === 'frontend' ? 'active' : ''}`}>
                  {activeCategory === 'frontend' ? 'Active on Sphere ●' : 'Filter Sphere ↗'}
                </span>
              </div>

              <p className="skill-category-desc">
                Crafting performant, accessible web interfaces and design systems with modern React patterns, clean typography, and responsive layouts.
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
                  <h3 className="skill-category-title">APIs, Systems &amp; Databases</h3>
                </div>
                <span className={`card-filter-status ${activeCategory === 'backend' ? 'active' : ''}`}>
                  {activeCategory === 'backend' ? 'Active on Sphere ●' : 'Filter Sphere ↗'}
                </span>
              </div>

              <p className="skill-category-desc">
                Designing asynchronous REST services, background workers, relational/vector databases, and AI agent pipelines with Python and FastAPI.
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

      {/* Featured Projects Section */}
      <section className="projects-section" id="projects">
        <div className="skills-section-header">
          <span className="skills-subtitle">Featured Work</span>
          <h2 className="skills-title">Projects</h2>
          <p className="skills-intro">
            A curated selection of developer tools, automated code analysis engines, and intelligent web applications.
          </p>
        </div>

        <div className="projects-grid">
          {/* Project 1: ArchitectAI */}
          <div className="project-card">
            <div className="project-preview-wrap">
              <img
                src="/assets/projects/architectai-placeholder.svg"
                alt="ArchitectAI Preview"
                className="project-preview-img"
              />
            </div>
            <div className="project-body">
              <div className="project-badge-row">
                <span className="project-tag">AI &amp; System Architecture</span>
              </div>
              <h3 className="project-title">ArchitectAI</h3>
              <p className="project-desc">
                An intelligent system design engine that transforms natural language architecture requirements into interactive component diagrams and production-ready microservice blueprints.
              </p>
              <div className="project-tech-tags">
                <span className="project-tech-pill">Python</span>
                <span className="project-tech-pill">FastAPI</span>
                <span className="project-tech-pill">React</span>
                <span className="project-tech-pill">TypeScript</span>
                <span className="project-tech-pill">LangGraph</span>
              </div>
              <div className="project-actions">
                <a
                  href="https://github.com/TusharGhosh56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  Repository
                </a>
              </div>
            </div>
          </div>

          {/* Project 2: MRanalysis */}
          <div className="project-card">
            <div className="project-preview-wrap">
              <img
                src="/assets/projects/mranalysis-placeholder.svg"
                alt="MRanalysis Preview"
                className="project-preview-img"
              />
            </div>
            <div className="project-body">
              <div className="project-badge-row">
                <span className="project-tag">AST &amp; Code Review</span>
              </div>
              <h3 className="project-title">MRanalysis</h3>
              <p className="project-desc">
                Automated code review intelligence pipeline that parses Git diffs via Abstract Syntax Trees, performs static validation, and generates context-aware architecture review suggestions.
              </p>
              <div className="project-tech-tags">
                <span className="project-tech-pill">Python</span>
                <span className="project-tech-pill">FastAPI</span>
                <span className="project-tech-pill">PostgreSQL</span>
                <span className="project-tech-pill">Docker</span>
                <span className="project-tech-pill">Redis</span>
              </div>
              <div className="project-actions">
                <a
                  href="https://github.com/TusharGhosh56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  Repository
                </a>
              </div>
            </div>
          </div>

          {/* Project 3: SignWise */}
          <div className="project-card">
            <div className="project-preview-wrap">
              <img
                src="/assets/projects/signwise-placeholder.svg"
                alt="SignWise Preview"
                className="project-preview-img"
              />
            </div>
            <div className="project-body">
              <div className="project-badge-row">
                <span className="project-tag">Computer Vision &amp; Deep Learning</span>
              </div>
              <h3 className="project-title">SignWise</h3>
              <p className="project-desc">
                Real-time sign language recognition tool translating hand gestures to synthesized speech and text with high frame-rate edge rendering and WebSocket pipelines.
              </p>
              <div className="project-tech-tags">
                <span className="project-tech-pill">Python</span>
                <span className="project-tech-pill">PyTorch</span>
                <span className="project-tech-pill">React</span>
                <span className="project-tech-pill">WebSocket</span>
                <span className="project-tech-pill">FastAPI</span>
              </div>
              <div className="project-actions">
                <a
                  href="https://github.com/TusharGhosh56"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-btn"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                  </svg>
                  Repository
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Footer Section */}
      <section className="contact-section" id="contact">
        <div className="contact-card-container">
          <div className="contact-content">
            <span className="skills-subtitle">Get In Touch</span>
            <h2 className="contact-title">Let's connect &amp; build together</h2>
            <p className="contact-desc">
              Whether you want to discuss developer tooling, high-performance web systems, or potential engineering opportunities—my inbox is always open.
            </p>

            <div className="contact-actions">
              <a
                href="mailto:tusharghosh56@gmail.com"
                className="contact-btn-primary"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
                Say Hello
              </a>

              <a
                href="https://github.com/TusharGhosh56"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn-secondary"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                </svg>
                GitHub
              </a>

              <a
                href="/resume/Tushar_ghosh_resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-btn-secondary"
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

        <footer className="footer-bar">
          <p className="footer-copyright">
            &copy; {new Date().getFullYear()} Tushar Ghosh. Crafted with React, TypeScript &amp; Vanilla CSS.
          </p>
        </footer>
      </section>
    </div>
  )
}

export default App
