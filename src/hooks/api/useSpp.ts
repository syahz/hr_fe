'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSpp, updateSpp, deleteSpp, getSpp, listSpp } from '@/services/SuratPerintahPembayaranServices'
import type { CreateSppRequest, UpdateSppRequest, SppResponse, SppParams } from '@/types/api/spp'
import { ApiError } from '@/types/api/api'

export function useListSpp(params: SppParams = {}) {
  return useQuery({
    queryKey: ['spp', params],
    queryFn: () => listSpp(params),
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

export function useGetSpp(id: string) {
  return useQuery<SppResponse, Error>({
    queryKey: ['spp', id],
    queryFn: () => getSpp(id),
    enabled: !!id
  })
}

export function useCreateSpp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSppRequest) => createSpp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spp'] })
    }
  })
}

export function useUpdateSpp(SppId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateSppRequest) => updateSpp(SppId, data as UpdateSppRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spp'] })
      queryClient.invalidateQueries({ queryKey: ['spp', SppId] })
    }
  })
}

export function useDeleteSpp() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteSpp(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spp'] })
    }
  })
}
