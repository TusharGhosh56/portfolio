import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ProjectLink {
  href: string
  label: string
  isExternal?: boolean
}

export interface StickyProject {
  id: string
  indexBadge: string
  category: string
  heading: string
  tagline: string
  description: string
  features: string[]
  techStack: string[]
  links: ProjectLink[]
  image: string
  alt: string
}

const defaultProjects: StickyProject[] = [
  {
    id: 'mranalysis',
    indexBadge: '01 / FEATURED PROJECT',
    category: 'Git & Code Telemetry',
    heading: 'MRanalysis',
    tagline: 'Git analytics for engineering teams.',
    description:
      'Analyze commit velocity, bus factor risk, and contributor ownership across any public GitHub repository with high-throughput repository telemetry and cadence metrics.',
    features: [
      'Real-time commit cadence & velocity analytics across repositories',
      'Bus factor risk calculation & module ownership distribution',
      'Automated repository health reports & contributor trends'
    ],
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis'],
    links: [
      {
        href: 'https://mr-analysis-kohl.vercel.app/',
        label: 'Visit',
        isExternal: true
      }
    ],
    image: '/assets/projects/mranalysis.png',
    alt: 'MRanalysis Git Analytics Interface'
  },
  {
    id: 'architectai',
    indexBadge: '02 / FEATURED PROJECT',
    category: 'AI & AST Architecture',
    heading: 'ArchitectAI',
    tagline: 'Map the unmapped. Decode circular traps.',
    description:
      'Upload any repository archive. ArchitectAI analyzes your Python and TypeScript Abstract Syntax Trees, ranks blast-radius gravity, flags circular dependency traps, and lets you interrogate your system with zero-hallucination code grounding.',
    features: [
      'AST-based dependency graph & blast-radius gravity ranking',
      'Automated circular dependency trap detection across services',
      'Zero-hallucination codebase interrogation with AST grounding'
    ],
    techStack: ['Python', 'TypeScript', 'FastAPI', 'React', 'LangGraph'],
    links: [
      {
        href: 'https://architecture-ai-blush.vercel.app/',
        label: 'Visit',
        isExternal: true
      }
    ],
    image: '/assets/projects/architectai.png',
    alt: 'ArchitectAI Codebase Analysis Platform'
  },
  {
    id: 'signwise',
    indexBadge: '03 / FEATURED PROJECT',
    category: 'Legal AI & Clause Analysis',
    heading: 'Signwise',
    tagline: 'Know what you sign. Before the ink dries.',
    description:
      'Contracts contain clauses you can safely ignore — and restrictive traps that will cost you. Signwise spots hidden liabilities, non-compete traps, and notice obligations in seconds with AI clause inspection.',
    features: [
      'Deep contract clause inspection & liability classification',
      'Plain-English verdicts on restrictive notice and non-compete terms',
      'Actionable counter-proposal pushback recommendations'
    ],
    techStack: ['Python', 'FastAPI', 'React', 'TypeScript', 'LLM Reasoning'],
    links: [
      {
        href: 'https://signwise-rosy.vercel.app/',
        label: 'Visit',
        isExternal: true
      }
    ],
    image: '/assets/projects/signwise.png',
    alt: 'Signwise Clause Inspector Interface'
  }
]

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

export interface StickyProjectsProps {
  projects?: StickyProject[]
  id?: string
}

export function StickyProjects({
  projects = defaultProjects,
  id = 'projects'
}: StickyProjectsProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stickyRef = useRef<HTMLDivElement | null>(null)
  const contentRefsRef = useRef<(HTMLDivElement | null)[]>([])
  const imageRefsRef = useRef<(HTMLDivElement | null)[]>([])
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const goToProject = useCallback(
    (targetIndex: number) => {
      const total = projects.length
      if (targetIndex < 0 || targetIndex >= total) return

      setActiveIndex(targetIndex)

      const st = scrollTriggerRef.current
      if (st) {
        const progress = targetIndex / (total - 1)
        const targetY = st.start + progress * (st.end - st.start)
        const adjustedY =
          targetIndex === total - 1 ? targetY - 2 : targetIndex === 0 ? targetY + 2 : targetY

        window.scrollTo({
          top: adjustedY,
          behavior: 'smooth'
        })
      } else if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop
        const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight
        const targetY = sectionTop + (targetIndex / (total - 1)) * sectionHeight

        window.scrollTo({
          top: targetY,
          behavior: 'smooth'
        })
      }
    },
    [projects.length]
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const isVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2
      if (!isVisible) return

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (activeIndex < projects.length - 1) {
          e.preventDefault()
          goToProject(activeIndex + 1)
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (activeIndex > 0) {
          e.preventDefault()
          goToProject(activeIndex - 1)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, goToProject, projects.length])

  useLayoutEffect(() => {
    if (!sectionRef.current || !stickyRef.current || !projects.length) {
      return
    }

    const reducedMotion = prefersReducedMotion()
    const stepGap = 2
    const contentTransitionDuration = 0.8
    const contentDelay = 0.25
    const contentEnterYPercent = 10
    const contentExitYPercent = -10

    const context = gsap.context(() => {
      const contents = contentRefsRef.current
      const images = imageRefsRef.current

      // Initial state setup:
      // Left content panels: only index 0 is visible
      contents.forEach((content, index) => {
        if (!content) return
        gsap.set(content, {
          autoAlpha: index === 0 ? 1 : 0,
          yPercent: index === 0 ? 0 : contentEnterYPercent,
          zIndex: projects.length - index
        })
      })

      // Right image layers:
      // Only index 0 starts visible; next images start hidden (autoAlpha: 0) and activate on scroll.
      images.forEach((image, index) => {
        if (!image) return
        gsap.set(image, {
          autoAlpha: index === 0 ? 1 : 0,
          zIndex: projects.length - index,
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1,
          transformOrigin: 'center center'
        })
      })

      // Timeline connected to ScrollTrigger
      const totalTimelineDuration = Math.max(1, (projects.length - 1) * stepGap)
      const snapValues =
        projects.length > 1
          ? Array.from({ length: projects.length }, (_, index) => index / (projects.length - 1))
          : [0]

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          snap:
            projects.length > 1
              ? {
                  snapTo: snapValues,
                  duration: { min: 0.25, max: 0.5 },
                  ease: 'power2.inOut',
                  delay: 0,
                  inertia: false
                }
              : undefined,
          onUpdate: (self) => {
            const newIndex = Math.min(
              projects.length - 1,
              Math.max(0, Math.round(self.progress * (projects.length - 1)))
            )
            setActiveIndex(newIndex)
          }
        }
      })

      scrollTriggerRef.current = timeline.scrollTrigger || null

      projects.forEach((_, index) => {
        if (index === projects.length - 1) return

        const currentContent = contents[index]
        const nextContent = contents[index + 1]
        const currentImage = images[index]
        const nextImage = images[index + 1]
        const stepStart = index * stepGap
        const nextContentStart = stepStart + contentTransitionDuration + contentDelay

        if (currentContent && nextContent) {
          timeline
            .to(
              currentContent,
              {
                autoAlpha: 0,
                yPercent: contentExitYPercent,
                duration: contentTransitionDuration,
                ease: 'power2.inOut'
              },
              stepStart
            )
            .fromTo(
              nextContent,
              {
                autoAlpha: 0,
                yPercent: contentEnterYPercent
              },
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: contentTransitionDuration,
                ease: 'power2.inOut'
              },
              nextContentStart
            )
        }

        if (currentImage) {
          // Ensure next image is active and ready underneath current image before current wipes away
          if (nextImage) {
            timeline.set(nextImage, { autoAlpha: 1 }, stepStart)
          }

          timeline
            .to(
              currentImage,
              reducedMotion
                ? { autoAlpha: 0, duration: stepGap, ease: 'none' }
                : {
                    clipPath: 'inset(0% 0% 100% 0%)',
                    duration: stepGap,
                    ease: 'none'
                  },
              stepStart
            )
            .set(currentImage, { autoAlpha: 0 }, stepStart + stepGap)
        }
      })

      timeline.duration(totalTimelineDuration)
      ScrollTrigger.refresh()
    }, sectionRef)

    return () => context.revert()
  }, [projects])

  if (!projects.length) return null

  return (
    <section
      ref={sectionRef}
      id={id}
      className="sticky-projects-container"
      style={{
        height: `${projects.length * 100}vh`
      }}
    >

      {/* Viewport-Pinned Stage */}
      <div ref={stickyRef} className="sticky-projects-stage">
        {/* Left Column: Project Content Panels */}
        <div className="sticky-projects-left">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={(el) => {
                contentRefsRef.current[index] = el
              }}
              className="sticky-project-panel"
            >
              {/* Badge & Category */}
              <div className="sticky-project-badge-row">
                <span className="sticky-project-badge">{project.indexBadge}</span>
                <span className="sticky-project-category">{project.category}</span>
              </div>

              {/* Title & Tagline */}
              <h3 className="sticky-project-title">
                {project.links[0] ? (
                  <a
                    href={project.links[0].href}
                    target={project.links[0].isExternal ? '_blank' : undefined}
                    rel={project.links[0].isExternal ? 'noopener noreferrer' : undefined}
                    className="sticky-project-title-link"
                  >
                    {project.heading}
                  </a>
                ) : (
                  project.heading
                )}
              </h3>
              <p className="sticky-project-tagline">{project.tagline}</p>

              {/* Description */}
              <p className="sticky-project-desc">{project.description}</p>

              {/* Feature Highlights */}
              {project.features.length > 0 && (
                <ul className="sticky-project-feature-list">
                  {project.features.map((feat, i) => (
                    <li key={i} className="sticky-project-feature-item">
                      <svg
                        className="feature-bullet-icon"
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Tech Stack Pills */}
              <div className="sticky-project-tech-tags">
                {project.techStack.map((tech, i) => (
                  <span key={i} className="sticky-tech-pill">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Action Links */}
              <div className="sticky-project-actions">
                {project.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target={link.isExternal ? '_blank' : undefined}
                    rel={link.isExternal ? 'noopener noreferrer' : undefined}
                    className="sticky-project-btn"
                  >
                    <span>{link.label}</span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Visual Stage (Scales & Clips) */}
        <div className="sticky-projects-right">
          <div className="sticky-visual-viewport">
            {projects.map((project, index) => {
              const primaryLink = project.links[0]
              return (
                <div
                  key={`img-${project.id}`}
                  ref={(el) => {
                    imageRefsRef.current[index] = el
                  }}
                  className="sticky-image-layer"
                >
                  {primaryLink ? (
                    <a
                      href={primaryLink.href}
                      target={primaryLink.isExternal ? '_blank' : undefined}
                      rel={primaryLink.isExternal ? 'noopener noreferrer' : undefined}
                      className="sticky-image-link"
                      aria-label={`Visit ${project.heading}`}
                    >
                      <img
                        src={project.image}
                        alt={project.alt}
                        className="sticky-project-img"
                      />
                    </a>
                  ) : (
                    <img
                      src={project.image}
                      alt={project.alt}
                      className="sticky-project-img"
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Middle Floating Navigation Controls */}
        <div className="sticky-projects-controls" role="group" aria-label="Project Navigation Controls">
          <button
            type="button"
            className="sticky-ctrl-btn"
            onClick={() => goToProject(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous project (scroll up)"
            title="Previous project (←)"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="sticky-ctrl-dots">
            {projects.map((p, idx) => (
              <button
                key={p.id}
                type="button"
                className={`sticky-ctrl-dot ${idx === activeIndex ? 'active' : ''}`}
                onClick={() => goToProject(idx)}
                aria-label={`Jump to ${p.heading}`}
                title={`${p.heading} (0${idx + 1})`}
              />
            ))}
          </div>

          <button
            type="button"
            className="sticky-ctrl-btn"
            onClick={() => goToProject(activeIndex + 1)}
            disabled={activeIndex === projects.length - 1}
            aria-label="Next project (scroll down)"
            title="Next project (→)"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}

export default StickyProjects
