'use client'

import { Division } from '@/types/api/divisionType'
import { DataTable } from '@/components/table/DataTable'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface DivisionsTableProps {
  table: Table<Division>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function DivisionsTable({ table, isLoading, isFetching, error }: DivisionsTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada Divisi Untuk Saat Ini."
      errorMessage="Gagal memuat data Divisi. Silakan coba lagi."
    />
  )
}
