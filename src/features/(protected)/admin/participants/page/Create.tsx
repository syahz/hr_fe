'use client'

import React from 'react'
import { PageContainer } from '@/components/layout/PageContainer'
import { CreateParticipantForm } from '../components/forms/CreateParticipantForm'
// Asumsi hook Anda mengembalikan data dengan tipe { data: T[] }
import { useGetAllRoles } from '@/hooks/api/useRole'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { Skeleton } from '@/components/ui/skeleton' // Menggunakan skeleton untuk loading state
import { useGetAllDivisions } from '@/hooks/api/useDivision'

const Create = () => {
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles()
  const { data: unitsData, isLoading: isLoadingUnits } = useGetAllUnits()
  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetAllDivisions()

  // Menampilkan loading state yang lebih baik
  if (isLoadingRoles || isLoadingUnits || isLoadingDivisions) {
    return (
      <PageContainer>
        <div className="w-full max-w-3xl mx-auto space-y-4 p-4 border rounded-lg">
          <Skeleton className="h-10 w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </PageContainer>
    )
  }

  // --- PERBAIKAN: Ekstrak array dari dalam objek 'data' sebelum dilempar sebagai props ---
  const roles = rolesData?.data || []
  const units = unitsData?.data || []
  const divisions = divisionsData?.data || []

  return (
    <PageContainer>
      <CreateParticipantForm roles={roles} units={units} divisions={divisions} />
    </PageContainer>
  )
}

export default Create
