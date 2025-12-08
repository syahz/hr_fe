export interface FeedbacksParams {
  page?: number
  limit?: number
  search?: string
  unitId?: string
}

// Tipe data untuk satu item pengadaan yang diterima dari API
export interface Feedback {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  suggestion?: string
  ipAddress: string
  unit: { id: string; name: string }
  createdAt: Date
}

// ------ Form Data Types ------ //

interface FeedbackFormData {
  rating: 1 | 2 | 3 | 4 | 5
  suggestion?: string
  unitId: string
}

export type CreateFeedbackRequest = FeedbackFormData

// Dashboard summary types
export type DashboardSummary = {
  totalFeedbacks: number
  ratingDistribution: {
    rating1: number
    rating2: number
    rating3: number
    rating4: number
    rating5: number
  }
}

export type GetDashboardFeedbacksResponse = {
  summary: DashboardSummary
  feedbacks: Feedback[]
  pagination: {
    totalData: number
    page: number
    limit: number
    totalPage: number
  }
}
