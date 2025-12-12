'use client'

import { useListSpp } from '@/hooks/api/useSpp'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { SppSearchConfig } from '@/config/search-config'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { SppColumns } from '../components/table/SppColumns'
import { PlusCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import React, { useState, useMemo } from 'react'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { SppTable } from '@/features/(protected)/admin/spp/components/table/SppTable'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'

export default function SppPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch
  }

  const { data, isLoading, error, isFetching } = useListSpp({ page: queryParams.page, limit: queryParams.limit })

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => SppColumns, [])

  const table = useReactTable({
    data: data?.spp || defaultData,
    columns,
    pageCount: data?.pagination?.totalPage ?? -1,
    state: { pagination: { pageIndex, pageSize }, sorting },
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
    <PageContainer title="SPP">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Surat Perintah Pembayaran</h2>
        <Link href={'/admin/spp/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah SPP</span>
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
          config={SppSearchConfig}
        />

        <SppTable table={table} isLoading={isLoading} isFetching={isFetching} error={error as Error | undefined} />

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
