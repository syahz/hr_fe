'use client'

import { DataTable } from '@/components/table/DataTable'
import { Unit } from '@/types/api/unitType'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface UnitsTableProps {
  table: Table<Unit>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function UnitsTable({ table, isLoading, isFetching, error }: UnitsTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada Unit Untuk Saat Ini."
      errorMessage="Gagal memuat data Unit. Silakan coba lagi."
    />
  )
}
