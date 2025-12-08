import type { PaginatedResponse } from '@/types/api/api'

// Tipe data utama untuk satu participant, termasuk relasi
export interface Participant {
  id: string
  name: string
  email: string
  role: {
    id: string
    name: string
  }
  unit: {
    id: string
    name: string
  }
  division: {
    id: string
    name: string
  }
}

// Tipe data untuk parameter query saat mengambil daftar participant
export interface ParticipantsParams {
  page?: number
  limit?: number
  search?: string
  roleId?: string
  unitId?: string
  divisionId?: string
}

// Tipe data untuk membuat participant baru
export interface CreateParticipantRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  roleId: string
  unitId: string
  divisionId: string
}

// Tipe data untuk mengupdate participant
export interface UpdateParticipantRequest {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  roleId?: string
  unitId?: string
  divisionId?: string
}

// Tipe data untuk response yang berisi daftar participant dengan paginasi
export type ParticipantsResponse = PaginatedResponse<Participant>
