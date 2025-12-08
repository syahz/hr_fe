import axiosInstance from '@/lib/axios'
import { buildSearchParams } from '@/lib/http'
import { normalizePaginatedWithSummary } from '@/lib/apiTableHelper'
import type { ApiError, PaginatedResponse, PaginatedWithSummary } from '@/types/api/api'
import type { CreateFeedbackRequest, DashboardSummary, Feedback, FeedbacksParams, GetDashboardFeedbacksResponse } from '@/types/api/feedbackType'

const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return { message: err.response?.data?.errors || defaultMsg, code: err.response?.data?.code || defaultCode, details: err.response?.data?.details }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * ADMIN: Mengambil data dashboard feedback: summary + daftar feedbacks.
 */
export const getAdminDashboardFeedbacks = async (params: FeedbacksParams = {}): Promise<PaginatedWithSummary<Feedback, DashboardSummary>> => {
  try {
    const searchString = buildSearchParams({
      page: params.page,
      limit: params.limit,
      search: params.search,
      unitId: params.unitId
    })

    const response = await axiosInstance.get<{ data: GetDashboardFeedbacksResponse }>(
      `/admin/feedbacks/dashboard${searchString ? `?${searchString}` : ''}`
    )

    return normalizePaginatedWithSummary<Feedback, DashboardSummary>(
      response.data as unknown as {
        data: { feedbacks: Feedback[]; summary: DashboardSummary; pagination: PaginatedResponse<Feedback>['pagination'] }
      }
    )
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data pengadaan untuk dashboard (admin)', 'GET_ADMIN_DASHBOARD_FEEDBACKS_ERROR')
  }
}

/**
 * Mengambil daftar feedback user.
 */
export const getUserDashboardFeedbacks = async (params: FeedbacksParams = {}): Promise<PaginatedWithSummary<Feedback, DashboardSummary>> => {
  try {
    const searchString = buildSearchParams({
      page: params.page,
      limit: params.limit,
      search: params.search,
      unitId: params.unitId
    })

    const response = await axiosInstance.get<{ data: GetDashboardFeedbacksResponse }>(`/admin/feedbacks${searchString ? `?${searchString}` : ''}`)

    return normalizePaginatedWithSummary<Feedback, DashboardSummary>(
      response.data as unknown as {
        data: { feedbacks: Feedback[]; summary: DashboardSummary; pagination: PaginatedResponse<Feedback>['pagination'] }
      }
    )
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data pengadaan untuk dashboard (admin)', 'GET_ADMIN_DASHBOARD_FEEDBACKS_ERROR')
  }
}

/**
 * Mengambil detail pengadaan berdasarkan ID surat.
 */
export const getFeedbackDetails = async (letterId: string): Promise<Feedback> => {
  try {
    const response = await axiosInstance.get<{ data: Feedback }>(`/admin/feedbacks/${letterId}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil detail feedback', 'GET_FEEDBACK_DETAILS_ERROR')
  }
}

/**
 * Membuat pengadaan baru (dengan upload file).
 */
export const createFeedback = async (data: CreateFeedbackRequest): Promise<Feedback> => {
  try {
    // Kirim sebagai JSON (tanpa upload file)
    const response = await axiosInstance.post('/feedback', data)
    return response.data.data
  } catch (error) {
    console.log(error)
    throw normalizeError(error, 'Gagal membuat feedback baru', 'CREATE_FEEDBACK_ERROR')
  }
}
