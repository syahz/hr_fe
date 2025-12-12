'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createSpp, updateSpp, deleteSpp, getSpp, listSpp } from '@/services/SuratPerintahPembayaranServices'
import type { CreateSppRequest, UpdateSppRequest, GetAllSppResponse, SppResponse } from '@/types/api/spp'

export function useListSpp(params: { page?: number; limit?: number; unit_id?: string; year?: number; month?: number }) {
  return useQuery<GetAllSppResponse, Error>({
    queryKey: ['spp', params],
    queryFn: () => listSpp(params)
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
  const qc = useQueryClient()
  return useMutation<SppResponse, Error, CreateSppRequest>({
    mutationFn: (payload) => createSpp(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spp'] })
    }
  })
}

export function useUpdateSpp(id: string) {
  const qc = useQueryClient()
  return useMutation<SppResponse, Error, UpdateSppRequest>({
    mutationFn: (payload) => updateSpp(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spp'] })
      qc.invalidateQueries({ queryKey: ['spp', id] })
    }
  })
}

export function useDeleteSpp() {
  const qc = useQueryClient()
  return useMutation<{ ok: boolean }, Error, string>({
    mutationFn: (id) => deleteSpp(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['spp'] })
    }
  })
}
