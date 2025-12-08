'use client'

import { ApiError } from '@/types/api/api'
import { createDivision, deleteDivision, getAllDivisions, getDivisionById, getDivisions, updateDivision } from '@/services/DivisionServices'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CreateDivisionRequest, DivisionParams, UpdateDivisionRequest } from '@/types/api/divisionType'

/**
 * (GET) Hook untuk mengambil daftar Divisi untuk select dropdown (tanpa paginasi)
 */
export function useGetAllDivisions() {
  return useQuery({
    queryKey: ['divisions'],
    queryFn: () => getAllDivisions(),
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

/*
 * (GET) Hook untuk mengambil daftar Divisi dengan filter dan paginasi
 */
export function useGetDivisions(params: DivisionParams = {}) {
  return useQuery({
    queryKey: ['divisions', params],
    queryFn: () => getDivisions(params),
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

/*
 * (GET) Hook untuk mengambil detail Divisi berdasarkan ID
 */
export function useGetDivisionById(divisionId: string) {
  return useQuery({
    queryKey: ['divisions', divisionId],
    queryFn: () => getDivisionById(divisionId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!divisionId, // Hanya jalankan query jika divisionId tersedia
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      // Don't retry on 4xx errors except 408, 429
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) {
        return false
      }
      return failureCount < 3
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 20000)
  })
}

/*
 * (POST) Hook untuk membuat Divisi baru
 */
export function useCreateDivisions() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateDivisionRequest) => createDivision(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
    }
  })
}

/*
 * (PUT) Hook untuk menupdate Divisi berdasarkan ID
 */
export function useUpdateDivision(divisionId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateDivisionRequest) => updateDivision(divisionId, data as UpdateDivisionRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
      queryClient.invalidateQueries({ queryKey: ['divisions', divisionId] })
    }
  })
}

/*
 * (DELETE)  Hook untuk menghapus Divisi berdasarkan ID
 */
export function useDeleteDivision() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteDivision(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['divisions'] })
    }
  })
}
