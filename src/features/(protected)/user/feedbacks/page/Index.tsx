'use client'

import { useGetFeedbacks } from '@/hooks/api/useFeedback'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { FeedbackSearchConfig } from '@/config/search-config'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { FeedbacksTable } from '../components/table/FeedbackTable'
import React, { useState, useMemo } from 'react'
import { FeedbacksColumns } from '../components/table/FeedbackColumns'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
  }

  const { data, isLoading, error, isFetching } = useGetFeedbacks(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => FeedbacksColumns(), [])

  const table = useReactTable({
    data: data?.items || defaultData,
    columns,
    pageCount: data?.pagination?.totalPage ?? -1,
    state: {
      pagination: { pageIndex, pageSize },
      sorting
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true
  })

  React.useEffect(() => {
    const totalPages = data?.pagination?.totalPage
    if (totalPages && pageIndex >= totalPages) {
      table.setPageIndex(0)
    }
  }, [data?.pagination?.totalPage, pageIndex, table])

  return (
    <PageContainer title="Role User">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Data Feedback</h2>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={FeedbackSearchConfig}
        />

        {/* Panggil FeedbacksTable dengan props yang sudah di-upgrade */}
        <FeedbacksTable table={table} isLoading={isLoading} isFetching={isFetching} error={error as Error | null | undefined} />

        {/* Paginasi sekarang dikontrol oleh table instance */}
        {data?.pagination && (
          <DataTablePagination
            currentPage={data.pagination.page}
            totalPages={data.pagination.totalPage}
            pageSize={data.pagination.limit}
            totalItems={data.pagination.totalData}
            onPageChange={(page) => table.setPageIndex(page - 1)}
            onPageSizeChange={(size) => table.setPageSize(size)}
          />
        )}
      </div>
    </PageContainer>
  )
}
