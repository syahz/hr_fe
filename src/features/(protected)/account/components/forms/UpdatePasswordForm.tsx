'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import React, { useState } from 'react'
import { useUpdateAccountPassword } from '@/hooks/api/useUser'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateAccountPasswordFormValues, UpdateAccountPasswordValidation } from '../validation/AccountValidation'

export const UpdatePasswordForm = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const updateAccountPassword = useUpdateAccountPassword()

  const form = useForm<UpdateAccountPasswordFormValues>({
    resolver: zodResolver(UpdateAccountPasswordValidation),
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  })

  // Logika saat form disubmit
  const onSubmit = (values: UpdateAccountPasswordFormValues) => {
    updateAccountPassword.mutate(values, {
      onSuccess: () => {
        toast.success('Password berhasil diperbarui!')
        form.reset()
      },
      onError: (error) => {
        const message = error instanceof Error ? error.message : 'Terjadi kesalahan.'
        toast.error(message)
      }
    })
  }

  const { isDirty, isValid } = form.formState

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card>
          <CardHeader>
            <CardTitle>Ubah Password</CardTitle>
            <CardDescription>Ganti password Anda secara berkala untuk menjaga keamanan akun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Password Saat Ini */}
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>Password Saat Ini</FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input type={showCurrentPassword ? 'text' : 'password'} placeholder="Masukkan password Anda saat ini" {...field} />
                    </FormControl>
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                    >
                      {showCurrentPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                    </button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Grid untuk password baru dan konfirmasi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password Baru */}
              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Password Baru</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showNewPassword ? 'text' : 'password'} placeholder="Minimal 8 karakter" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      >
                        {showNewPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Konfirmasi Password Baru */}
              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Konfirmasi Password Baru</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Ulangi password baru" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={!isDirty || !isValid || updateAccountPassword.isPending}>
              {updateAccountPassword.isPending ? (
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
