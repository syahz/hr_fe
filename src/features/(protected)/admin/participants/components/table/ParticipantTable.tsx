'use client'

import { Table } from '@tanstack/react-table'
import { DataTable } from '@/components/table/DataTable'
import { Participant } from '@/types/api/participantType'

// Props diubah untuk menerima 'table instance'
interface ParticipantsTableProps {
  table: Table<Participant>
  isLoading: boolean
  isFetching: boolean
  error?: Error | null
}

export function ParticipantsTable({ table, isLoading, isFetching, error }: ParticipantsTableProps) {
  return (
    <DataTable
      exportOptions={{ enabled: true, fileName: 'Participant-data' }}
      table={table}
      isLoading={isLoading}
      isFetching={isFetching}
      error={error}
      emptyMessage="Tidak ada data pengguna yang sesuai dengan filter."
      errorMessage="Gagal memuat data pengguna. Silakan coba lagi."
    />
  )
}
