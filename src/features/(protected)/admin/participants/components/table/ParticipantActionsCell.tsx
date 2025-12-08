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
import { useDeleteParticipant } from '@/hooks/api/useParticipant'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EditParticipantForm } from '@/features/(protected)/admin/participants/components/forms/EditParticipantForm'

interface ParticipantActionsCellProps {
  userId: string
  userName?: string
}

export function ParticipantActionsCell({ userId, userName }: ParticipantActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deleteParticipant = useDeleteParticipant()

  const handleDeleteConfirm = () => {
    deleteParticipant.mutateAsync(userId, {
      onSuccess: () => {
        toast.success(`Pengguna ${userName ?? `#${userId}`} berhasil dihapus`)
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
      <DataTableRowActions row={{ id: userId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      {/* modal edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {openEdit && <EditParticipantForm key={userId} userId={userId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      {/* alert dialog delete */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus pengguna {userName ?? `#${userId}`}?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data pengguna akan dihapus secara permanen dari sistem.
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
