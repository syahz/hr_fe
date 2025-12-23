'use client'

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useDeleteUnitVA } from '@/hooks/api/useUnitVirtualAccount'
import { EditUnitVAForm } from '@/features/(protected)/admin/units-va/components/forms/EditUnitVAForm'
import { useState } from 'react'
import { toast } from 'sonner'

interface Props {
  id: string
  unitName?: string
}

export function UnitsVAActionsCell({ id, unitName }: Props) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const del = useDeleteUnitVA()

  const handleDelete = () => {
    del.mutate(id, {
      onSuccess: () => {
        toast.success(`VA untuk ${unitName ?? `#${id}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus data'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Virtual Account Unit</DialogTitle>
          </DialogHeader>
          {openEdit && <EditUnitVAForm id={id} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus VA {unitName ? `(${unitName})` : `#${id}`}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
