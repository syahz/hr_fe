import axiosInstance from '@/lib/axios'
import { CreateDivisionRequest, Division, DivisionParams, UpdateDivisionRequest } from '@/types/api/divisionType'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiError, ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'

/**
 * Fungsi helper untuk normalisasi error dari Axios
 */
const normalizeError = (error: unknown, defaultMsg: string, defaultCode: string): ApiError => {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const err = error as { response?: { data?: { errors?: string; code?: string; details?: unknown } } }
    // Menyesuaikan dengan format error backend Anda, yang menggunakan `errors`
    return {
      message: err.response?.data?.errors || defaultMsg,
      code: err.response?.data?.code || defaultCode,
      details: err.response?.data?.details
    }
  }
  return { message: defaultMsg, code: defaultCode, details: undefined }
}

/**
 * Fungsi untuk mengambil daftar divisi dengan filter dan paginasi
 */
export const getDivisions = async (params: DivisionParams = {}): Promise<PaginatedResponse<Division>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await axiosInstance.get<RawPaginatedResponse<Division>>(`/admin/divisions?${searchParams.toString()}`)
    console.log(response.data)
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data divisions', 'GET_DIVISIONS_ERROR')
  }
}

/**
 * Fungsi untuk mengambil daftar semua division (tanpa paginasi)
 */
export const getAllDivisions = async (): Promise<ApiResponse<Division[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Division[]>>(`/divisions/all`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil semua data divisions', 'GET_ALL_DIVISIONS_ERROR')
  }
}

/**
 * Fungsi untuk mengambil detail division berdasarkan ID
 */
export const getDivisionById = async (id: string): Promise<Division> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Division>>(`/admin/divisions/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail division', 'GET_DIVISION_BY_ID_ERROR')
  }
}

/**
 * Fungsi untuk membuat division baru
 */
export const createDivision = async (data: CreateDivisionRequest): Promise<Division> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Division>>('/admin/divisions', data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat division baru', 'CREATE_DIVISION_ERROR')
  }
}

/**
 * Fungsi untuk mengupdate division berdasarkan ID
 */
export const updateDivision = async (id: string, data: UpdateDivisionRequest): Promise<Division> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Division>>(`/admin/divisions/${id}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui role', 'UPDATE_ROLE_ERROR')
  }
}

/**
 * Fungsi untuk menghapus division berdasarkan ID
 */
export const deleteDivision = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/divisions/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus division', 'DELETE_DIVISION_ERROR')
  }
}
