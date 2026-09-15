import { ThemeToggle } from './ThemeToggle'

export function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-inner">
        {/* Left: Signature Brand Name */}
        <a href="#about" className="navbar-brand" aria-label="Tushar Ghosh - Back to top">
          <img
            src="/assets/signature-cropped.png"
            alt="Tushar Ghosh"
            className="navbar-signature"
          />
        </a>

        {/* Right: Navigation Links & Theme Toggle */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <a href="#about" className="nav-btn nav-btn-ghost">
            About Me
          </a>
          <a href="#experience" className="nav-btn nav-btn-ghost">
            Experience
          </a>
          <a href="#projects" className="nav-btn nav-btn-ghost">
            Projects
          </a>
          <a href="#contact" className="nav-btn nav-btn-primary">
            Contact
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
