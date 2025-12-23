import type { PaginatedResponse } from '@/types/api/api'

export interface UnitRef {
  id: string
  name: string
  code: string
}

export interface UnitVirtualAccountResponse {
  id: string
  unit: UnitRef
  va_number: string
  va_bank: string
  va_name: string
}

export interface CreateUnitVirtualAccountRequest {
  unit_id: string
  va_number: string
  va_bank: string
  va_name: string
}

export type UpdateUnitVirtualAccountRequest = Partial<CreateUnitVirtualAccountRequest>

export interface UnitVirtualAccountsParams {
  page?: number
  limit?: number
  search?: string
}

export type UnitVirtualAccountPaginated = PaginatedResponse<UnitVirtualAccountResponse>
