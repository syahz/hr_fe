'use client'

import { ApiError } from '@/types/api/api'
import { CreateRoleRequest, RolesParams, UpdateRoleRequest } from '@/types/api/roleType'
import { getAllRoles, getRoles, createRole, deleteRole, getRoleById, updateRole } from '@/services/RoleServices'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

/*
 * Hook untuk mengambil daftar Role dengan filter dan paginasi
 */
export function useGetRoles(params: RolesParams = {}) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => getRoles(params),
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
 * Hook untuk mengambil semua Role tanpa paginasi (untuk dropdown select)
 */
export function useGetAllRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => getAllRoles(),
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
 * Hook untuk mengambil detail Role berdasarkan ID
 */
export function useGetRoleById(roleId: string) {
  return useQuery({
    queryKey: ['roles', roleId],
    queryFn: () => getRoleById(roleId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!roleId, // Hanya jalankan query jika roleId tersedia
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
 * Hook untuk membuat Role baru
 */
export function useCreateRoles() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateRoleRequest) => createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })
}

/*
 * Hook untuk menupdate Role berdasarkan ID
 */
export function useUpdateRole(roleId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRole(roleId, data as UpdateRoleRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
      queryClient.invalidateQueries({ queryKey: ['roles', roleId] })
    }
  })
}

/*
 * Hook untuk menghapus Role berdasarkan ID
 */
export function useDeleteRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  })
}
