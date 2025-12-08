import axiosInstance from '@/lib/axios'
import { normalizePaginatedResponse } from '@/lib/apiTableHelper'
import type { ApiResponse, PaginatedResponse, RawPaginatedResponse } from '@/types/api/api'
import type { Participant, ParticipantsParams, CreateParticipantRequest, UpdateParticipantRequest } from '@/types/api/participantType'

// Fungsi untuk mengambil daftar participant dengan filter dan paginasi
export const getParticipants = async (params: ParticipantsParams = {}): Promise<PaginatedResponse<Participant>> => {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', params.page.toString())
  if (params.limit) searchParams.set('limit', params.limit.toString())
  if (params.search) searchParams.set('search', params.search)
  if (params.roleId) searchParams.set('roleId', params.roleId)
  if (params.unitId) searchParams.set('unitId', params.unitId)
  if (params.divisionId) searchParams.set('divisionId', params.divisionId)

  const response = await axiosInstance.get<RawPaginatedResponse<Participant>>(`/admin/participants?${searchParams.toString()}`)
  return normalizePaginatedResponse(response.data)
}

// Fungsi untuk membuat participant baru
export const createParticipant = async (data: CreateParticipantRequest): Promise<Participant> => {
  const response = await axiosInstance.post<ApiResponse<Participant>>('/admin/participants', data)
  return response.data.data
}

// Fungsi untuk mengambil detail satu participant
export const getParticipantById = async (userId: string): Promise<Participant> => {
  const response = await axiosInstance.get<ApiResponse<Participant>>(`/admin/participants/${userId}`)
  return response.data.data
}

// Fungsi untuk mengupdate participant
export const updateParticipant = async (userId: string, data: UpdateParticipantRequest): Promise<Participant> => {
  const response = await axiosInstance.patch<ApiResponse<Participant>>(`/admin/participants/${userId}`, data)
  return response.data.data
}

// Fungsi untuk menghapus participant
export const deleteParticipant = async (userId: string): Promise<{ message: string }> => {
  const response = await axiosInstance.delete<{ message: string }>(`/admin/participants/${userId}`)
  return response.data
}
