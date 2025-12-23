import axiosInstance from '@/lib/axios'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type {
  CreateUnitVirtualAccountRequest,
  UpdateUnitVirtualAccountRequest,
  UnitVirtualAccountResponse,
  UnitVirtualAccountsParams
} from '@/types/api/unitVirtualAccountType'

const toApiError = (error: unknown, fallbackMessage: string, fallbackCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; message?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.errors || err.response?.data?.message || fallbackMessage,
      code: err.response?.data?.code || fallbackCode,
      details: err.response?.data?.details
    }
  }
  return { message: fallbackMessage, code: fallbackCode, details: undefined }
}

export async function listUnitVAs(params: UnitVirtualAccountsParams = {}): Promise<PaginatedResponse<UnitVirtualAccountResponse>> {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', String(params.page))
    if (params.limit) searchParams.set('limit', String(params.limit))
    if (params.search) searchParams.set('search', params.search)

    const res = await axiosInstance.get<RawPaginatedResponse<UnitVirtualAccountResponse>>(`/admin/units-va?${searchParams.toString()}`)
    return normalizePaginatedResponse(res.data)
  } catch (error) {
    throw toApiError(error, 'Gagal mengambil data VA Unit', 'UNIT_VA_LIST_ERROR')
  }
}

export async function getUnitVA(id: string): Promise<UnitVirtualAccountResponse> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<UnitVirtualAccountResponse>>(`/admin/units-va/${id}`)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Gagal mengambil detail VA Unit', 'UNIT_VA_GET_ERROR')
  }
}

// Get list of Unit VA by Unit ID (array response)
export async function listUnitVAsByUnitId(unitId: string): Promise<UnitVirtualAccountResponse[]> {
  try {
    const { data } = await axiosInstance.get<ApiResponse<UnitVirtualAccountResponse[]>>(`/admin/units-va/unit/${unitId}`)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Gagal mengambil daftar VA Unit berdasarkan Unit ID', 'UNIT_VA_LIST_BY_UNIT_ERROR')
  }
}

export async function createUnitVA(payload: CreateUnitVirtualAccountRequest): Promise<UnitVirtualAccountResponse> {
  try {
    const { data } = await axiosInstance.post<ApiResponse<UnitVirtualAccountResponse>>(`/admin/units-va`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Gagal membuat VA Unit', 'UNIT_VA_CREATE_ERROR')
  }
}

export async function updateUnitVA(id: string, payload: UpdateUnitVirtualAccountRequest): Promise<UnitVirtualAccountResponse> {
  try {
    const { data } = await axiosInstance.put<ApiResponse<UnitVirtualAccountResponse>>(`/admin/units-va/${id}`, payload)
    return data.data
  } catch (error) {
    throw toApiError(error, 'Gagal memperbarui VA Unit', 'UNIT_VA_UPDATE_ERROR')
  }
}

export async function deleteUnitVA(id: string): Promise<{ ok: boolean } | void> {
  try {
    const { data } = await axiosInstance.delete<ApiResponse<{ ok: boolean }>>(`/admin/units-va/${id}`)
    return data?.data
  } catch (error) {
    throw toApiError(error, 'Gagal menghapus VA Unit', 'UNIT_VA_DELETE_ERROR')
  }
}
