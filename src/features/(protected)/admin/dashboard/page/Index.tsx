'use client'

import { useAuth } from '@/context/AuthContext'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { PageContainer } from '@/components/layout/PageContainer'
import { getDashboardSearchConfig } from '@/config/search-config'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useMemo, useState } from 'react'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useGetAdminDashboardFeedbacks } from '@/hooks/api/useFeedback'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText } from 'lucide-react'
import { FeedbacksTable } from '@/features/(protected)/user/feedbacks/components/table/FeedbackTable'
import { FeedbacksColumns } from '@/features/(protected)/user/feedbacks/components/table/FeedbackColumns'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

const StarIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354l-4.543 2.86c-1-.608-2.231.29-1.96 1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433L10.788 3.21z"
      clipRule="evenodd"
    />
  </svg>
)

const Index = () => {
  const { user } = useAuth()

  // Sorting & Pagination state
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  // Search & Filters (unitId)
  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({
    unitId: ''
  })

  // Units for filter options
  const { data: unitsData } = useGetAllUnits()
  const unitOptions = useMemo(() => {
    if (!unitsData?.data) return []
    return unitsData.data.map((u) => ({ value: u.id, label: u.name }))
  }, [unitsData])

  const dynamicSearchConfig = useMemo(() => getDashboardSearchConfig(unitOptions), [unitOptions])

  // Query params
  const selectedUnitId = useMemo(() => {
    if (!filters.unitId || filters.unitId === 'all' || filters.unitId === '') return undefined
    return String(filters.unitId)
  }, [filters.unitId])

  const selectedUnitName = useMemo(() => {
    if (!selectedUnitId) return null
    const match = unitOptions.find((u) => String(u.value) === String(selectedUnitId))
    return match?.label ?? null
  }, [selectedUnitId, unitOptions])

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    unitId: selectedUnitId
  }

  const { data: dashboardData } = useGetAdminDashboardFeedbacks(queryParams)
  console.log('Dashboard Data:', dashboardData)
  // Columns: reuse procurement columns without actions for dashboard
  const columns = useMemo(() => FeedbacksColumns(), [])

  const defaultData = useMemo(() => [], [])
  const table = useReactTable({
    data: dashboardData?.items || defaultData,
    columns,
    pageCount: dashboardData?.pagination?.totalPage ?? -1,
    state: { pagination: { pageIndex, pageSize }, sorting },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  return (
    <PageContainer>
      <div className="mb-8">
        <h2 className="text-xl font-bold tracking-tight">Hai, {user?.name || 'Pengguna'} 👋</h2>
        <p className="text-muted-foreground">
          {selectedUnitName
            ? `Ini adalah ringkasan aktivitas pada unit ${selectedUnitName}`
            : 'Ini adalah ringkasan aktivitas pada seluruh unit PT. BMU.'}
        </p>
      </div>
      <div className="grid mx-auto gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.totalFeedbacks ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total feedback yang diterima</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating 1</CardTitle>
            <div className=" flex items-center">
              {[...Array(1)].map((_, index) => {
                return <StarIcon key={index} className="h-6 w-6 text-yellow-400" />
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.ratingDistribution.rating1 ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total Rating 1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating 2</CardTitle>
            <div className=" flex items-center">
              {[...Array(2)].map((_, index) => {
                return <StarIcon key={index} className="h-6 w-6 text-yellow-400" />
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.ratingDistribution.rating2 ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total Rating 2</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating 3</CardTitle>
            <div className=" flex items-center">
              {[...Array(3)].map((_, index) => {
                return <StarIcon key={index} className="h-6 w-6 text-yellow-400" />
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.ratingDistribution.rating3 ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total Rating 3</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating 4</CardTitle>
            <div className=" flex items-center">
              {[...Array(4)].map((_, index) => {
                return <StarIcon key={index} className="h-6 w-6 text-yellow-400" />
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.ratingDistribution.rating4 ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total Rating 4</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating 5</CardTitle>
            <div className=" flex items-center">
              {[...Array(5)].map((_, index) => {
                return <StarIcon key={index} className="h-6 w-6 text-yellow-400" />
              })}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.summary.ratingDistribution.rating5 ?? 0}</div>
            <p className="text-xs text-muted-foreground">Total Rating 5</p>
          </CardContent>
        </Card>
      </div>

      {/* Search bar */}
      <div className="mt-8 space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={dynamicSearchConfig}
        />

        {/* Table */}
        <FeedbacksTable
          table={table}
          isLoading={!dashboardData && unitOptions.length === 0}
          isFetching={false}
          error={undefined}
          exportOptions={{ enabled: true, fileName: 'dashboard-feedbacks', formats: ['csv', 'xlsx'], includeHeaders: true }}
        />

        {/* Pagination */}
        {dashboardData?.pagination && (
          <DataTablePagination
            currentPage={dashboardData.pagination.page}
            totalPages={dashboardData.pagination.totalPage}
            pageSize={dashboardData.pagination.limit}
            totalItems={dashboardData.pagination.totalData}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}

export default Index
