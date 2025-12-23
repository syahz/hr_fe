'use client'

import { ReactElement, useLayoutEffect, useMemo, useRef, useState } from 'react'

interface PaginatedTableProps<T> {
  rows: ReadonlyArray<T>
  renderHeader: () => ReactElement
  renderRow: (row: T, index: number) => ReactElement
  rowKey: (row: T, index: number) => string | number
  maxChunkPx?: number
  tableClassName?: string
  theadClassName?: string
  tbodyClassName?: string
  emptyPlaceholder?: ReactElement
}

// Default safe chunk height so each chunk fits a page body comfortably.
// You can override via maxChunkPx when integrating with a known body height.
const DEFAULT_MAX_CHUNK_PX = 800

export default function PaginatedTable<T>({
  rows,
  renderHeader,
  renderRow,
  rowKey,
  maxChunkPx = DEFAULT_MAX_CHUNK_PX,
  tableClassName = 'w-full border text-sm',
  theadClassName,
  tbodyClassName,
  emptyPlaceholder
}: PaginatedTableProps<T>) {
  const measureHeaderRef = useRef<HTMLTableSectionElement | null>(null)
  const measureRowRefs = useRef<Array<HTMLTableRowElement | null>>([])
  const [chunks, setChunks] = useState<Array<{ start: number; end: number }>>([])

  // reset row refs length on render
  measureRowRefs.current = []

  useLayoutEffect(() => {
    if (!rows || rows.length === 0) {
      setChunks([])
      return
    }

    const headerH = measureHeaderRef.current?.getBoundingClientRect().height ?? 0
    const rowHeights = measureRowRefs.current.map((r) => r?.getBoundingClientRect().height ?? 0)

    // Build chunks so that header + rows fit into maxChunkPx
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

  if (!rows || rows.length === 0) {
    return (
      <table className={tableClassName}>
        <thead className={theadClassName}>{header}</thead>
        <tbody className={tbodyClassName}>
          <tr>
            <td colSpan={999} className="border border-slate-400 p-2 text-center italic text-xs">
              {emptyPlaceholder ?? 'Tidak ada data'}
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Hidden measurer: off-screen but with the same widths/styles to get accurate heights */}
      <div className="absolute -left-[10000px] top-0 w-full">
        <table className={tableClassName}>
          <thead
            ref={(el) => {
              measureHeaderRef.current = el
            }}
            className={theadClassName}
          >
            {header}
          </thead>
          <tbody className={tbodyClassName}>
            {rows.map((row, i) =>
              (() => {
                const rowEl = renderRow(row, i) as React.ReactElement<{ children?: React.ReactNode }>
                return (
                  <tr
                    key={rowKey(row, i)}
                    ref={(el) => {
                      measureRowRefs.current[i] = el
                    }}
                    className="align-top"
                  >
                    {rowEl.props.children}
                  </tr>
                )
              })()
            )}
          </tbody>
        </table>
      </div>

      {/* Visible chunks */}
      {chunks.map((c, ci) => (
        <table key={ci} className={tableClassName}>
          <thead className={theadClassName}>{header}</thead>
          <tbody className={tbodyClassName}>{rows.slice(c.start, c.end).map((row, i) => renderRow(row, c.start + i))}</tbody>
        </table>
      ))}
    </div>
  )
}
