'use client'

import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { truncateText } from '@/utils/truncateText'
import { FeedbackHOActionsCell } from './FeedbackHOActionsCell'
import { FeedbackHeadOffice } from '@/types/api/feedbackHOType'
import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, Star } from 'lucide-react'

export function FeedbackHOColumns(): ColumnDef<FeedbackHeadOffice>[] {
  const cols: ColumnDef<FeedbackHeadOffice>[] = [
    {
      accessorKey: 'division.name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Divisi
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      meta: { exportLabel: 'Division' }
    },
    {
      accessorKey: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
        const rating = Number(row.getValue('rating')) || 0
        return (
          <div className="flex items-center gap-1">
            {Array.from({ length: rating }).map((_, i) => (
              <Star key={i} className="h-4 w-4 text-amber-400" />
            ))}
          </div>
        )
      }
    },
    {
      accessorKey: 'suggestion',
      header: 'Saran',
      cell: ({ row }) => <span className="max-w-[400px] truncate">{truncateText(row.getValue('suggestion'), 20) ?? '-'}</span>
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: ({ row }) => <span>{row.getValue('ipAddress')}</span>
    },
    {
      accessorKey: 'createdAt',
      header: 'Tanggal',
      cell: ({ row }) => <span>{formatDate(row.getValue('createdAt'))}</span>,
      meta: {
        exportLabel: 'Tanggal',
        exportValue: (row: FeedbackHeadOffice) => {
          const d = new Date((row as unknown as { createdAt: string | Date }).createdAt)
          return formatDate(d.toISOString())
        }
      }
    },
    {
      accessorKey: 'actions',
      header: () => <div>Aksi</div>,
      cell: ({ row }) => (
        <div>
          <FeedbackHOActionsCell row={row} />
        </div>
      ),
      meta: { className: 'exclude-from-export', exportable: false }
    }
  ]

  return cols
}
