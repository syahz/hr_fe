'use client'

import { Role } from '@/types/api/roleType'
import { Button } from '@/components/ui/button'
import { RolesActionsCell } from './RoleActionsCell'
import { ArrowUpDown } from 'lucide-react'
import { ColumnDef } from '@tanstack/react-table'

export const RolesColumns: ColumnDef<Role>[] = [
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
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const { id, name } = row.original
      return <RolesActionsCell rolesId={id} rolesName={name} />
    },
    meta: { className: 'sticky right-0 bg-card z-10 w-[120px]' } // Sticky column
  }
]
