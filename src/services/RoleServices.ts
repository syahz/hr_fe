import axiosInstance from '@/lib/axios'
import { CreateRoleRequest, Role, RolesParams, UpdateRoleRequest } from '@/types/api/roleType'
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
 * Fungsi untuk mengambil daftar role dengan filter dan paginasi
 */
export const getRoles = async (params: RolesParams = {}): Promise<PaginatedResponse<Role>> => {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set('page', params.page.toString())
    if (params.limit) searchParams.set('limit', params.limit.toString())
    if (params.search) searchParams.set('search', params.search)

    const response = await axiosInstance.get<RawPaginatedResponse<Role>>(`/admin/roles?${searchParams.toString()}`)
    console.log(response.data)
    return normalizePaginatedResponse(response.data)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil data roles', 'GET_ROLES_ERROR')
  }
}

/**
 * Fungsi untuk mengambil daftar semua role (tanpa paginasi)
 */
export const getAllRoles = async (): Promise<ApiResponse<Role[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Role[]>>(`/admin/roles/all`)
    return response.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil semua data roles', 'GET_ALL_ROLES_ERROR')
  }
}

/**
 * Fungsi untuk mengambil detail role berdasarkan ID
 */
export const getRoleById = async (id: string): Promise<Role> => {
  try {
    const response = await axiosInstance.get<ApiResponse<Role>>(`/admin/roles/${id}`)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal mengambil detail role', 'GET_ROLE_BY_ID_ERROR')
  }
}

/**
 * Fungsi untuk membuat role baru
 */
export const createRole = async (data: CreateRoleRequest): Promise<Role> => {
  try {
    const response = await axiosInstance.post<ApiResponse<Role>>('/admin/roles', data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal membuat role baru', 'CREATE_ROLE_ERROR')
  }
}

/**
 * Fungsi untuk mengupdate role berdasarkan ID
 */
export const updateRole = async (id: string, data: UpdateRoleRequest): Promise<Role> => {
  try {
    const response = await axiosInstance.put<ApiResponse<Role>>(`/admin/roles/${id}`, data)
    return response.data.data
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal memperbarui role', 'UPDATE_ROLE_ERROR')
  }
}

/**
 * Fungsi untuk menghapus role berdasarkan ID
 */
export const deleteRole = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/admin/roles/${id}`)
  } catch (error: unknown) {
    throw normalizeError(error, 'Gagal menghapus role', 'DELETE_ROLE_ERROR')
  }
}
