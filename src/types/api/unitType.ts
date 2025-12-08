import type { PaginatedResponse } from '@/types/api/api'

// Tipe data utama untuk satu unit
export interface Unit {
  id: string
  name: string
  code: string
}

// Tipe data untuk parameter query saat mengambil daftar unit
export interface UnitsParams {
  page?: number
  limit?: number
  search?: string
}

// Tipe data untuk membuat unit baru
export interface CreateUnitRequest {
  name: string
  code: string
}

// Tipe data untuk mengupdate unit
export interface UpdateUnitRequest {
  name?: string
  code?: string
}

// Tipe data untuk response yang berisi daftar Unit dengan paginasi
export type UnitResponse = PaginatedResponse<Unit>
