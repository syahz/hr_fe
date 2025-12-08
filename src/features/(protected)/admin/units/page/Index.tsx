'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import { PlusCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/layout/PageContainer'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { useGetUnits } from '@/hooks/api/useUnit'
import { UnitSearchConfig } from '@/config/search-config'
import { UnitsTable } from '../components/table/UnitsTable'
import { UnitsColumns } from '../components/table/UnitsColumns'

export default function UnitsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  // Hooks untuk fungsionalitas search & filter
  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({})

  // Query parameters untuk dikirim ke API
  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch
    // Sorting bisa ditambahkan jika backend mendukung
  }

  // Mengambil data unit dari API menggunakan hook
  const { data, isLoading, error, isFetching } = useGetUnits(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => UnitsColumns, [])

  // Inisialisasi instance tabel
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
    <PageContainer title="Unit">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Unit</h2>
        <Link href={'/admin/units/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Unit</span>
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
          config={UnitSearchConfig}
        />

        {/* Komponen tabel untuk menampilkan data Unit */}
        <UnitsTable table={table} isLoading={isLoading} isFetching={isFetching} error={error} />

        {/* Komponen paginasi */}
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
