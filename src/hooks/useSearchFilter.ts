// hooks/useSearchFilters.ts
import { useState } from 'react'

export type Filters = Record<string, string>

export const useSearchFilters = (defaultFilters: Filters = {}) => {
  const [searchValue, setSearchValue] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  const handleSearchSubmit = () => {
    setAppliedSearch(searchValue)
  }

  const handleClearFilters = () => {
    setSearchValue('')
    setAppliedSearch('')
    setFilters(defaultFilters)
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? '' : value
    }))
  }

  return {
    searchValue,
    appliedSearch,
    filters,
    setSearchValue,
    handleSearchSubmit,
    handleClearFilters,
    handleFilterChange
  }
}
