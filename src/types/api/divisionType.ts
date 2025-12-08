import type { PaginatedResponse } from '@/types/api/api'

// Tipe data utama untuk satu division
export interface Division {
  id: string
  name: string
}

export interface DivisionParams {
  page?: number
  limit?: number
  search?: string
}

// Tipe data untuk membuat division baru
export interface CreateDivisionRequest {
  name: string
}

// Tipe data untuk mengupdate division
export interface UpdateDivisionRequest {
  name?: string
  code?: string
}

// Tipe data untuk response yang berisi daftar Division dengan paginasi
export type DivisionResponse = PaginatedResponse<Division>
