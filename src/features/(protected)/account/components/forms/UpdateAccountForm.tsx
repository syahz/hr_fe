'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UserResponse } from '@/types/api/user'
import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateAccountUserFormValues, UpdateAccountUserValidation } from '../validation/AccountValidation'
import { toast } from 'sonner'
import { useUpdateAccountUser } from '@/hooks/api/useUser'
import { Loader2 } from 'lucide-react'

interface UpdateAccountFormProps {
  userData: NonNullable<UserResponse>
}

export const UpdateAccountForm = ({ userData }: UpdateAccountFormProps) => {
  const updateAccount = useUpdateAccountUser()
  const form = useForm<UpdateAccountUserFormValues>({
    resolver: zodResolver(UpdateAccountUserValidation),
    defaultValues: {
      name: userData.name ?? '',
      email: userData.email ?? ''
    }
  })

  const onSubmit = (values: UpdateAccountUserFormValues) => {
    updateAccount.mutateAsync(values, {
      onSuccess: () => {
        toast.success('Profil pengguna berhasil diperbarui!')
        form.reset(values)
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Gagal memperbarui profil pengguna.'
        toast.error(message)
      }
    })
  }

  const { isDirty } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Profil Pengguna</CardTitle>
            <CardDescription>Lengkapi informasi spesifik Anda sebagai pengguna.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty || updateAccount.isPending}>
              {updateAccount.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
