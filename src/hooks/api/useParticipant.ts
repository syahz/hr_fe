import type { ApiError } from '@/types/api/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ParticipantsParams, CreateParticipantRequest, UpdateParticipantRequest } from '@/types/api/participantType'
import { createParticipant, deleteParticipant, getParticipantById, getParticipants, updateParticipant } from '@/services/ParticipantServices'

// Hook untuk mengambil daftar Participant
export function useGetParticipants(params: ParticipantsParams = {}) {
  return useQuery({
    queryKey: ['participants', params],
    queryFn: () => getParticipants(params),
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

export function useCreateParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateParticipantRequest) => createParticipant(data),
    onSuccess: () => {
      // Refetch participants list secara otomatis
      queryClient.invalidateQueries({ queryKey: ['participants'] })
    }
  })
}

export function useGetParticipantById(userId: string) {
  return useQuery({
    queryKey: ['participants', userId],
    queryFn: () => getParticipantById(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!userId, // Hanya jalankan query jika userId tersedia
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

export function useUpdateParticipant(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateParticipantRequest) => updateParticipant(userId, data),
    onSuccess: () => {
      // Refetch users list secara otomatis
      queryClient.invalidateQueries({ queryKey: ['participants'] })
    }
  })
}

export function useDeleteParticipant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => deleteParticipant(userId),
    onSuccess: () => {
      // Refetch users list secara otomatis
      queryClient.invalidateQueries({ queryKey: ['participants'] })
    }
  })
}
