'use client'

import { Table as TanstackTable, flexRender, Column } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AlertCircle, Download, FileDown, FileSpreadsheet } from 'lucide-react'
import { DataTableSkeleton } from './DataTableSkeleton'
import { DynamicSkeleton } from '../ui/dynamic-skeleton'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

export type ExportFormat = 'csv' | 'xlsx'

export interface DataTableExportOptions<TData> {
  enabled?: boolean
  fileName?: string
  formats?: ExportFormat[]
  scope?: 'all' | 'page' | 'selected'
  includeHeaders?: boolean
  transformCell?: (value: unknown, columnId: string, row: TData) => string | number | null
}

// Props sekarang menerima 'table' instance dan state loading/error
interface DataTableProps<TData> {
  table: TanstackTable<TData>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
  emptyMessage?: string
  errorMessage?: string
  exportOptions?: DataTableExportOptions<TData>
}

export function DataTable<TData>({
  table,
  isLoading,
  isFetching,
  error,
  emptyMessage = 'No data found',
  errorMessage,
  exportOptions
}: DataTableProps<TData>) {
  // ===== Export helpers =====
  const getVisibleExportableColumns = () => {
    const cols = table
      .getAllLeafColumns()
      .filter((c) => c.getIsVisible())
      .filter((c) => c.columnDef?.meta?.exportable !== false)
      .filter((c) => 'accessorKey' in c.columnDef || 'accessorFn' in c.columnDef || c.columnDef?.meta?.forceExport === true)
    return cols as Column<TData, unknown>[]
  }

  const getHeaderLabel = (column: Column<TData, unknown>) => {
    const metaLabel = column.columnDef?.meta?.exportLabel as string | undefined
    if (metaLabel) return metaLabel
    const header = column.columnDef.header
    if (typeof header === 'string') return header
    return column.id
  }

  const getRowsByScope = () => {
    const scope = exportOptions?.scope ?? 'all'
    if (scope === 'selected') return table.getSelectedRowModel().rows
    if (scope === 'page') return table.getRowModel().rows
    return table.getPrePaginationRowModel().rows
  }

  const formatCell = (val: unknown, columnId: string, rowData: TData) => {
    const transformed = exportOptions?.transformCell?.(val, columnId, rowData)
    const value = transformed !== undefined ? transformed : val
    if (value === null || value === undefined) return ''
    if (value instanceof Date) return value.toISOString()
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  const buildAoaData = () => {
    const columns = getVisibleExportableColumns()
    const rows = getRowsByScope()
    const includeHeaders = exportOptions?.includeHeaders !== false
    const headerRow = columns.map((c) => getHeaderLabel(c))
    const dataRows = rows.map((r) =>
      columns.map((c) => {
        // Prefer meta.exportValue if provided
        const meta = c.columnDef?.meta as { exportValue?: (row: TData) => unknown } | undefined
        const raw = meta?.exportValue ? meta.exportValue(r.original) : r.getValue(c.id)
        return formatCell(raw, c.id, r.original)
      })
    )
    return includeHeaders ? [headerRow, ...dataRows] : dataRows
  }

  const downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const exportCSV = () => {
    const aoa = buildAoaData()
    const csv = aoa
      .map((row) =>
        row
          .map((cell) => {
            const s = String(cell ?? '')
            const escaped = s.replace(/"/g, '""')
            const needsWrapping = /[",\n]/.test(escaped)
            return needsWrapping ? `"${escaped}"` : escaped
          })
          .join(',')
      )
      .join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const base = exportOptions?.fileName || 'export'
    downloadBlob(blob, `${base}.csv`)
  }

  const exportXLSX = async () => {
    const aoa = buildAoaData()
    const XLSX = await import('xlsx')
    const ws = XLSX.utils.aoa_to_sheet(aoa)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Data')
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    const base = exportOptions?.fileName || 'export'
    downloadBlob(blob, `${base}.xlsx`)
  }

  if (isLoading) {
    // Tampilkan skeleton saat loading pertama kali
    return <DataTableSkeleton columns={table.getAllColumns().length} rows={table.getState().pagination.pageSize} />
  }

  if (error) {
    return (
      <div className="rounded-md border">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Error loading data</h3>
          <p className="text-sm text-muted-foreground mt-2">{errorMessage || error.message || 'Something went wrong while fetching the data.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Export controls (optional) */}
      {exportOptions && (exportOptions.enabled ?? true) && (
        <div className="flex items-center justify-end mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isFetching}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Download as</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(exportOptions.formats ?? ['csv', 'xlsx']).includes('csv') && (
                <DropdownMenuItem onClick={exportCSV} disabled={isFetching}>
                  <FileDown className="h-4 w-4 mr-2" /> CSV
                </DropdownMenuItem>
              )}
              {(exportOptions.formats ?? ['csv', 'xlsx']).includes('xlsx') && (
                <DropdownMenuItem onClick={exportXLSX} disabled={isFetching}>
                  <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel (.xlsx)
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Overlay saat re-fetching data (misal: ganti halaman) */}
      {isFetching && <DynamicSkeleton variant="table" />}

      <div className="relative w-full overflow-x-auto rounded-md border">
        <Table className="">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={header.column.columnDef.meta?.className}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className={cell.column.columnDef.meta?.className}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
