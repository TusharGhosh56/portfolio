import { useEffect, useRef } from 'react'
import { useTheme } from '../hooks/useTheme'

export interface LiquidShaderProps {
  className?: string
  hasActiveReminders?: boolean
  hasUpcomingReminders?: boolean
  disableCenterDimming?: boolean
  interactive?: boolean
  speed?: number
}

export function LiquidShaderBackground({
  className = '',
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  disableCenterDimming = false,
  interactive = true,
  speed = 1.0,
}: LiquidShaderProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const isDarkRef = useRef(isDark)
  const propsRef = useRef({
    hasActiveReminders,
    hasUpcomingReminders,
    disableCenterDimming,
    speed,
    interactive,
  })

  // Keep refs updated for animation loop without re-initialization
  isDarkRef.current = isDark
  propsRef.current = {
    hasActiveReminders,
    hasUpcomingReminders,
    disableCenterDimming,
    speed,
    interactive,
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    })

    if (!gl) {
      console.warn('WebGL not supported for LiquidShaderBackground')
      return
    }

    const vsSource = `
      attribute vec2 position;
      varying vec2 vUv;
      void main() {
        vUv = (position + 1.0) * 0.5;
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

    const fsSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform vec2 iMouse;
      uniform float iScroll;
      uniform bool hasActiveReminders;
      uniform bool hasUpcomingReminders;
      uniform bool disableCenterDimming;
      uniform bool isDark;
      uniform float uContactFade;
      varying vec2 vUv;

      #define t iTime
      mat2 m(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }
      float map(vec3 p){
        p.xz *= m(t*0.4 + iScroll*1.1);
        p.xy *= m(t*0.3 + iScroll*0.7);
        vec3 q = p*2. + t;
        return length(p + vec3(sin(t*0.7))) * log(length(p)+1.0)
             + sin(q.x + sin(q.z + sin(q.y))) * 0.5 - 1.0;
      }

      void mainImage(out vec4 O, in vec2 fragCoord) {
        vec2 uv = fragCoord / min(iResolution.x, iResolution.y) - vec2(.9, .5);
        uv.x += .4;

        // Dynamic 3D Parallax: Liquid torus drifts gracefully across the viewport without sinking to the bottom
        uv.y += (iScroll - 0.5) * 0.18;
        uv.x += sin(iScroll * 3.14159) * 0.18;
        uv += (iMouse - 0.5) * 0.05;

        vec3 col = vec3(0.0);
        float edge = 0.0;
        float d = 2.5;

        // Ray-march
        for (int i = 0; i <= 5; i++) {
          vec3 p = vec3(0,0,5.) + normalize(vec3(uv, -1.)) * d;
          float rz = map(p);
          float f  = clamp((rz - map(p + 0.1)) * 0.5, -0.1, 1.0);

          vec3 base = hasActiveReminders
            ? vec3(0.05,0.2,0.5) + vec3(4.0,2.0,5.0)*f
            : hasUpcomingReminders
            ? vec3(0.05,0.3,0.1) + vec3(2.0,5.0,1.0)*f
            : vec3(0.1,0.3,0.4) + vec3(5.0,2.5,3.0)*f;

          float density = smoothstep(2.5, 0.0, rz);
          col = col * base + density * 0.7 * base;
          
          // Accumulate sharp surface curvature/crest for edge illumination
          edge = max(edge, smoothstep(0.35, 0.85, f) * density);

          d += min(rz, 1.0);
        }

        // Center dimming for content clarity
        float dist   = distance(fragCoord, iResolution*0.5);
        float radius = min(iResolution.x, iResolution.y) * 0.5;
        float dim    = disableCenterDimming
                     ? 1.0
                     : smoothstep(radius*0.3, radius*0.5, dist);

        // Smoothly fade out the fluid geometry before reaching the Contact section
        col *= uContactFade;
        edge *= uContactFade;

        // Ensure the gradient/fluid stops well above the bottom line of the section
        float bottomFade = smoothstep(0.02, 0.35, vUv.y);
        col *= bottomFade;
        edge *= bottomFade;

        if (!isDark) {
          // Clean modern light background #F8FAFC
          vec3 lightBg = vec3(0.973, 0.980, 0.988);

          // Total cloud presence (0 outside, ramps up inside)
          float cloudAlpha = clamp(length(col) * 0.28, 0.0, 1.0);

          // 1. Dominant Frosted-White Glass Body (85-90% of the entire fluid is crisp, luminous white)
          vec3 pureWhite = vec3(1.0, 1.0, 1.0);
          vec3 softShade = vec3(0.945, 0.960, 0.980);
          vec3 bodyColor = mix(pureWhite, softShade, clamp(col.r * 0.35, 0.0, 0.40));
          
          // Luminous white body opacity: clear 3D definition of the liquid fluid in white
          float bodyOpacity = smoothstep(0.02, 0.25, cloudAlpha) * 0.80;
          vec3 cloudBase    = mix(lightBg, bodyColor, bodyOpacity);

          // 2. Delicate, Subtle Blue Accent (only small parts of blue: thin perimeter fringe & specular crests)
          // Narrow boundary fringe that vanishes completely once inside the body (alpha > 0.09)
          float outerFringe = smoothstep(0.01, 0.035, cloudAlpha) * (1.0 - smoothstep(0.045, 0.095, cloudAlpha));

          // Faint specular wave crest accent (strictly in the outer transition layer)
          float crestAccent = smoothstep(0.50, 0.85, edge) * (1.0 - smoothstep(0.10, 0.35, cloudAlpha)) * 0.20;

          // Combined subtle blue accent: gentle touch (max 0.35), keeping white completely dominant
          float blueAccent = clamp(outerFringe * 0.35 + crestAccent, 0.0, 0.35);

          // Refined pastel sky-blue / airy cyan palette
          vec3 skyAccent  = vec3(0.38, 0.70, 0.97); // Soft airy sky-blue
          vec3 cyanAccent = vec3(0.55, 0.82, 0.99); // Delicate cyan highlight
          vec3 accentBlue = mix(skyAccent, cyanAccent, clamp(col.r * 0.6, 0.0, 1.0));

          // Mix the subtle blue accent strictly onto the thin edge fringe
          vec3 finalColor = mix(cloudBase, accentBlue, blueAccent);
          
          O = vec4(finalColor, 1.0);
        } else {
          // Exact match for site dark background #0B0F19 (11, 15, 25)
          vec3 darkBg = vec3(0.04314, 0.05882, 0.09804);
          float glowFactor = disableCenterDimming ? 1.0 : mix(0.45, 1.0, dim);
          vec3 finalColor = darkBg + col * glowFactor;
          O = vec4(finalColor, 1.0);
        }
      }

      void main() {
        mainImage(gl_FragColor, vUv * iResolution);
      }
    `

    function createShader(type: number, source: string) {
      if (!gl) return null
      const shader = gl.createShader(type)
      if (!shader) return null
      gl.shaderSource(shader, source)
      gl.compileShader(shader)
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn('Shader compile error:', gl.getShaderInfoLog(shader))
        gl.deleteShader(shader)
        return null
      }
      return shader
    }

    const vs = createShader(gl.VERTEX_SHADER, vsSource)
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource)
    if (!vs || !fs) return

    const program = gl.createProgram()
    if (!program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program))
      return
    }

    gl.useProgram(program)

    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
         1, -1,
        -1,  1,
        -1,  1,
         1, -1,
         1,  1,
      ]),
      gl.STATIC_DRAW
    )

    const posAttr = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(posAttr)
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'iResolution')
    const uTime = gl.getUniformLocation(program, 'iTime')
    const uMouse = gl.getUniformLocation(program, 'iMouse')
    const uScroll = gl.getUniformLocation(program, 'iScroll')
    const uContactFade = gl.getUniformLocation(program, 'uContactFade')
    const uActive = gl.getUniformLocation(program, 'hasActiveReminders')
    const uUpcoming = gl.getUniformLocation(program, 'hasUpcomingReminders')
    const uDim = gl.getUniformLocation(program, 'disableCenterDimming')
    const uDark = gl.getUniformLocation(program, 'isDark')

    let width = 0
    let height = 0
    let maxScroll = 1

    const handleResize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      // Cap devicePixelRatio at 1.5 to guarantee solid 60-120fps on 4k/Retina screens
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      width = Math.round(w * dpr)
      height = Math.round(h * dpr)
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
      maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    handleResize()

    // Smooth Parallax State Tracking
    let targetScroll = 0
    let currentScroll = 0
    let targetMouseX = 0.5
    let targetMouseY = 0.5
    let currentMouseX = 0.5
    let currentMouseY = 0.5
    let targetContactFade = 1.0
    let currentContactFade = 1.0
    let isHidden = false

    const updateFade = () => {
      targetScroll = Math.max(0, Math.min(1, window.scrollY / maxScroll))

      // 1. Live DOM position check: completely dissolve well BEFORE Contact enters viewport
      let fade = 1.0
      const contactEl = document.getElementById('contact')
      const vh = window.innerHeight

      if (contactEl) {
        const rect = contactEl.getBoundingClientRect()
        // Contact top enters viewport when rect.top == vh.
        // fadeEnd is 40% of screen height ABOVE contact entering (rect.top == 1.40 * vh).
        const fadeEnd = vh * 1.40
        const fadeStart = vh * 2.25

        if (rect.top <= fadeEnd) {
          fade = 0.0
        } else if (rect.top >= fadeStart) {
          fade = 1.0
        } else {
          fade = (rect.top - fadeEnd) / (fadeStart - fadeEnd)
        }
      }

      // 2. Secondary fallback near page end
      if (targetScroll >= 0.80) {
        const scrollFade = Math.max(0, Math.min(1, (0.88 - targetScroll) / 0.08))
        fade = Math.min(fade, scrollFade)
      }

      targetContactFade = Math.max(0, Math.min(1, fade))

      // Direct canvas styling on RAF
      if (currentContactFade <= 0.002 && targetContactFade <= 0.002) {
        canvas.style.opacity = '0'
        canvas.style.visibility = 'hidden'
        isHidden = true
      } else {
        canvas.style.opacity = currentContactFade.toFixed(3)
        canvas.style.visibility = 'visible'
        isHidden = false
      }
    }
    window.addEventListener('scroll', updateFade, { passive: true })
    updateFade()

    const handleMouseMove = (e: MouseEvent) => {
      if (!propsRef.current.interactive) return
      targetMouseX = e.clientX / window.innerWidth
      targetMouseY = e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })

    let animId: number
    let isTabVisible = true
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const startTime = performance.now()

    const render = (now: number) => {
      updateFade()

      if (isTabVisible && gl) {
        currentScroll += (targetScroll - currentScroll) * 0.08
        currentMouseX += (targetMouseX - currentMouseX) * 0.06
        currentMouseY += (targetMouseY - currentMouseY) * 0.06
        currentContactFade += (targetContactFade - currentContactFade) * 0.12

        if (!isHidden) {
          const elapsed = ((now - startTime) * 0.001) * propsRef.current.speed

          gl.uniform2f(uRes, width, height)
          gl.uniform1f(uTime, elapsed)
          gl.uniform2f(uMouse, currentMouseX, currentMouseY)
          gl.uniform1f(uScroll, currentScroll)
          gl.uniform1f(uContactFade, currentContactFade)
          gl.uniform1i(uActive, propsRef.current.hasActiveReminders ? 1 : 0)
          gl.uniform1i(uUpcoming, propsRef.current.hasUpcomingReminders ? 1 : 0)
          gl.uniform1i(uDim, propsRef.current.disableCenterDimming ? 1 : 0)
          gl.uniform1i(uDark, isDarkRef.current ? 1 : 0)

          gl.drawArrays(gl.TRIANGLES, 0, 6)
        } else {
          // Clear WebGL buffer to clean background color so zero stale pixels linger
          if (isDarkRef.current) {
            gl.clearColor(0.04314, 0.05882, 0.09804, 1.0)
          } else {
            gl.clearColor(0.975, 0.982, 0.995, 1.0)
          }
          gl.clear(gl.COLOR_BUFFER_BIT)
        }
      }
      animId = requestAnimationFrame(render)
    }
    animId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', updateFade)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (gl) {
        gl.deleteProgram(program)
        gl.deleteShader(vs)
        gl.deleteShader(fs)
        gl.deleteBuffer(posBuffer)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`liquid-shader-canvas ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

export const InteractiveNebulaShader = LiquidShaderBackground
export default LiquidShaderBackground
