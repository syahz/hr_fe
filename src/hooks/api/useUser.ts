import type { ApiError } from '@/types/api/api'
import { getUser, updateAccountAuditor, updateAccountPassword, updateAccountUser } from '@/services/User'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { UpdateAccountAuditorRequest, UpdateAccountPasswordRequest, UpdateAccountRequest } from '@/types/api/user'

// Hook to fetch user data user
export function useGetUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
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

// Hook to update auditor user data
export function useUpdateAccountAuditor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAccountAuditorRequest) => updateAccountAuditor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}
// Hook to update user account password
export function useUpdateAccountPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAccountPasswordRequest) => updateAccountPassword(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}

// Hook to update user account data
export function useUpdateAccountUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: UpdateAccountRequest) => updateAccountUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    }
  })
}
