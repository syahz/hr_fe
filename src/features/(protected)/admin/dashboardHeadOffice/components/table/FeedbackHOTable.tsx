'use client'

import { FeedbackHeadOffice } from '@/types/api/feedbackHOType'
import { DataTable, type DataTableExportOptions } from '@/components/table/DataTable'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface FeedbackHOTableProps {
  table: Table<FeedbackHeadOffice>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
  exportOptions?: DataTableExportOptions<FeedbackHeadOffice>
}

export function FeedbackHOTable({ table, isLoading, isFetching, error, exportOptions }: FeedbackHOTableProps) {
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
