'use client'
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogDescription
} from '@/components/ui/alert-dialog'
import { toast } from 'sonner'
import { useState } from 'react'
import { useDeleteSpp, useGetSpp } from '@/hooks/api/useSpp'
import { useRouter } from 'next/navigation'
import { DataTableRowActions } from '@/components/table/DataTableRowActions'

interface SppActionsCellProps {
  name?: string
  SppId: string
}

export function SppActionsCell({ SppId, name }: SppActionsCellProps) {
  const router = useRouter()
  const del = useDeleteSpp()
  const { data: SppData } = useGetSpp(SppId)
  const [openDelete, setOpenDelete] = useState(false)

  const handleView = () => {
    const spp = SppData
    const isUndefinedLetter = spp?.spp_letter == undefined
    if (isUndefinedLetter) {
      router.push(`/admin/spp/edit/${SppId}`)
    } else {
      router.push(`/admin/spp/view/${spp.id}`)
    }
  }

  const handleDelete = () => {
    del.mutate(SppId, {
      onSuccess: () => {
        toast.success(`SPP ${name ?? `#${SppId}`} berhasil dihapus`)
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
      <DataTableRowActions row={{ id: SppId }} editHref={`/admin/spp/edit/${SppId}`} onView={handleView} onDelete={() => setOpenDelete(true)} />
      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus SPP {name ? `(${name})` : `#${SppId}`}?</AlertDialogTitle>
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
