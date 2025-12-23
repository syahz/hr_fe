'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'

import { useGetAllUnits } from '@/hooks/api/useUnit'
import { useGetUnitVAById, useUpdateUnitVA } from '@/hooks/api/useUnitVirtualAccount'
import { UpdateUnitVAFormValues, UpdateUnitVAValidation } from '../validation/UnitVAValidation'
import { UNIT_VA_NAMES } from '@/config/unit-va-names'

interface Props {
  id: string
  onSuccess?: () => void
}

export function EditUnitVAForm({ id, onSuccess }: Props) {
  const router = useRouter()
  const { data: detail, isLoading } = useGetUnitVAById(id)
  const updateVA = useUpdateUnitVA(id)
  const { data: allUnits } = useGetAllUnits()
  const [ready, setReady] = useState(false)

  const form = useForm<UpdateUnitVAFormValues>({
    resolver: zodResolver(UpdateUnitVAValidation),
    defaultValues: { unit_id: '', va_number: '', va_bank: '', va_name: '' }
  })

  useEffect(() => {
    if (detail) {
      form.reset({
        unit_id: detail.unit.id,
        va_number: detail.va_number,
        va_bank: detail.va_bank,
        va_name: detail.va_name
      })
      setReady(true)
    } else {
      setReady(false)
    }
  }, [detail, form])

  if (isLoading || !ready) return <DynamicSkeleton variant="dialogForm" />

  const onSubmit = (values: UpdateUnitVAFormValues) => {
    updateVA.mutate(values, {
      onSuccess: () => {
        toast.success('Virtual Account Unit berhasil diperbarui!')
        router.push('/admin/units-va')
        onSuccess?.()
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal memperbarui Virtual Account Unit')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Virtual Account Unit</CardTitle>
            <CardDescription>Perbarui data Virtual Account untuk Unit terkait.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="unit_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pilih Unit</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {allUnits?.data?.map((u) => (
                            <SelectItem key={u.id} value={u.id}>
                              {u.name} ({u.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="va_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nomor VA</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: 1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="va_bank"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: BCA, BNI, Mandiri" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="va_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Rekening/VA</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih nama VA" />
                        </SelectTrigger>
                        <SelectContent>
                          {UNIT_VA_NAMES.map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateVA.isPending}>
              {updateVA.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
