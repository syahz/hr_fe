'use client'

import { Button } from '@/components/ui/button'
import { Pen, Trash, Eye } from 'lucide-react'
import Link from 'next/link'

interface DataTableRowActionsProps<TData extends { id: string }> {
  row: TData
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  editHref?: string
  viewHref?: string
}

export function DataTableRowActions<TData extends { id: string }>({
  row,
  onEdit,
  onDelete,
  onView,
  editHref,
  viewHref
}: DataTableRowActionsProps<TData>) {
  const handleEdit = () => {
    if (onEdit) {
      onEdit(row.id)
    }
  }

  const handleDelete = () => {
    if (onDelete) {
      onDelete(row.id)
    }
  }

  const handleView = () => {
    if (onView) {
      onView(row.id)
    }
  }

  return (
    <div className="flex gap-2">
      {/* View button */}
      {(viewHref || onView) &&
        (viewHref ? (
          <Link href={viewHref}>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={handleView}>
            <Eye className="h-4 w-4" />
          </Button>
        ))}

      {/* Edit button */}
      {editHref ? (
        <Link href={editHref}>
          <Button variant="secondary" size="icon" className="h-8 w-8">
            <Pen className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <Button variant="secondary" size="icon" className="h-8 w-8" onClick={handleEdit}>
          <Pen className="h-4 w-4" />
        </Button>
      )}

      {/* Delete button */}
      <Button variant="destructive" size="icon" className="h-8 w-8" onClick={handleDelete}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  )
}
