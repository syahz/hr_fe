import axiosInstance from '@/lib/axios'
import { Unit, UnitsParams, CreateUnitRequest, UpdateUnitRequest } from '@/types/api/unitType' // Added Create/Update types
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'

/**
 * Fungsi helper untuk normalisasi error dari Axios
 */
const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    return {
      message: err.response?.data?.errors || defaultMsg,
      code: err.response?.data?.code || defaultCode,
      details: err.response?.data?.details
    }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * Fungsi untuk mengambil daftar unit dengan filter dan paginasi
 */
export const getUnits = async (params: UnitsParams = {}): Promise<PaginatedResponse<Unit>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await axiosInstance.get<RawPaginatedResponse<Unit>>(`/admin/units?${searchParams.toString()}`)
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data unit', 'GET_UNITS_ERROR')
  }
}

/**
 * Fungsi untuk mengambil daftar semua unit (tanpa paginasi)
 */
export const getAllUnits = async (): Promise<ApiResponse<Unit[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Unit[]>>(`/units/all`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil semua data unit', 'GET_ALL_UNITS_ERROR')
  }
}

/**
 * Fungsi untuk mengambil detail unit berdasarkan ID
 */
export const getUnitById = async (id: string): Promise<Unit> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Unit>>(`/admin/units/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail unit', 'GET_UNIT_BY_ID_ERROR')
  }
}

/**
 * Fungsi untuk membuat unit baru
 */
export const createUnit = async (data: CreateUnitRequest): Promise<Unit> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Unit>>(`/admin/units`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat unit baru', 'CREATE_UNIT_ERROR')
  }
}

/**
 * Fungsi untuk memperbarui unit berdasarkan ID
 */
export const updateUnit = async (id: string, data: UpdateUnitRequest): Promise<Unit> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Unit>>(`/admin/units/${id}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui unit', 'UPDATE_UNIT_ERROR')
  }
}

/**
 * Fungsi untuk menghapus unit berdasarkan ID
 */
export const deleteUnit = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/units/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus unit', 'DELETE_UNIT_ERROR')
  }
}
