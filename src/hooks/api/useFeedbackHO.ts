'use client'

import { ApiError } from '@/types/api/api'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateFeedbackHeadOfficeRequest, FeedbacksHeadOfficeParams } from '@/types/api/feedbackHOType'
import { createFeedbackHeadOffice, getAdminDashboardFeedbacksHeadOffice, getFeedbackHeadOfficeDetails } from '@/services/FeedbackHOServices'

const feedbackHeadOfficeQueryKeys = {
  all: ['feedbacks'] as const,
  lists: () => [...feedbackHeadOfficeQueryKeys.all, 'list'] as const,
  list: (params: FeedbacksHeadOfficeParams) => [...feedbackHeadOfficeQueryKeys.lists(), params] as const
}

const customRetry = (failureCount: number, error: unknown) => {
  const apiError = error as ApiError
  if (apiError.code && ['401', '403', '404'].includes(String(apiError.code))) return false
  return failureCount < 3
}

export function useGetAdminDashboardFeedbacksHeadOffice(params: FeedbacksHeadOfficeParams = {}) {
  return useQuery({
    queryKey: ['adminDashboardFeedbacks', params],
    queryFn: () => getAdminDashboardFeedbacksHeadOffice(params),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil detail Feedback.
 */
export function useGetFeedbackHeadOfficeDetails(feedbackId?: string) {
  return useQuery({
    queryKey: [...feedbackHeadOfficeQueryKeys.all, feedbackId],
    queryFn: () => getFeedbackHeadOfficeDetails(feedbackId as string),
    enabled: !!feedbackId,
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk membuat feedback.
 */
export function useCreateFeedbackHeadOffice() {
  const queryClient = useQueryClient()
  return useMutation({
    // Terima CreateFeedbackRequest (JSON)
    mutationFn: (data: CreateFeedbackHeadOfficeRequest) => createFeedbackHeadOffice(data),
    onSuccess: () => {
      // Invalidate query list agar data di tabel/dashboard diperbarui
      queryClient.invalidateQueries({ queryKey: feedbackHeadOfficeQueryKeys.lists() })
    }
  })
}
