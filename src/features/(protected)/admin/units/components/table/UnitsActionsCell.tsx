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
import { useDeleteUnit } from '@/hooks/api/useUnit'
import { toast } from 'sonner'
import { useState } from 'react'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditUnitForm } from '@/features/(protected)/admin/units/components/forms/EditUnitForm'

interface UnitActionsCellProps {
  unitId: string
  unitName?: string
}

export function UnitActionsCell({ unitId, unitName }: UnitActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deleteUser = useDeleteUnit()

  const handleDeleteConfirm = () => {
    deleteUser.mutate(unitId, {
      onSuccess: () => {
        toast.success(`Pengguna ${unitName ?? `#${unitId}`} berhasil dihapus`)
        setOpenDelete(false)
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal menghapus user'
        toast.error(message)
      }
    })
  }

  return (
    <>
      <DataTableRowActions row={{ id: unitId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      {/* modal edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Unit</DialogTitle>
          </DialogHeader>
          {openEdit && <EditUnitForm key={unitId} unitId={unitId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      {/* alert dialog delete */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {unitName ?? `#${unitId}`}?</AlertDialogTitle>
            <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan. Data unit akan dihapus secara permanen dari sistem.</AlertDialogDescription>
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
