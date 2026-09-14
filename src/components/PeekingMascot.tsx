import type { CSSProperties } from 'react'

export interface PeekingMascotProps {
  className?: string
  style?: CSSProperties
}

export function PeekingMascot({
  className = '',
  style
}: PeekingMascotProps) {
  return (
    <div
      className={`peeking-mascot-wrapper ${className}`}
      style={style}
      aria-hidden="true"
    >
      <div className="peeking-mascot-inner">
        <svg
        className="peeking-mascot-svg"
        width="48"
        height="48"
        viewBox="0 0 52 52"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ambient Drop Shadow Filter */}
        <defs>
          <filter id="mascotShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#0F172A" floodOpacity="0.14" />
          </filter>
        </defs>

        {/* Floating Sparkles */}
        <g className="mascot-sparkles">
          {/* Top-left Sparkle */}
          <path
            className="sparkle sparkle-left"
            d="M12 11C12 8.5 13.5 7 16 7C13.5 7 12 5.5 12 3C12 5.5 10.5 7 8 7C10.5 7 12 8.5 12 11Z"
            fill="#FFA726"
          />
          {/* Top-right Sparkle */}
          <path
            className="sparkle sparkle-right"
            d="M41 12C41 9.2 42.8 7.5 45.5 7.5C42.8 7.5 41 5.8 41 3C41 5.8 39.2 7.5 36.5 7.5C39.2 7.5 41 9.2 41 12Z"
            fill="#FF9800"
          />
          {/* Lower-right Sparkle */}
          <path
            className="sparkle sparkle-sub"
            d="M45 20C45 18.5 46 17.5 47.5 17.5C46 17.5 45 16.5 45 15C45 16.5 44 17.5 42.5 17.5C44 17.5 45 18.5 45 20Z"
            fill="#FFB74D"
          />
        </g>

        {/* Mascot Character Group (Head + Diamond Paw/Body) */}
        <g className="mascot-character" filter="url(#mascotShadow)">
          {/* Diamond Paw / Body resting on the button rim */}
          <rect
            x="19"
            y="32"
            width="12"
            height="12"
            rx="2.5"
            transform="rotate(45 19 32)"
            fill="#FFFFFF"
          />

          {/* Head */}
          <circle cx="26" cy="24" r="14.5" fill="#FFFFFF" />

          {/* Eyes */}
          <g className="mascot-eyes">
            <circle cx="21" cy="23" r="2.6" fill="#0F172A" />
            <circle cx="31" cy="23" r="2.6" fill="#0F172A" />
            {/* Catchlights */}
            <circle cx="21.9" cy="22.1" r="0.8" fill="#FFFFFF" />
            <circle cx="31.9" cy="22.1" r="0.8" fill="#FFFFFF" />
          </g>

          {/* Cheeks (Blush) */}
          <ellipse cx="17.2" cy="26.5" rx="3.2" ry="2.2" fill="#FF85A2" opacity="0.9" />
          <ellipse cx="34.8" cy="26.5" rx="3.2" ry="2.2" fill="#FF85A2" opacity="0.9" />

          {/* Smile */}
          <path
            className="mascot-smile"
            d="M21 27 C21.5 31.5 30.5 31.5 31 27"
            stroke="#0F172A"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="#0F172A"
          />
        </g>
      </svg>
      </div>
    </div>
  )
}

export default PeekingMascot
