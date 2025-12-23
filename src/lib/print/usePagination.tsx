import { useLayoutEffect, useRef, useState, ReactElement } from 'react'
import { paginateBlocks } from './paginate'
import { PageData } from './types'

interface UsePaginationOptions {
  nodes: ReactElement[]
  gapPx?: number
  bodyPx: number
  includeIntro?: boolean
  introContent?: ReactElement
  breakBefore?: boolean[]
}

export function usePagination({ nodes, gapPx = 16, bodyPx, includeIntro = false, introContent, breakBefore }: UsePaginationOptions) {
  const [pages, setPages] = useState<PageData[]>([])
  const [ready, setReady] = useState(false)
  const introRef = useRef<HTMLDivElement | null>(null)
  const itemRefs = useRef<HTMLDivElement[]>([])
  // store last measured heights to detect layout shifts (fonts/images)
  const lastHeightsRef = useRef<number[] | null>(null)
  const measuringRef = useRef(false)
  const rerunRef = useRef(0)

  // Reset refs list every render before Measure runs so we don't accumulate duplicates
  itemRefs.current = []

  useLayoutEffect(() => {
    let cancelled = false

    const MAX_PASSES = 8
    const TOLERANCE = 0.5 // px diff considered stable

    const measureOnce = () => itemRefs.current.map((el) => el.getBoundingClientRect().height)

    const paginateFromHeights = (heights: number[]) => {
      const introHeight = includeIntro ? (introRef.current?.getBoundingClientRect().height ?? 0) : 0
      const paged = paginateBlocks({ nodes, heights, introHeight, gapPx, bodyPx, breakBefore })
      setPages(paged)
      setReady(true)
    }

    const runMeasurement = (pass = 0, prev?: number[]) => {
      if (cancelled) return
      measuringRef.current = true
      const heights = measureOnce()
      const prevHeights = prev || lastHeightsRef.current
      let stable = false
      if (prevHeights && prevHeights.length === heights.length) {
        stable = heights.every((h, i) => Math.abs(h - prevHeights[i]) <= TOLERANCE)
      }

      if (stable || pass >= MAX_PASSES) {
        lastHeightsRef.current = heights
        paginateFromHeights(heights)
        measuringRef.current = false
        return
      }
      // schedule next pass after next frame to allow layout (fonts/images) to settle
      requestAnimationFrame(() => runMeasurement(pass + 1, heights))
    }

    // Kick off initial measurement after next frame (ensures DOM mounted)
    setReady(false)
    requestAnimationFrame(() => runMeasurement())

    // Resize observer to detect late content growth (images, async content)
    const ro = new ResizeObserver(() => {
      if (cancelled) return
      // debounce via animation frame; avoid overlapping measurement loops
      if (!measuringRef.current) {
        rerunRef.current++
        setReady(false)
        requestAnimationFrame(() => runMeasurement())
      }
    })

    itemRefs.current.forEach((el) => ro.observe(el))
    if (introRef.current) ro.observe(introRef.current)

    // Re-run after window load (images) & when fonts ready
    const onLoad = () => {
      if (cancelled) return
      setReady(false)
      runMeasurement()
    }
    window.addEventListener('load', onLoad)
    // Wait for web fonts (if supported) without using 'any'
    const docFonts: FontFaceSet | undefined = (document as Document & { fonts?: FontFaceSet }).fonts
    if (docFonts?.ready) {
      docFonts.ready.then(() => onLoad())
    }

    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('load', onLoad)
    }
  }, [nodes, gapPx, bodyPx, includeIntro, breakBefore])

  const Measure = () => (
    <div className="absolute -left-[10000px] top-0 w-[8.5in] px-[1in] py-[24px] text-sm leading-normal">
      <div ref={introRef} className={includeIntro ? 'mb-6' : 'hidden'}>
        {introContent}
      </div>
      {nodes.map((n, i) => (
        <div
          key={i}
          ref={(el) => {
            if (el) itemRefs.current.push(el)
          }}
        >
          {n}
        </div>
      ))}
    </div>
  )

  return { pages, ready, Measure }
}
