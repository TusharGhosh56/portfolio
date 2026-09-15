import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import CisogenieLogo from '../assets/logos/CisogenieLogo'
import aplydLogo from '../assets/logos/aplyd-wordmark-white.svg'

gsap.registerPlugin(ScrollTrigger)

if (typeof window !== 'undefined') {
  ;(window as any).__ScrollTrigger = ScrollTrigger
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export function Experience({ id = 'experience' }: { id?: string }) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const card1Ref = useRef<HTMLDivElement | null>(null)
  const card2Ref = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !card1Ref.current || !card2Ref.current) {
      return
    }

    const reducedMotion = prefersReducedMotion()

    const ctx = gsap.context(() => {
      const card1 = card1Ref.current
      const card2 = card2Ref.current
      const section = sectionRef.current

      if (!card1 || !card2 || !section) return

      if (reducedMotion) {
        gsap.set(card2, { y: 0, yPercent: 0, rotation: 0, scale: 1 })
        return
      }

      // Initial card states
      gsap.set(card1, {
        transformOrigin: '50% 50%',
        scale: 1,
        y: 0,
        yPercent: 0,
        opacity: 1,
        filter: 'brightness(1)'
      })

      // Calculate distance so Card 2 sits fully below the bottom of the stage/page, accounting for the 5.5deg rotation tilt
      const getInitialY = () => {
        const stage = section.querySelector('.experience-sticky-stage') as HTMLElement | null
        const stageHeight = stage ? stage.clientHeight : (window.innerHeight - 68)
        const cardTop = card2.offsetTop || 0
        return Math.max(stageHeight - cardTop + 240, (card2.offsetHeight || 600) + 140)
      }

      gsap.set(card2, {
        y: getInitialY,
        yPercent: 0,
        rotation: 5.5,
        scale: 0.94,
        transformOrigin: '50% 100%'
      })

      // Native sticky stage animation timeline scrubbed against section scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 68px',
          end: 'bottom bottom',
          scrub: 0.45,
          invalidateOnRefresh: true
        }
      })

      // Phase 1 (0.0 to 0.15): Dwell on Card 1 so the user comfortably sees CISOGenie in full focus
      // Phase 2 (0.15 to 0.85): Card 2 climbs smoothly up & levels out, Card 1 recedes into depth
      tl.to(
        card2,
        {
          y: 0,
          rotation: 0,
          scale: 1,
          ease: 'power2.out',
          duration: 0.70
        },
        0.15
      )

      // Card 1 subtly compresses into background with cinematic depth
      tl.to(
        card1,
        {
          scale: 0.93,
          y: -18,
          opacity: 0.38,
          filter: 'brightness(0.6)',
          ease: 'power2.out',
          duration: 0.70
        },
        0.15
      )

      // Phase 3 (0.85 to 1.25): Dwell on Card 2 so the user has ample scroll room to read APLYD before unpinning
      tl.set({}, {}, 1.25)
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="experience-scroll-track" id={id} ref={sectionRef}>
      {/* Sticky Full-Page Viewport Stage */}
      <div className="experience-sticky-stage">
        {/* Section Header: Matches Skills & Tech Stack reference */}
        <div className="experience-header-row">
          <div className="skills-section-header">
            <span className="skills-subtitle">Career Journey</span>
            <h2 className="skills-title" style={{ marginTop: 2 }}>Work Experience</h2>
          </div>
        </div>

        {/* Full-Page Cinematic Card Deck */}
        <div className="experience-deck-viewport">
          {/* Card 1: CISOGenie (Vibrant Orange / Coral Theme) */}
          <div
            className="experience-cinematic-card card-theme-orange"
            ref={card1Ref}
            style={{ zIndex: 1 }}
          >
            <div className="cinematic-card-inner">
              {/* Header Row */}
              <div className="cinematic-card-header">
                <span className="cinematic-index-tag">01 — ENTERPRISE SECURITY &amp; COMPLIANCE</span>
                <div className="cinematic-meta-badges">
                  <span className="cinematic-badge">June 2025 – June 2026</span>
                  <span className="cinematic-badge">Bangalore, IN</span>
                  <span className="cinematic-badge highlight-badge">Full-time</span>
                </div>
              </div>

              {/* Main Content Hero Row (Title & Statement on left, Logo on right) */}
              <div className="cinematic-hero-row">
                <div className="cinematic-hero-left">
                  <div className="cinematic-title-block">
                    <h3 className="cinematic-company-title">CISOGENIE</h3>
                    <h4 className="cinematic-role-subtitle">SOFTWARE DEVELOPER</h4>
                  </div>
                  <p className="cinematic-statement">
                    Revamped enterprise compliance dashboards across 8+ frontend modules with modern bento grid layouts, automated ISO 27001 &amp; SOC 2 assessment workflows, and engineered real-time Business Impact Analysis systems.
                  </p>
                </div>

                <div className="cinematic-hero-right">
                  <div className="cinematic-logo-showcase" title="CISOGenie">
                    <CisogenieLogo
                      className="cinematic-brand-logo-featured cisogenie-featured-logo"
                      aria-label="CISOGenie"
                    />
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="cinematic-highlights-grid">
                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="3" rx="2"/>
                      <path d="M3 9h18M9 21V9"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Enterprise Dashboard Revamp</h5>
                    <p className="highlight-box-desc">
                      Modernized 8+ core modules introducing bento grid patterns for enhanced information density and clarity.
                    </p>
                  </div>
                </div>

                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Compliance Readiness Engine</h5>
                    <p className="highlight-box-desc">
                      Automated assessment pipelines supporting ISO 27001, SOC 2, PDF report generation, and enterprise outputs.
                    </p>
                  </div>
                </div>

                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Business Impact Analysis (BIA)</h5>
                    <p className="highlight-box-desc">
                      Built dynamic risk mapping across system, people, and process entities with real-time tracking tables.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Tech Stack Pills */}
              <div className="cinematic-card-footer">
                <span className="footer-stack-label">Core Tech Stack:</span>
                <div className="cinematic-pills-row">
                  <span className="cinematic-pill">React</span>
                  <span className="cinematic-pill">TypeScript</span>
                  <span className="cinematic-pill">Bento Grid UI</span>
                  <span className="cinematic-pill">ISO 27001 / SOC 2</span>
                  <span className="cinematic-pill">PDF Reporting</span>
                  <span className="cinematic-pill">BIA Risk Systems</span>
                  <span className="cinematic-pill">GitLab Agile</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: APLYD (Deep Obsidian Black Theme - Stacks from bottom on scroll) */}
          <div
            className="experience-cinematic-card card-theme-dark"
            ref={card2Ref}
            style={{ zIndex: 2 }}
          >
            <div className="cinematic-card-inner">
              {/* Header Row */}
              <div className="cinematic-card-header">
                <span className="cinematic-index-tag">02 — HIGH-PERFORMANCE WEB &amp; SYSTEMS</span>
                <div className="cinematic-meta-badges">
                  <span className="cinematic-badge">July 2026– August 2026</span>
                  <span className="cinematic-badge">Remote / Global</span>
                  <span className="cinematic-badge highlight-badge-dark">Freelance</span>
                </div>
              </div>

              {/* Main Content Hero Row (Title & Statement on left, Logo on right) */}
              <div className="cinematic-hero-row">
                <div className="cinematic-hero-left">
                  <div className="cinematic-title-block">
                    <h3 className="cinematic-company-title">APLYD</h3>
                    <h4 className="cinematic-role-subtitle">WEB &amp; FRONTEND ENGINEER</h4>
                  </div>
                  <p className="cinematic-statement">
                    Architected a high-performance static platform using Astro &amp; TypeScript with Island Architecture across 19+ routes, engineering Canvas-based footprint telemetry, ambient motion, and enterprise technical SEO.
                  </p>
                </div>

                <div className="cinematic-hero-right">
                  <div className="cinematic-logo-showcase" title="APLYD — By Athena Infonomics">
                    <img
                      src={aplydLogo}
                      alt="APLYD — By Athena Infonomics"
                      className="cinematic-brand-logo-featured aplyd-featured-logo"
                    />
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="cinematic-highlights-grid">
                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                      <polyline points="2 17 12 22 22 17"/>
                      <polyline points="2 12 12 17 22 12"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Astro Island Architecture</h5>
                    <p className="highlight-box-desc">
                      Engineered 19+ static routes with selective hydration, minimizing client-side JS for instant initial loads.
                    </p>
                  </div>
                </div>

                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                      <path d="M2 12h20"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Canvas Telemetry &amp; Motion</h5>
                    <p className="highlight-box-desc">
                      Built interactive Canvas global footprint maps, ambient particle animations, and branded SVG diagrams.
                    </p>
                  </div>
                </div>

                <div className="cinematic-highlight-box">
                  <div className="highlight-icon-wrap">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <div>
                    <h5 className="highlight-box-title">Technical SEO &amp; Schema.org</h5>
                    <p className="highlight-box-desc">
                      Designed JSON-LD @graph schemas, dynamic breadcrumbs, canonical routing, and multi-sector taxonomy filtering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Footer: Tech Stack Pills */}
              <div className="cinematic-card-footer">
                <span className="footer-stack-label">Core Tech Stack:</span>
                <div className="cinematic-pills-row">
                  <span className="cinematic-pill">Astro</span>
                  <span className="cinematic-pill">TypeScript</span>
                  <span className="cinematic-pill">Canvas API</span>
                  <span className="cinematic-pill">Islands Architecture</span>
                  <span className="cinematic-pill">Data Visualizations</span>
                  <span className="cinematic-pill">Schema.org JSON-LD</span>
                  <span className="cinematic-pill">Technical SEO</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
