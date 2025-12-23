'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'
import type { UnitVirtualAccountResponse } from '@/types/api/unitVirtualAccountType'
import { UnitsVAActionsCell } from '@/features/(protected)/admin/units-va/components/table/UnitsVAActionsCell'

export const UnitsVAColumns: ColumnDef<UnitVirtualAccountResponse>[] = [
  {
    accessorKey: 'unit.name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Unit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="font-medium">{row.original.unit.name}</span>
        <Badge variant={'secondary'}>{row.original.unit.code}</Badge>
      </div>
    ),
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[260px]' }
  },
  {
    accessorKey: 'va_number',
    header: 'No. VA',
    cell: ({ row }) => <span className="tabular-nums">{row.original.va_number}</span>
  },
  {
    accessorKey: 'va_bank',
    header: 'Bank',
    cell: ({ row }) => <span>{row.original.va_bank}</span>
  },
  {
    accessorKey: 'va_name',
    header: 'Nama VA',
    cell: ({ row }) => <span>{row.original.va_name}</span>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => <UnitsVAActionsCell id={row.original.id} unitName={row.original.unit.name} />,
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' }
  }
]
