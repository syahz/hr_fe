'use client'

import { DataTable } from '@/components/table/DataTable'
import type { SppResponse } from '@/types/api/spp'
import type { Table } from '@tanstack/react-table'

interface SppTableProps {
  table: Table<SppResponse>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function SppTable({ table, isLoading, isFetching, error }: SppTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Belum ada SPP."
      errorMessage="Gagal memuat data SPP. Silakan coba lagi."
    />
  )
}
