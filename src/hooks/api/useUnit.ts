'use client'

import { ApiError } from '@/types/api/api'
import { CreateUnitRequest, UnitsParams, UpdateUnitRequest } from '@/types/api/unitType'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createUnit, deleteUnit, getAllUnits, getUnitById, getUnits, updateUnit } from '@/services/UnitServices'

// (GET) Hook untuk mengambil daftar Unit dengan paginasi dan filter
export function useGetUnits(params: UnitsParams = {}) {
  return useQuery({
    queryKey: ['units', params],
    queryFn: () => getUnits(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

// (GET) Hook untuk mengambil daftar Unit untuk select dropdown (tanpa paginasi)
export function useGetAllUnits() {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => getAllUnits(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

// (GET) Hook untuk mengambil detail Unit berdasarkan ID
export function useGetUnitById(unitId: string) {
  return useQuery({
    queryKey: ['units', unitId],
    queryFn: () => getUnitById(unitId),
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

// (POST) Hook untuk membuat data Unit
export function useCreateUnit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUnitRequest) => createUnit(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    }
  })
}

// (PUT) Hook untuk mengupdate data Unit berdasarkan ID
export function useUpdateUnit(unitId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateUnitRequest) => updateUnit(unitId, data as UpdateUnitRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
      queryClient.invalidateQueries({ queryKey: ['units', unitId] })
    }
  })
}

// (DELETE) Hook untuk menghapus data Unit berdasarkan ID
export function useDeleteUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (unitId: string) => deleteUnit(unitId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['units'] })
    }
  })
}
