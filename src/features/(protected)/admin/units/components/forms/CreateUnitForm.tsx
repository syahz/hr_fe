'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useCreateUnit } from '@/hooks/api/useUnit'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateUnitValidation, CreateUnitFormValues } from '../validation/UnitValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateUnitForm() {
  const router = useRouter()
  const form = useForm<CreateUnitFormValues>({
    resolver: zodResolver(CreateUnitValidation),
    defaultValues: {
      name: '',
      code: ''
    }
  })

  const createUnit = useCreateUnit()

  const onSubmit = (values: CreateUnitFormValues) => {
    createUnit.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Unit berhasil dibuat!')
        router.push('/admin/units')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat unit')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Unit Baru</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mendaftarkan unit baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Brawijaya Catering" {...field} />
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
                      <Input placeholder="E.g. BCR" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createUnit.isPending}>
              {createUnit.isPending ? 'Menyimpan...' : 'Simpan Unit'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
