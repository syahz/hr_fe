'use client'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { truncateText } from '@/utils/truncateText'
import type { SearchConfig } from '@/config/search-config'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search, X, Check, ChevronsUpDown } from 'lucide-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface DataTableSearchProps {
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  filters: Record<string, string>
  onFilterChange: (key: string, value: string) => void
  onClearFilters: () => void
  config: SearchConfig
}

export function DataTableSearch({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  filters,
  onFilterChange,
  onClearFilters,
  config
}: DataTableSearchProps) {
  const hasActiveFilters = searchValue || Object.values(filters).some((value) => value && value !== '')

  return (
    <>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-2 flex-1">
          <div className="relative flex-1 w-full flex">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={config.placeholder || 'Search...'}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-8"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSearchSubmit()
                  }
                }}
              />
            </div>
            <Button onClick={onSearchSubmit} className="ml-2" size="sm">
              {config.searchButtonText || 'Search'}
            </Button>
          </div>
        </div>

        {hasActiveFilters && (
          <Button variant="destructive" onClick={onClearFilters} className="hover:cursor-pointer h-8 px-2 lg:px-3">
            {config.resetButtonText || 'Reset'}
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex justify-end flex-wrap gap-2 mt-2">
        {config.filters?.map((filterConfig) => (
          <ComboboxFilter
            key={filterConfig.key}
            placeholder={filterConfig.placeholder}
            options={filterConfig.options.map((option) => ({
              ...option,
              value: String(option.value)
            }))}
            value={filters[filterConfig.key] || ''} // 🔥 default kosong string
            onChange={(val) => onFilterChange(filterConfig.key, val)}
          />
        ))}
      </div>
    </>
  )
}

interface ComboboxFilterProps {
  placeholder: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

function ComboboxFilter({ placeholder, options, value, onChange }: ComboboxFilterProps) {
  const [open, setOpen] = React.useState(false)

  // tambahkan opsi All, kalau kamu masih mau
  const allOptions = [{ value: 'all', label: 'All' }, ...options]

  const selectedLabel = allOptions.find((opt) => opt.value === value)?.label ?? ''

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {truncateText(value === '' ? placeholder : selectedLabel || placeholder, 14)}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              {allOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  {truncateText(option.label, 30)}
                  <Check className={cn('ml-auto h-4 w-4', value === option.value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
