'use client'

import type { ColumnDef } from '@tanstack/react-table'
import type { SppResponse } from '@/types/api/spp'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { SppActionsCell } from '@/features/(protected)/admin/spp/components/table/SppActionsCell'

export const SppColumns: ColumnDef<SppResponse>[] = [
  {
    accessorKey: 'unit.name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Unit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.unit.name}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[200px]' }
  },
  {
    accessorKey: 'month',
    header: 'Bulan'
  },
  {
    accessorKey: 'year',
    header: 'Tahun'
  },
  {
    accessorKey: 'total_tagihan_perusahaan',
    header: 'Total Tagihan Perusahaan',
    cell: ({ row }) => {
      const v = row.original.total_tagihan_perusahaan
      return <Badge variant="secondary">{new Intl.NumberFormat('id-ID').format(v)}</Badge>
    }
  },
  {
    accessorKey: 'total_tagihan_tenaga_kerja',
    header: 'Total Tagihan Tenaga Kerja',
    cell: ({ row }) => {
      const v = row.original.total_tagihan_tenaga_kerja
      return <Badge variant="secondary">{new Intl.NumberFormat('id-ID').format(v)}</Badge>
    }
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <SppActionsCell spp={row.original} />,
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]
