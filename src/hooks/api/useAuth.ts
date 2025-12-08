'use client'

import { logout, ssoCallback } from '@/services/Auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export function useSSOLogin() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (code: string) => ssoCallback(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}

export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })
}
