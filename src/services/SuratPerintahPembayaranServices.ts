import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import axiosInstance from '@/lib/axios'
import type { ApiError, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type { CreateSppRequest, UpdateSppRequest, SppResponse } from '@/types/api/spp'

function toApiError(error: unknown, fallbackMessage: string, fallbackCode: string): ApiError {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.message || fallbackMessage,
      code: err.response?.data?.code || fallbackCode,
      details: err.response?.data?.details
    }
  }
  return { message: fallbackMessage, code: fallbackCode, details: undefined }
}

export async function createSpp(payload: CreateSppRequest): Promise<SppResponse> {
  try {
    const { data } = await axiosInstance.post<{ data: SppResponse }>('/admin/spp', payload)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Failed to create SPP', 'SPP_CREATE_ERROR')
  }
}

export async function updateSpp(id: string, payload: UpdateSppRequest): Promise<SppResponse> {
  try {
    const { data } = await axiosInstance.put<{ data: SppResponse }>(`/admin/spp/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Failed to update SPP', 'SPP_UPDATE_ERROR')
  }
}

export async function getSpp(id: string): Promise<SppResponse> {
  try {
    const { data } = await axiosInstance.get<{ data: SppResponse }>(`/admin/spp/${id}`)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Failed to get SPP detail', 'SPP_GET_ERROR')
  }
}

export async function deleteSpp(id: string): Promise<{ ok: boolean }> {
  try {
    const { data } = await axiosInstance.delete<{ data: { ok: boolean } }>(`/admin/spp/${id}`)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Failed to delete SPP', 'SPP_DELETE_ERROR')
  }
}

export async function listSpp(params: {
  page?: number
  limit?: number
  unit_id?: string
  year?: number
  month?: number
}): Promise<PaginatedResponse<SppResponse>> {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.unit_id) searchParams.set('unit_id', params.unit_id)
    if (params.year) searchParams.set('year', String(params.year))
    if (params.month) searchParams.set('month', String(params.month))

    const response = await axiosInstance.get<RawPaginatedResponse<SppResponse>>(`/admin/spp?${searchParams.toString()}`)
    return normalizePaginatedResponse(response.data)
  } catch (error) {
    throw toApiError(error, 'Failed to list SPP', 'SPP_LIST_ERROR')
  }
}
