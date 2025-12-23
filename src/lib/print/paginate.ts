import { PageData, PaginationInput } from './types'
import { ReactElement } from 'react'

// Generic pagination function (formerly paginateDynamic)
export function paginateBlocks({ nodes, heights, introHeight, gapPx, bodyPx, breakBefore }: PaginationInput): PageData[] {
  const pages: PageData[] = []
  let current: ReactElement[] = []
  let used = 0
  const firstLimit = bodyPx - introHeight

  for (let i = 0; i < nodes.length; i++) {
    const h = heights[i]
    if (h === 0) continue
    const limit = pages.length === 0 ? firstLimit : bodyPx
    const heightToAdd = current.length === 0 ? h : h + gapPx

    const forceBreak = breakBefore?.[i] === true && current.length > 0

    if ((used + heightToAdd > limit && current.length) || forceBreak) {
      pages.push({ nodes: current, usedPx: used, isShort: used < limit - 4 })
      current = [nodes[i]]
      used = h
    } else {
      current.push(nodes[i])
      used += heightToAdd
    }
  }

  if (current.length) {
    const lastLimit = pages.length === 0 ? firstLimit : bodyPx
    pages.push({ nodes: current, usedPx: used, isShort: used < lastLimit - 4 })
  }
  return pages
}
