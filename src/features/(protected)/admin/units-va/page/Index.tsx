'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { useGetUnitVAs } from '@/hooks/api/useUnitVirtualAccount'
import { UnitsVASearchConfig } from '@/config/search-config'
import { UnitsVATable } from '../components/table/UnitsVATable'
import { UnitsVAColumns } from '../components/table/UnitsVAColumns'

export default function UnitsVAPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 5 })

  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch
  }

  const { data, isLoading, error, isFetching } = useGetUnitVAs(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => UnitsVAColumns, [])

  const table = useReactTable({
    data: data?.items || defaultData,
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
    <PageContainer title="Unit Virtual Account">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Virtual Account Unit</h2>
        <Link href={'/admin/units-va/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah VA</span>
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
          config={UnitsVASearchConfig}
        />

        <UnitsVATable table={table} isLoading={isLoading} isFetching={isFetching} error={error as Error | null | undefined} />

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
