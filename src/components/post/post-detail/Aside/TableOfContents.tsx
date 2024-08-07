'use client'
import { throttle } from 'lodash-es'
import { useEffect, useState } from 'react'

import { type TOCSection } from '@/components/mdx'

export default function TableOfContent({
  toc,
  className,
  ...props
}: {
  toc: TOCSection[]
  className?: string
}) {
  const { currentSectionSlug } = useTocScroll(toc)

  return (
    <ul
      {...props}
      className={`space-y-2.5 font-sans lg:block md:hidden ${className}`}
    >
      {toc.map((section, i) => {
        return (
          <li key={i} className="flex">
            <a
              className={`
              link  ${
                currentSectionSlug === section.slug
                  ? 'text-orange-600'
                  : 'text-slate-500'
              } 
              toc-text
            `}
              href={`#${section.slug}`}
            >
              {section.text}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

const useTocScroll = (tableOfContents: TOCSection[]) => {
  const [currentSectionSlug, setCurrentSectionSlug] = useState<string>()

  useEffect(() => {
    if (tableOfContents.length === 0) return

    let headings: { id: string; top: number }[]
    let pageTop = 0

    const onResize = () => {
      headings = Array.from(
        document.querySelectorAll<HTMLElement>('.mdx h1, .mdx h2, .mdx h3'),
      ).map((element) => ({
        id: element.id,
        top: element.offsetTop,
      }))

      pageTop = parseFloat(
        window
          .getComputedStyle(document.documentElement)
          .getPropertyValue('--page-top')
          .match(/[\d.]+/)?.[0] ?? '0',
      )
    }

    const onScroll = throttle(() => {
      if (!headings) return

      let current: typeof currentSectionSlug = undefined
      const top = window.scrollY + pageTop
      const HEADING_OFFSET = 184

      headings.forEach((heading) => {
        if (top >= heading.top - HEADING_OFFSET) {
          current = heading.id
        }
      })

      setCurrentSectionSlug(current)
    }, 10)

    onResize()
    onScroll()
    window.addEventListener('scroll', onScroll, { capture: true })
    window.addEventListener('resize', onResize, { capture: true })

    return () => {
      window.removeEventListener('scroll', onScroll, { capture: true })
      window.removeEventListener('resize', onResize, { capture: true })
    }
  }, [tableOfContents])

  return { currentSectionSlug }
}
