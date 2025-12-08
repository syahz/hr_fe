import axiosInstance from '@/lib/axios'
import {
  UpdateAccountAuditorRequest,
  UpdateAccountPasswordRequest,
  UpdateAccountRequest,
  UpdateAccountResponse,
  UserResponse
} from '@/types/api/user'
import type { ApiError, ApiResponse } from '@/types/api/api'

export const getUser = async (): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<UserResponse>>(`/admin/user`)

    return response.data
  } catch (error: unknown) {
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to create user',
        code: err.response?.data?.code || 'CREATE_USER_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to create user',
        code: 'CREATE_USER_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}

export const updateAccountAuditor = async (data: UpdateAccountAuditorRequest) => {
  try {
    const response = await axiosInstance.patch<ApiResponse<UpdateAccountResponse>>(`/admin/user/auditor`, data)
    return response.data
  } catch (error: unknown) {
    console.log(error)
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to update auditor user',
        code: err.response?.data?.code || 'UPDATE_AUDITOR_USER_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to update auditor user',
        code: 'UPDATE_AUDITOR_USER_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}

export const updateAccountPassword = async (data: UpdateAccountPasswordRequest) => {
  try {
    const response = await axiosInstance.patch<ApiResponse<UpdateAccountResponse>>(`/admin/user/password`, data)
    return response.data
  } catch (error: unknown) {
    console.log(error)
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to update user password',
        code: err.response?.data?.code || 'UPDATE_USER_PASSWORD_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to update user password',
        code: 'UPDATE_USER_PASSWORD_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}

export const updateAccountUser = async (data: UpdateAccountRequest) => {
  try {
    const response = await axiosInstance.patch<ApiResponse<UpdateAccountResponse>>(`/admin/user/user`, data)
    return response.data
  } catch (error: unknown) {
    console.log(error)
    let apiError: ApiError
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string; code?: string; details?: unknown } } }
      apiError = {
        message: err.response?.data?.message || 'Failed to update user',
        code: err.response?.data?.code || 'UPDATE_USER_ERROR',
        details: err.response?.data?.details
      }
    } else {
      apiError = {
        message: 'Failed to update user',
        code: 'UPDATE_USER_ERROR',
        details: undefined
      }
    }
    throw apiError
  }
}
