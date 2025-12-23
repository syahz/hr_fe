'use client'

import { DataTable } from '@/components/table/DataTable'
import type { Table } from '@tanstack/react-table'
import type { UnitVirtualAccountResponse } from '@/types/api/unitVirtualAccountType'

interface Props {
  table: Table<UnitVirtualAccountResponse>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function UnitsVATable({ table, isLoading, isFetching, error }: Props) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada data Virtual Account Unit."
      errorMessage="Gagal memuat data Virtual Account Unit."
    />
  )
}
