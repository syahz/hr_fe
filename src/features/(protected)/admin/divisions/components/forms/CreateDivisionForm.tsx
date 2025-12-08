'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { toast } from 'sonner'
import { useCreateDivisions } from '@/hooks/api/useDivision'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateDivisionFormValues, CreateDivisionValidation } from '../validation/DivisionValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateDivisionForm() {
  const router = useRouter()
  const form = useForm<CreateDivisionFormValues>({
    resolver: zodResolver(CreateDivisionValidation),
    defaultValues: {
      name: ''
    }
  })

  const createDivision = useCreateDivisions()

  const onSubmit = (values: CreateDivisionFormValues) => {
    createDivision.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Divisi berhasil dibuat!')
        router.push('/admin/divisions')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat divisi')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Divisi Baru</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mendaftarkan divisi baru.</CardDescription>
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
                      <Input placeholder="Admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createDivision.isPending}>
              {createDivision.isPending ? 'Menyimpan...' : 'Simpan Divisi'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
