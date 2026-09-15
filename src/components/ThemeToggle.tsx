import { useTheme, type TransitionDirection } from '../hooks/useTheme'

export type HorizontalThemeWipeToggleProps = {
  className?: string
  direction?: TransitionDirection
}

export function ThemeToggle({
  className = '',
  direction = 'left',
}: HorizontalThemeWipeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`day-night-toggle ${isDark ? 'is-dark' : 'is-light'} ${className}`.trim()}
      onClick={() => toggleTheme(direction)}
      aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      aria-pressed={isDark}
      role="switch"
      aria-checked={isDark}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {/* Background Track with Atmosphere Rings */}
      <div className="toggle-track">
        {/* Layered concentric atmosphere rings */}
        <div className="atmosphere-rings">
          <span className="ring ring-1" />
          <span className="ring ring-2" />
          <span className="ring ring-3" />
        </div>

        {/* Day Clouds Cluster (visible in light mode) */}
        <div className="clouds-cluster" aria-hidden="true">
          <span className="cloud-bubble cloud-back-1" />
          <span className="cloud-bubble cloud-back-2" />
          <span className="cloud-bubble cloud-main-1" />
          <span className="cloud-bubble cloud-main-2" />
          <span className="cloud-bubble cloud-main-3" />
          <span className="cloud-bubble cloud-main-4" />
        </div>

        {/* Night Stars & Big Dipper Constellation (visible in dark mode) */}
        <div className="stars-cluster" aria-hidden="true">
          {/* Constellation stars (Ursa Major / Big Dipper) */}
          <span className="star-dot star-dipper-1" />
          <span className="star-dot star-dipper-2" />
          <span className="star-dot star-dipper-3" />
          <span className="star-dot star-dipper-4" />
          <span className="star-dot star-dipper-5" />
          <span className="star-dot star-dipper-6" />
          <span className="star-dot star-dipper-7" />
          {/* Sparkling 4-point stars */}
          <svg className="star-cross star-cross-1" viewBox="0 0 10 10">
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#FFFFFF" />
          </svg>
          <svg className="star-cross star-cross-2" viewBox="0 0 10 10">
            <path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Sliding Orb: Sun (Day) <-> Moon (Night) */}
      <div className="toggle-orb">
        {/* Moon Craters (visible on moon) */}
        <div className="crater-cluster" aria-hidden="true">
          <span className="crater crater-large" />
          <span className="crater crater-medium" />
          <span className="crater crater-small" />
        </div>
      </div>
    </button>
  )
}

export const HorizontalThemeWipeToggle = ThemeToggle

