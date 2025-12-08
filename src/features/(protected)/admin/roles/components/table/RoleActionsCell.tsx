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
import { useDeleteRole } from '@/hooks/api/useRole'
import { toast } from 'sonner'
import { useState } from 'react'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'
import { EditRoleForm } from '@/features/(protected)/admin/roles/components/forms/EditRoleForm'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface RolesActionsCellProps {
  rolesId: string
  rolesName?: string
}

export function RolesActionsCell({ rolesId, rolesName }: RolesActionsCellProps) {
  const [openDelete, setOpenDelete] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const deleteRole = useDeleteRole()

  const handleDeleteConfirm = () => {
    deleteRole.mutateAsync(rolesId, {
      onSuccess: () => {
        toast.success(`Role ${rolesName ?? `#${rolesId}`} berhasil dihapus`)
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
      <DataTableRowActions row={{ id: rolesId }} onEdit={() => setOpenEdit(true)} onDelete={() => setOpenDelete(true)} />

      {/* modal edit */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
          </DialogHeader>
          {openEdit && <EditRoleForm key={rolesId} roleId={rolesId} onSuccess={() => setOpenEdit(false)} />}
        </DialogContent>
      </Dialog>

      {/* alert dialog delete */}
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus {rolesName ?? `#${rolesId}`}?</AlertDialogTitle>
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
