// lib/api-helpers.ts
import type { RawPaginatedResponse, PaginatedResponse, PaginatedWithSummary } from '@/types/api/api'

export function normalizePaginatedResponse<T>(raw: RawPaginatedResponse<T>): PaginatedResponse<T> {
  const { data } = raw
  // ambil field array pertama (misal "user" atau "business_entities")
  const [items] = Object.values(data).filter(Array.isArray) as T[][]

  return {
    items: items || [],
    pagination: data.pagination
  }
}

// Normalize a response that contains { feedbacks: T[], summary: S, pagination }
export function normalizePaginatedWithSummary<T, S>(raw: {
  data: { feedbacks: T[]; summary: S; pagination: PaginatedResponse<T>['pagination'] }
}): PaginatedWithSummary<T, S> {
  const { feedbacks, summary, pagination } = raw.data
  return {
    items: feedbacks || [],
    pagination,
    summary
  }
}
