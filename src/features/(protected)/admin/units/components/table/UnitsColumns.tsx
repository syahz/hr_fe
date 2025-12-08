'use client'

import { Unit } from '@/types/api/unitType'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UnitActionsCell } from './UnitsActionsCell'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export const UnitsColumns: ColumnDef<Unit>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Role
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[250px]' } // Sticky column
  },
  {
    accessorKey: 'code',
    header: 'Kode Unit',
    cell: ({ row }) => <Badge variant={'secondary'}>{row.original.code}</Badge>
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original
      return <UnitActionsCell unitId={id} unitName={name} />
    },
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' } // Sticky column
  }
]
