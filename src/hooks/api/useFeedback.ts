'use client'

import { ApiError } from '@/types/api/api'
import { FeedbacksParams, CreateFeedbackRequest } from '@/types/api/feedbackType'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createFeedback, getAdminDashboardFeedbacks, getFeedbackDetails, getUserDashboardFeedbacks } from '@/services/FeedbackServices'

const feedbackQueryKeys = {
  all: ['feedbacks'] as const,
  lists: () => [...feedbackQueryKeys.all, 'list'] as const,
  list: (params: FeedbacksParams) => [...feedbackQueryKeys.lists(), params] as const
}

const customRetry = (failureCount: number, error: unknown) => {
  const apiError = error as ApiError
  if (apiError.code && ['401', '403', '404'].includes(String(apiError.code))) return false
  return failureCount < 3
}

export function useGetAdminDashboardFeedbacks(params: FeedbacksParams = {}) {
  return useQuery({
    queryKey: ['adminDashboardFeedbacks', params],
    queryFn: () => getAdminDashboardFeedbacks(params),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil daftar Feedback.
 */
export function useGetFeedbacks(params: FeedbacksParams = {}) {
  return useQuery({
    queryKey: feedbackQueryKeys.list(params),
    queryFn: () => getUserDashboardFeedbacks(params),
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk mengambil detail Feedback.
 */
export function useGetFeedbackDetails(feedbackId?: string) {
  return useQuery({
    queryKey: [...feedbackQueryKeys.all, feedbackId],
    queryFn: () => getFeedbackDetails(feedbackId as string),
    enabled: !!feedbackId,
    staleTime: 5 * 60 * 1000,
    retry: customRetry
  })
}

/**
 * Hook untuk membuat feedback.
 */
export function useCreateFeedback() {
  const queryClient = useQueryClient()
  return useMutation({
    // Terima CreateFeedbackRequest (JSON)
    mutationFn: (data: CreateFeedbackRequest) => createFeedback(data),
    onSuccess: () => {
      // Invalidate query list agar data di tabel/dashboard diperbarui
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.lists() })
    }
  })
}
