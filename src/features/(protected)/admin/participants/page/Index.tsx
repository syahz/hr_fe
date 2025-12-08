'use client'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton' // Untuk loading state
import Link from 'next/link'
import { useGetAllRoles } from '@/hooks/api/useRole'
import { useGetAllUnits } from '@/hooks/api/useUnit'
import { useSearchFilters } from '@/hooks/useSearchFilter'
import { getUsersSearchConfig } from '@/config/search-config'
import { useGetParticipants } from '@/hooks/api/useParticipant'
import { PlusCircle } from 'lucide-react'
import { PageContainer } from '@/components/layout/PageContainer'
import React, { useState, useMemo } from 'react'
import { DataTableSearch } from '@/components/table/DataTableSearch'
import { DataTablePagination } from '@/components/table/DataTablePagination'
import { ParticipantsTable } from '@/features/(protected)/admin/participants/components/table/ParticipantTable'
import { ParticipantColumns } from '@/features/(protected)/admin/participants/components/table/ParticipantColumns'
import { useReactTable, getCoreRowModel, PaginationState, SortingState } from '@tanstack/react-table'
import { useGetAllDivisions } from '@/hooks/api/useDivision'

export default function UsersPage() {
  // --- State Management untuk API & Tabel ---
  const [sorting, setSorting] = useState<SortingState>([])
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  // State untuk filter dan search
  const { searchValue, appliedSearch, filters, setSearchValue, handleSearchSubmit, handleClearFilters, handleFilterChange } = useSearchFilters({
    roleId: '',
    unitId: '',
    divisionId: ''
  })

  // --- AMBIL DATA UNTUK FILTER ---
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAllRoles()
  const { data: unitsData, isLoading: isLoadingUnits } = useGetAllUnits()
  const { data: divisionsData, isLoading: isLoadingDivisions } = useGetAllDivisions()

  const roleOptions = useMemo(() => {
    if (!rolesData?.data) return []
    return rolesData.data.map((role) => ({
      value: role.id,
      label: role.name
    }))
  }, [rolesData])

  const divisionsOptions = useMemo(() => {
    if (!divisionsData?.data) return []
    return divisionsData.data.map((divisions) => ({
      value: divisions.id,
      label: divisions.name
    }))
  }, [divisionsData])

  const unitOptions = useMemo(() => {
    if (!unitsData?.data) return []
    return unitsData.data.map((unit) => ({
      value: unit.id,
      label: unit.name
    }))
  }, [unitsData])

  // Gunakan useMemo agar objek config tidak dibuat ulang terus menerus
  const dynamicSearchConfig = useMemo(
    () => getUsersSearchConfig(roleOptions, divisionsOptions, unitOptions),
    [roleOptions, divisionsOptions, unitOptions]
  )

  // --- Query Params untuk data utama (participants) ---
  const queryParams = {
    page: pageIndex + 1,
    limit: pageSize,
    search: appliedSearch,
    unitId: filters.unitId === '' ? undefined : filters.unitId,
    roleId: filters.roleId === '' ? undefined : filters.roleId,
    divisionId: filters.divisionId === '' ? undefined : filters.divisionId,
    sortBy: sorting.length > 0 ? sorting[0].id : undefined,
    sortOrder: sorting.length > 0 ? (sorting[0].desc ? 'desc' : 'asc') : undefined
  }

  const { data, isLoading: isLoadingParticipants, error, isFetching } = useGetParticipants(queryParams)

  const defaultData = useMemo(() => [], [])
  const columns = useMemo(() => ParticipantColumns, [])

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

  // Tampilkan loading skeleton untuk filter jika sedang loading
  const isLoadingFilters = isLoadingRoles || isLoadingUnits || isLoadingDivisions

  return (
    <PageContainer title="Participant">
      <div className="flex w-full gap-4 py-4 items-center justify-between">
        <h2 className="text-xl font-semibold">Manajemen Participant</h2>
        <Link href={'/admin/participants/create'}>
          <Button size="sm" variant="default" className="flex items-center gap-2">
            <PlusCircle size={16} />
            <span>Tambah Participant</span>
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {isLoadingFilters ? (
          <div className="flex items-center space-x-2 p-4 border rounded-md">
            <Skeleton className="h-10 flex-grow" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        ) : (
          <DataTableSearch
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            onSearchSubmit={handleSearchSubmit}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            config={dynamicSearchConfig}
          />
        )}

        <ParticipantsTable table={table} isLoading={isLoadingParticipants} isFetching={isFetching} error={error} />

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
