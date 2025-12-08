export interface FeedbacksHeadOfficeParams {
  page?: number
  limit?: number
  search?: string
  divisionId?: string
}

// Tipe data untuk satu item pengadaan yang diterima dari API
export interface FeedbackHeadOffice {
  id: string
  rating: 1 | 2 | 3 | 4 | 5
  suggestion?: string
  ipAddress: string
  division: { id: string; name: string }
  createdAt: Date
}

// ------ Form Data Types ------ //

interface FeedbackHeadOfficeFormData {
  rating: 1 | 2 | 3 | 4 | 5
  suggestion?: string
  divisionId: string
}

export type CreateFeedbackHeadOfficeRequest = FeedbackHeadOfficeFormData

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
  feedbacks: FeedbackHeadOffice[]
  pagination: {
    totalData: number
    page: number
    limit: number
    totalPage: number
  }
}
