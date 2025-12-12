import type { ColumnDef } from '@tanstack/react-table'
import type { SppResponse } from '@/types/api/spp'
import { Badge } from '@/components/ui/badge'

export const columns: ColumnDef<SppResponse>[] = [
  {
    accessorKey: 'unit.name',
    header: 'Unit'
  },
  {
    accessorKey: 'month',
    header: 'Bulan'
  },
  {
    accessorKey: 'year',
    header: 'Tahun'
  },
  {
    accessorKey: 'total_tagihan_perusahaan',
    header: 'Total Tagihan Perusahaan',
    cell: ({ getValue }) => {
      const v = getValue<number>()
      return <Badge variant="secondary">{new Intl.NumberFormat('id-ID').format(v)}</Badge>
    }
  },
  {
    accessorKey: 'total_tagihan_tenaga_kerja',
    header: 'Total Tagihan Tenaga Kerja',
    cell: ({ getValue }) => {
      const v = getValue<number>()
      return <Badge variant="secondary">{new Intl.NumberFormat('id-ID').format(v)}</Badge>
    }
  }
]
