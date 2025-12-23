'use client'

import { ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react'

interface UsePaginatedTableBlocksProps<T> {
  rows: ReadonlyArray<T>
  renderHeader: () => ReactElement
  renderRow: (row: T, index: number) => ReactElement
  rowKey: (row: T, index: number) => string | number
  maxChunkPx: number
  tableClassName?: string
  theadClassName?: string
  tbodyClassName?: string
  emptyPlaceholder?: ReactElement
}

interface UsePaginatedTableBlocksResult {
  blocks: ReactElement[]
  Measure: () => ReactElement | null
}

export function usePaginatedTableBlocks<T>({
  rows,
  renderHeader,
  renderRow,
  rowKey,
  maxChunkPx,
  tableClassName = 'w-full border text-sm',
  theadClassName,
  tbodyClassName,
  emptyPlaceholder
}: UsePaginatedTableBlocksProps<T>): UsePaginatedTableBlocksResult {
  const headerRef = useRef<HTMLTableSectionElement | null>(null)
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([])
  const [chunks, setChunks] = useState<Array<{ start: number; end: number }>>([])

  // Keep refs array length in sync
  rowRefs.current = []

  useLayoutEffect(() => {
    if (!rows || rows.length === 0) {
      setChunks([{ start: 0, end: 0 }])
      return
    }
    const headerH = headerRef.current?.getBoundingClientRect().height ?? 0
    const rowHeights = rowRefs.current.map((r) => r?.getBoundingClientRect().height ?? 0)

    const newChunks: Array<{ start: number; end: number }> = []
    let start = 0
    let used = headerH
    for (let i = 0; i < rowHeights.length; i++) {
      const rh = rowHeights[i]
      if (used + rh <= maxChunkPx || i === start) {
        used += rh
      } else {
        newChunks.push({ start, end: i })
        start = i
        used = headerH + rh
      }
    }
    if (start < rowHeights.length) newChunks.push({ start, end: rowHeights.length })
    setChunks(newChunks)
  }, [rows, maxChunkPx])

  const header = useMemo(() => renderHeader(), [renderHeader])

  const blocks: ReactElement[] = useMemo(() => {
    if (!rows || rows.length === 0) {
      return [
        <table key="empty" className={tableClassName}>
          <thead className={theadClassName}>{header}</thead>
          <tbody className={tbodyClassName}>
            <tr>
              <td colSpan={999} className="border p-2 text-center italic text-xs">
                {emptyPlaceholder ?? 'Tidak ada data'}
              </td>
            </tr>
          </tbody>
        </table>
      ]
    }
    return chunks.map((c, ci) => (
      <table key={ci} className={tableClassName}>
        <thead className={theadClassName}>{header}</thead>
        <tbody className={tbodyClassName}>{rows.slice(c.start, c.end).map((row, i) => renderRow(row, c.start + i))}</tbody>
      </table>
    ))
  }, [rows, chunks, tableClassName, theadClassName, tbodyClassName, emptyPlaceholder, header, renderRow])

  const Measure = () => (
    <div className="absolute -left-[10000px] top-0 w-full">
      <table className={tableClassName}>
        <thead
          ref={(el) => {
            headerRef.current = el
          }}
          className={theadClassName}
        >
          {header}
        </thead>
        <tbody className={tbodyClassName}>
          {rows.map((row, i) => {
            const rowEl = renderRow(row, i) as React.ReactElement<{ children?: React.ReactNode }>
            return (
              <tr
                key={rowKey(row, i)}
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                className="align-top"
              >
                {rowEl.props.children}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )

  return { blocks, Measure }
}
