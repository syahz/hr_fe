'use client'

import { DataTable } from '@/components/table/DataTable'
import { Role } from '@/types/api/roleType'
import { Table } from '@tanstack/react-table'

// Props diubah untuk menerima 'table instance'
interface RoleTableProps {
  table: Table<Role>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function RoleTable({ table, isLoading, isFetching, error }: RoleTableProps) {
  return (
    <DataTable
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada Role Untuk Saat Ini."
      errorMessage="Gagal memuat data Role. Silakan coba lagi."
    />
  )
}
