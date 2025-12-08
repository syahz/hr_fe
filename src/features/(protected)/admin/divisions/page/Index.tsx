'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useGetDivisions } from '@/hooks/api/useDivision'
import { DivisionSearchConfig } from '@/config/search-config'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { PlusCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { DivisionsTable } from '../components/table/DivisionsTable'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DivisionsColumns } from '../components/table/DivisionsColumns'
import React, { useState, useMemo } from 'react'
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

  const { data, isLoading, error, isFetching } = useGetDivisions(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => DivisionsColumns, [])

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
    <PageContainer title="Divisi">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Divisi</h2>
        <Link href={'/admin/divisions/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Divisi</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        <DataTableSearch
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchSubmit={handleSearchSubmit}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          config={DivisionSearchConfig}
        />

        <DivisionsTable table={table} isLoading={isLoading} isFetching={isFetching} error={error} />

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
