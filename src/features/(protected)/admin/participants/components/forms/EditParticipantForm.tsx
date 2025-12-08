'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { useGetAllRoles } from '@/hooks/api/useRole'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { toast } from 'sonner'
import { useGetAllDivisions } from '@/hooks/api/useDivision'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { DynamicSkeleton } from '@/components/ui/dynamic-skeleton'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGetParticipantById, useUpdateParticipant } from '@/hooks/api/useParticipant'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { UpdateParticipantFormValues, UpdateParticipantValidation } from '../validation/ParticipantValidation'

// --- PERBAIKAN: Props sekarang menerima array langsung, bukan objek { data: ... } ---
interface EditParticipantFormProps {
  userId: string
  onSuccess?: () => void
}

export function EditParticipantForm({ userId, onSuccess }: EditParticipantFormProps) {
  const router = useRouter()
  const { data: userData, isLoading: isLoadingUser } = useGetParticipantById(userId)
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles()
  const { data: unitsData, isLoading: isLoadingUnits } = useGetAllUnits()
  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetAllDivisions()

  const updateParticipant = useUpdateParticipant(userId)

  const roles = rolesData?.data || []
  const units = unitsData?.data || []
  const divisions = divisionsData?.data || []

  const [isFormReady, setIsFormReady] = useState(false)

  const form = useForm<UpdateParticipantFormValues>({
    resolver: zodResolver(UpdateParticipantValidation),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      roleId: '',
      unitId: '',
      divisionId: ''
    }
  })

  useEffect(() => {
    if (userData && roles.length > 0 && units.length > 0 && divisions.length > 0) {
      form.reset({
        name: userData.name,
        email: userData.email,
        roleId: String(userData.role.id),
        unitId: String(userData.unit.id),
        divisionId: String(userData.division.id),
        password: '',
        confirmPassword: ''
      })

      // Mengatur flag setelah form.reset() selesai
      setIsFormReady(true)
    } else {
      // Set false saat loading atau data belum lengkap
      setIsFormReady(false)
    }
  }, [userData, form, roles.length, units.length, divisions.length])

  if (isLoadingRoles || isLoadingUnits || isLoadingUser || isLoadingDivisions || !isFormReady) {
    return <DynamicSkeleton variant="dialogForm" />
  }

  const onSubmit = (values: UpdateParticipantFormValues) => {
    updateParticipant.mutateAsync(values, {
      onSuccess: () => {
        toast.success('User participant berhasil diperbarui!')
        router.push('/admin/participants')
        onSuccess?.()
      },
      onError: (error: unknown) => {
        const message =
          error instanceof Error
            ? error.message
            : typeof error === 'object' && error && 'message' in error
              ? (error as { message?: string }).message
              : 'Gagal memperbarui user'
        toast.error(message)
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Ubah Data Participant</CardTitle>
            <CardDescription>Isi detail di bawah ini untuk mengubah data participant.</CardDescription>
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
                          <SelectValue placeholder="Pilih Role" className="truncate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={String(role.id)} className="truncate">
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
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Divisi</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Divisi" className="truncate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {divisions.map((division) => (
                          <SelectItem key={division.id} value={String(division.id)} className="truncate">
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
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Unit" className="truncate" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.map((unit) => (
                          <SelectItem key={unit.id} value={unit.id} className="truncate">
                            {unit.name}
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
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
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={updateParticipant.isPending}>
              {updateParticipant.isPending ? 'Menyimpan...' : 'Simpan Participant'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
