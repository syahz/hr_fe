'use client'

import { DataTable, type DataTableExportOptions } from '@/components/table/DataTable'
import { Feedback } from '@/types/api/feedbackType'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface FeedbacksTableProps {
  table: Table<Feedback>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
  exportOptions?: DataTableExportOptions<Feedback>
}

export function FeedbacksTable({ table, isLoading, isFetching, error, exportOptions }: FeedbacksTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada feedback yang sesuai dengan filter."
      errorMessage="Gagal memuat data feedback. Silakan coba lagi."
      exportOptions={exportOptions}
    />
  )
}
