'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { useCreateParticipant } from '@/hooks/api/useParticipant'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { CreateParticipantFormValues, CreateParticipantValidation } from '../validation/ParticipantValidation'
import { Eye, EyeOff } from 'lucide-react'

// Definisikan tipe data dasar
interface Role {
  id: string
  name: string
}
interface Unit {
  id: string
  name: string
}
interface Division {
  id: string
  name: string
}

// --- PERBAIKAN: Props sekarang menerima array langsung, bukan objek { data: ... } ---
interface CreateParticipantFormProps {
  roles: Role[]
  units: Unit[]
  divisions: Division[]
}

export function CreateParticipantForm({ roles, units, divisions }: CreateParticipantFormProps) {
  const router = useRouter()
  const form = useForm<CreateParticipantFormValues>({
    resolver: zodResolver(CreateParticipantValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: undefined,
      unitId: undefined,
      divisionId: undefined
    }
  })

  const createParticipant = useCreateParticipant()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onSubmit = (values: CreateParticipantFormValues) => {
    createParticipant.mutateAsync(values, {
      onSuccess: () => {
        toast.success('User participant berhasil dibuat!')
        router.push('/admin/participants')
      },
      onError: (error: { message?: string }) => {
        // Tipe error lebih aman
        toast.error(error.message || 'Gagal membuat participant')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Buat Akun Participant Baru</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mendaftarkan user baru.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="divisionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Divisi" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division.id} value={division.id}>
                            {division.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unitId"
                render={({ field }) => (
                  <FormItem className="md:col-span-2 col-span-1">
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id}>
                            {unit.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Password section below the unit row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword((p) => !p)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowConfirmPassword((p) => !p)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={createParticipant.isPending}>
              {createParticipant.isPending ? 'Menyimpan...' : 'Simpan Participant'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
