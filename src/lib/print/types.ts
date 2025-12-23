import { ReactElement } from 'react'

export interface PageData {
  nodes: ReactElement[]
  usedPx: number
  isShort: boolean
}

export interface MeasureConfig {
  pageBodyPx: number
  gapPx: number
}

export interface PaginationInput {
  nodes: ReactElement[]
  heights: number[]
  introHeight: number
  gapPx: number
  bodyPx: number
  breakBefore?: boolean[] // optional array parallel to nodes; true => force page break before this node
}
