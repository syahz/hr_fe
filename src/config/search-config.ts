/**
 * Tipe untuk setiap item dalam dropdown filter.
 * Contoh: { value: 'S1', label: 'S1' }
 */
export interface SearchOption {
  value: string | number
  label: string
}

/**
 * Tipe untuk konfigurasi satu buah filter (dropdown).
 */
export interface FilterConfig {
  key: string
  placeholder: string
  options: SearchOption[]
}

/**
 * Tipe utama untuk seluruh konfigurasi komponen search bar.
 */
export interface SearchConfig {
  placeholder: string
  searchButtonText: string
  resetButtonText: string
  filters?: FilterConfig[]
}

export const getDashboardHeadOfficeSearchConfig = (divisionsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari berdasarkan rating...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'divisionId',
        placeholder: 'Semua Unit',
        options: divisionsOptions
      }
    ]
  }
}
export const getDashboardSearchConfig = (unitsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari berdasarkan rating...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'unitId',
        placeholder: 'Semua Unit',
        options: unitsOptions
      }
    ]
  }
}

export const getUsersSearchConfig = (rolesOptions: SearchOption[], unitsOptions: SearchOption[], divisionsOptions: SearchOption[]) => {
  return {
    placeholder: 'Cari pengguna...',
    searchButtonText: 'Cari',
    resetButtonText: 'Reset',
    filters: [
      {
        key: 'roleId',
        placeholder: 'Semua Role',
        options: rolesOptions
      },
      {
        key: 'unitId',
        placeholder: 'Semua Unit',
        options: unitsOptions
      },
      {
        key: 'divisionId',
        placeholder: 'Semua Divisi',
        options: divisionsOptions
      }
    ]
  }
}

export const FeedbackSearchConfig = {
  placeholder: 'Cari berdasarkan rating, atau saran...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}

export const UnitSearchConfig = {
  placeholder: 'Cari berdasarkan nama unit, atau deskripsi...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}

export const DivisionSearchConfig = {
  placeholder: 'Cari berdasarkan nama divisi...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}
export const RoleSearchConfig = {
  placeholder: 'Cari berdasarkan nama role...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}

export const SppSearchConfig: SearchConfig = {
  placeholder: 'Cari unit, bulan, atau tahun...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset',
  // Optional: presets for filters; can be wired later to dynamic options
  filters: [
    { key: 'unit_id', placeholder: 'Semua Unit', options: [] },
    { key: 'month', placeholder: 'Semua Bulan', options: [] },
    { key: 'year', placeholder: 'Semua Tahun', options: [] }
  ]
}

export const UnitsVASearchConfig: SearchConfig = {
  placeholder: 'Cari unit, nomor VA, nama VA...',
  searchButtonText: 'Search',
  resetButtonText: 'Reset'
}
