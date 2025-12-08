'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { useRouter } from 'next/navigation'
import { useGetUnitById, useUpdateUnit } from '@/hooks/api/useUnit'
import React, { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateUnitValidation, UpdateUnitFormValues } from '../validation/UnitValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

// --- PERBAIKAN: Props sekarang menerima array langsung, bukan objek { data: ... } ---
interface EditUnitFormProps {
  unitId: string
  onSuccess?: () => void
}

export function EditUnitForm({ unitId, onSuccess }: EditUnitFormProps) {
  const router = useRouter()
  const { data: unitData, isLoading: isLoadingUnit } = useGetUnitById(unitId)
  const updateUnit = useUpdateUnit(unitId)
  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateUnitFormValues>({
    resolver: zodResolver(UpdateUnitValidation),
    defaultValues: {
      name: '',
      code: ''
    }
  })

  useEffect(() => {
    if (unitData) {
      form.reset({
        name: unitData.name,
        code: unitData.code
      })

      setIsFormReady(true)
    } else {
      setIsFormReady(false)
    }
  }, [unitData, form])

  if (isLoadingUnit || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateUnitFormValues) => {
    updateUnit.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Unit berhasil diperbarui!')
        router.push('/admin/units')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui unit'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Data Unit</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mengubah data unit.</CardDescription>
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
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kode Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="BMU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateUnit.isPending}>
              {updateUnit.isPending ? 'Menyimpan...' : 'Simpan Unit'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
