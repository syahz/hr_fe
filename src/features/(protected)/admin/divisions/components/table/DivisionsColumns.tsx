'use client'

import { Button } from '@/components/ui/button'
import { Division } from '@/types/api/divisionType'
import { DivisionsActionsCell } from './DivisionActionsCell'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export const DivisionsColumns: ColumnDef<Division>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Nama Divisi
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    meta: { className: 'sticky left-0 bg-card z-10 min-w-[250px]' } // Sticky column
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original
      return <DivisionsActionsCell divisionsId={id} divisionsName={name} />
    },
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' } // Sticky column
  }
]
