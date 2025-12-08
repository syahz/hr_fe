'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { useCreateRoles } from '@/hooks/api/useRole'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateRoleFormValues, CreateRoleValidation } from '../validation/RoleValidation'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function CreateRoleForm() {
  const router = useRouter()
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(CreateRoleValidation),
    defaultValues: {
      name: ''
    }
  })

  const createRole = useCreateRoles()

  const onSubmit = (values: CreateRoleFormValues) => {
    createRole.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Role berhasil dibuat!')
        router.push('/admin/roles')
      },
      onError: (error: { message?: string }) => {
        toast.error(error.message || 'Gagal membuat role')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Role Baru</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mendaftarkan role baru.</CardDescription>
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
                      <Input placeholder="Admin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createRole.isPending}>
              {createRole.isPending ? 'Menyimpan...' : 'Simpan Role'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
