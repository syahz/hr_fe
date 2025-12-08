'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetDivisionById, useUpdateDivision } from '@/hooks/api/useDivision'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateDivisionFormValues, UpdateDivisionValidation } from '../validation/DivisionValidation'

interface EditDivisionFormProps {
  divisionId: string
  onSuccess?: () => void
}

export function EditDivisionForm({ divisionId, onSuccess }: EditDivisionFormProps) {
  const router = useRouter()
  const { data: divisionData, isLoading: isLoadingDivision } = useGetDivisionById(divisionId)
  const updateDivision = useUpdateDivision(divisionId)
  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateDivisionFormValues>({
    resolver: zodResolver(UpdateDivisionValidation),
    defaultValues: {
      name: ''
    }
  })

  useEffect(() => {
    if (divisionData) {
      form.reset({
        name: divisionData.name
      })

      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [divisionData, form])

  if (isLoadingDivision || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateDivisionFormValues) => {
    updateDivision.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Divisi berhasil diperbarui!')
        router.push('/admin/divisions')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui divisi'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Data Divisi</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mengubah data divisi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Divisi</FormLabel>
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
            <Button type="submit" disabled={updateDivision.isPending}>
              {updateDivision.isPending ? 'Menyimpan...' : 'Simpan Divisi'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
