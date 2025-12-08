'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useGetRoleById, useUpdateRole } from '@/hooks/api/useRole'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateRoleFormValues, UpdateRoleValidation } from '../validation/RoleValidation'

// --- PERBAIKAN: Props sekarang menerima array langsung, bukan objek { data: ... } ---
interface EditRoleFormProps {
  roleId: string
  onSuccess?: () => void
}

export function EditRoleForm({ roleId, onSuccess }: EditRoleFormProps) {
  const router = useRouter()
  const { data: roleData, isLoading: isLoadingRole } = useGetRoleById(roleId)
  const updateRole = useUpdateRole(roleId)
  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateRoleFormValues>({
    resolver: zodResolver(UpdateRoleValidation),
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (roleData) {
      form.reset({
        name: roleData.name
      })

      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [roleData, form])

  if (isLoadingRole || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateRoleFormValues) => {
    updateRole.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Role berhasil diperbarui!')
        router.push('/admin/roles')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui user'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Data Role</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mengubah data role.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Role</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateRole.isPending}>
              {updateRole.isPending ? 'Menyimpan...' : 'Simpan Role'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
