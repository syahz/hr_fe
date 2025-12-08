'use client'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { useDeleteDivision } from '@/hooks/api/useDivision'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditDivisionForm } from '@/features/(protected)/admin/divisions/components/forms/EditDivisionForm'

interface DivisionsActionsCellProps {
  divisionsId: string
  divisionsName?: string
}

export function DivisionsActionsCell({ divisionsId, divisionsName }: DivisionsActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deleteDivision = useDeleteDivision()

  const handleDeleteConfirm = () => {
    deleteDivision.mutateAsync(divisionsId, {
      onSuccess: () => {
        toast.success(`Divisi ${divisionsName ?? `#${divisionsId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus roles'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: divisionsId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      {/* modal edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Divisi</DialogTitle>
          </DialogHeader>
          {openEdit && <EditDivisionForm key={divisionsId} divisionId={divisionsId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      {/* alert dialog delete */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {divisionsName ?? `#${divisionsId}`}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data divisi akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
