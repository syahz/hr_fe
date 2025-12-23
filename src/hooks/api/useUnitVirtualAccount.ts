'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ApiError } from '@/types/api/api'
import type {
  CreateUnitVirtualAccountRequest,
  UpdateUnitVirtualAccountRequest,
  UnitVirtualAccountResponse,
  UnitVirtualAccountsParams
} from '@/types/api/unitVirtualAccountType'
import { createUnitVA, deleteUnitVA, getUnitVA, listUnitVAs, listUnitVAsByUnitId, updateUnitVA } from '@/services/UnitVirtualAccountServices'

export function useGetUnitVAs(params: UnitVirtualAccountsParams = {}) {
  return useQuery({
    queryKey: ['units-va', params],
    queryFn: () => listUnitVAs(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) return false
      return failureCount < 3
    },
    retryDelay: (i) => Math.min(1000 * 2 ** i, 20000)
  })
}

export function useGetUnitVAById(id?: string) {
  return useQuery<UnitVirtualAccountResponse>({
    queryKey: ['units-va', id],
    queryFn: () => getUnitVA(id as string),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) return false
      return failureCount < 3
    },
    retryDelay: (i) => Math.min(1000 * 2 ** i, 20000)
  })
}

export function useGetUnitVAsByUnitId(unitId?: string) {
  return useQuery<UnitVirtualAccountResponse[]>({
    queryKey: ['units-va', 'by-unit', unitId],
    queryFn: () => listUnitVAsByUnitId(unitId as string),
    enabled: !!unitId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error) => {
      const apiError = error as ApiError
      if (apiError.code && ['401', '403', '404'].includes(apiError.code)) return false
      return failureCount < 3
    },
    retryDelay: (i) => Math.min(1000 * 2 ** i, 20000)
  })
}

export function useCreateUnitVA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateUnitVirtualAccountRequest) => createUnitVA(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units-va'] })
    }
  })
}

export function useUpdateUnitVA(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateUnitVirtualAccountRequest) => updateUnitVA(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units-va'] })
      qc.invalidateQueries({ queryKey: ['units-va', id] })
    }
  })
}

export function useDeleteUnitVA() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUnitVA(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['units-va'] })
    }
  })
}
