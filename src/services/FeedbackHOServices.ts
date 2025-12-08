import axiosInstance from '@/lib/axios'
import { buildSearchParams } from '@/lib/http'
import { normalizePaginatedWithSummary } from '@/lib/apiTableHelper'
import type { ApiError, PaginatedResponse, PaginatedWithSummary } from '@/types/api/api'
import type {
  CreateFeedbackHeadOfficeRequest,
  DashboardSummary,
  FeedbackHeadOffice,
  FeedbacksHeadOfficeParams,
  GetDashboardFeedbacksResponse
} from '@/types/api/feedbackHOType'

const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return { message: err.response?.data?.errors || defaultMsg, code: err.response?.data?.code || defaultCode, details: err.response?.data?.details }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * ADMIN: Mengambil data dashboard feedback Head Office (SLA): summary + daftar feedbacks Head Office (SLA).
 */
export const getAdminDashboardFeedbacksHeadOffice = async (
  params: FeedbacksHeadOfficeParams = {}
): Promise<PaginatedWithSummary<FeedbackHeadOffice, DashboardSummary>> => {
  try {
    const searchString = buildSearchParams({
      page: params.page,
      limit: params.limit,
      search: params.search,
      divisionId: params.divisionId
    })

    const response = await axiosInstance.get<{ data: GetDashboardFeedbacksResponse }>(
      `/admin/feedback-ho/dashboard${searchString ? `?${searchString}` : ''}`
    )

    return normalizePaginatedWithSummary<FeedbackHeadOffice, DashboardSummary>(
      response.data as unknown as {
        data: { feedbacks: FeedbackHeadOffice[]; summary: DashboardSummary; pagination: PaginatedResponse<FeedbackHeadOffice>['pagination'] }
      }
    )
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil data pengadaan untuk dashboard (admin)', 'GET_ADMIN_DASHBOARD_FEEDBACKS_ERROR')
  }
}

/**
 * Mengambil detail pengadaan berdasarkan ID surat.
 */
export const getFeedbackHeadOfficeDetails = async (letterId: string): Promise<FeedbackHeadOffice> => {
  try {
    const response = await axiosInstance.get<{ data: FeedbackHeadOffice }>(`/admin/feedback-ho/${letterId}`)
    return response.data.data
  } catch (error) {
    throw normalizeError(error, 'Gagal mengambil detail feedback', 'GET_FEEDBACK_DETAILS_ERROR')
  }
}

/**
 * Membuat pengadaan baru (dengan upload file).
 */
export const createFeedbackHeadOffice = async (data: CreateFeedbackHeadOfficeRequest): Promise<FeedbackHeadOffice> => {
  try {
    // Kirim sebagai JSON (tanpa upload file)
    const response = await axiosInstance.post('/feedback-ho', data)
    return response.data.data
  } catch (error) {
    console.log(error)
    throw normalizeError(error, 'Gagal membuat feedback baru', 'CREATE_FEEDBACK_ERROR')
  }
}
