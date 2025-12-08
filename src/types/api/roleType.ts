import type { PaginatedResponse } from '@/types/api/api'

// Tipe data utama untuk satu role
export interface Role {
  id: string
  name: string
}

// Tipe data untuk parameter query saat mengambil daftar role
export interface RolesParams {
  page?: number
  limit?: number
  search?: string
}

// Tipe data untuk membuat role baru
export interface CreateRoleRequest {
  name: string
}

// Tipe data untuk mengupdate role
export interface UpdateRoleRequest {
  name?: string
}

// Tipe data untuk response yang berisi daftar Role dengan paginasi
export type RoleResponse = PaginatedResponse<Role>
