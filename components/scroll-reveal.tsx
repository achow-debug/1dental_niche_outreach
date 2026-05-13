"use client"

import { Children, cloneElement, isValidElement, useEffect, useRef, type CSSProperties, type ReactElement, type ReactNode } from "react"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  once?: boolean
  /** When true, applies a 60ms enter stagger to direct children (Task 15). */
  stagger?: boolean
}

export function ScrollReveal({ children, className = "", once = true, stagger = false }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-visible")
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          entry.target.classList.remove("is-visible")
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    )

    observer.observe(el)

    return () => {
      observer.unobserve(el)
    }
  }, [once])

  const staggeredChildren = stagger
    ? Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child
        const element = child as ReactElement<{ style?: CSSProperties }>
        const existingStyle = element.props.style ?? {}
        return cloneElement(element, {
          style: {
            ...existingStyle,
            ['--reveal-index' as string]: String(index),
          } as CSSProperties,
        })
      })
    : children

  return (
    <div
      ref={ref}
      data-stagger={stagger ? 'true' : undefined}
      className={`reveal-on-scroll ${className}`.trim()}
    >
      {staggeredChildren}
    </div>
  )
}
