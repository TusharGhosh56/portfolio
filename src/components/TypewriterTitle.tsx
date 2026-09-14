import { useState, useEffect } from 'react'

interface TypewriterSentence {
  prefix: string
  highlight: string
}

const sentences: TypewriterSentence[] = [
  {
    prefix: "Hi, I'm ",
    highlight: "Tushar Ghosh.",
  },
  {
    prefix: 'Welcome to my ',
    highlight: 'portfolio site.',
  },
]

export function TypewriterTitle() {
  const [itemIndex, setItemIndex] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    const current = sentences[itemIndex]
    const fullLength = current.prefix.length + current.highlight.length

    if (!isDeleting && charCount < fullLength) {
      // Natural typing cadence with slight realistic variation
      const delay = 75 + Math.random() * 35
      timer = setTimeout(() => {
        setCharCount((prev) => prev + 1)
      }, delay)
    } else if (!isDeleting && charCount === fullLength) {
      // Pause so user can read the complete sentence
      timer = setTimeout(() => {
        setIsDeleting(true)
      }, 2200)
    } else if (isDeleting && charCount > 0) {
      // Fast backspacing
      timer = setTimeout(() => {
        setCharCount((prev) => prev - 1)
      }, 38)
    } else if (isDeleting && charCount === 0) {
      // Brief pause before switching to the next sentence
      timer = setTimeout(() => {
        setIsDeleting(false)
        setItemIndex((prev) => (prev + 1) % sentences.length)
      }, 450)
    }

    return () => clearTimeout(timer)
  }, [charCount, isDeleting, itemIndex])

  const current = sentences[itemIndex]
  const prefixLength = current.prefix.length

  const prefixVisible = current.prefix.slice(0, Math.min(charCount, prefixLength))
  const highlightVisible =
    charCount > prefixLength
      ? current.highlight.slice(0, charCount - prefixLength)
      : ''

  const accessibleText = `${current.prefix}${current.highlight}`

  return (
    <h1 className="hero-title" aria-label={accessibleText}>
      <span className="typewriter-text" aria-hidden="true">
        <span>{prefixVisible}</span>
        {highlightVisible && <span className="highlight">{highlightVisible}</span>}
      </span>
      <span className="typewriter-cursor" aria-hidden="true" />
    </h1>
  )
}

export default TypewriterTitle
