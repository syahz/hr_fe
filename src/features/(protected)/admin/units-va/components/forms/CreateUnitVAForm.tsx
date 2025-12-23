'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { useGetAllUnits } from '@/hooks/api/useUnit'
import { useCreateUnitVA } from '@/hooks/api/useUnitVirtualAccount'
import { CreateUnitVAFormValues, CreateUnitVAValidation } from '../validation/UnitVAValidation'
import { UNIT_VA_NAMES } from '@/config/unit-va-names'

export function CreateUnitVAForm() {
  const router = useRouter()

  const form = useForm<CreateUnitVAFormValues>({
    resolver: zodResolver(CreateUnitVAValidation),
    defaultValues: { unit_id: '', va_number: '', va_bank: '', va_name: '' }
  })

  const { data: allUnits } = useGetAllUnits()
  const createVA = useCreateUnitVA()

  const onSubmit = (values: CreateUnitVAFormValues) => {
    createVA.mutate(values, {
      onSuccess: () => {
        toast.success('Virtual Account Unit berhasil dibuat!')
        router.push('/admin/units-va')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat Virtual Account Unit')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Virtual Account Unit</CardTitle>
            <CardDescription>Isi detail berikut untuk mendaftarkan Virtual Account untuk Unit.</CardDescription>
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
            <Button type="submit" disabled={createVA.isPending}>
              {createVA.isPending ? 'Menyimpan...' : 'Simpan VA'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
