'use client'
import React from 'react'
import { useGetSpp } from '@/hooks/api/useSpp'
import { useGetUnitVAsByUnitId } from '@/hooks/api/useUnitVirtualAccount'
import { formatCurrency, formatCurrencyTable } from '@/lib/utils'
import { UNIT_VA_NAMES } from '@/config/unit-va-names'
import { useParams } from 'next/navigation'
import PrintableDocument from '@/components/print/PrintableDocument'

const MONTHS_ID = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

export default function View() {
  const params = useParams()
  const id = params?.id as string
  const { data: spp } = useGetSpp(id)
  const unitId = spp?.unit?.id
  const { data: unitVAs } = useGetUnitVAsByUnitId(unitId)

  if (!spp) return <div>Memuat data SPP</div>

  const periode = `${MONTHS_ID[(spp.month || 1) - 1] ?? ''} ${spp.year}`
  const nominalThp = Math.max((spp.upah || 0) - (spp.lembur || 0), 0)
  const bpjsTkPerusahaan = spp.total_tagihan_perusahaan ?? 0
  const bpjsTkTenaga = spp.total_tagihan_tenaga_kerja ?? 0
  const suratNumber = spp.spp_letter ?? '-'

  const getGroupNameForJenis = (jenis: string): string | null => {
    const j = jenis.toLowerCase()
    if (j.includes('bpjs kesehatan')) return 'BPJS Kesehatan'
    if (j.includes('bpjs ketenagakerjaan')) return 'BPJS Ketenagakerjaan'
    if (j.includes('pph 21') && j.includes('pemberi kerja')) return 'PPh 21 (Dibayar Pemberi Kerja)'
    if (j.includes('pph 21') && j.includes('pekerja')) return 'PPh 21 (Dibayar Pekerja)'
    if (j.includes('kjpri')) return 'Tagihan KJPRI UB'
    if (j.includes('upah') || j.includes('bantuan dana') || j.includes('lembur')) return 'Upah'
    return null
  }

  const getVaNumberForJenis = (jenis: string): string => {
    if (!unitVAs || unitVAs.length === 0) return '-'
    const groupName = getGroupNameForJenis(jenis)
    const targetName = groupName && UNIT_VA_NAMES.includes(groupName) ? groupName : jenis
    const exact = unitVAs.find((v) => v.va_name === targetName)
    return exact ? exact.va_number : '-'
  }

  const rows = [
    { no: 1, jenis: 'Upah', nominal: nominalThp, va: getVaNumberForJenis('Upah') },
    { no: 2, jenis: 'Bantuan Dana', nominal: spp.bantuan_dana ?? 0, va: getVaNumberForJenis('Bantuan Dana') },
    { no: 3, jenis: 'Lembur Karyawan', nominal: spp.lembur ?? 0, va: getVaNumberForJenis('Lembur Karyawan') },
    { no: 4, jenis: 'Tagihan KJPRI UB', nominal: spp.tagihan_kjpri ?? 0, va: getVaNumberForJenis('Tagihan KJPRI UB') },
    {
      no: 5,
      jenis: 'PPh 21 (Dibayar Pemberi Kerja)',
      nominal: spp.pph_21_perusahaan ?? 0,
      va: getVaNumberForJenis('PPh 21 (Dibayar Pemberi Kerja)')
    },
    { no: 6, jenis: 'PPh 21 (Dibayar Pekerja)', nominal: spp.pph_21_pekerja ?? 0, va: getVaNumberForJenis('PPh 21 (Dibayar Pekerja)') },
    {
      no: 7,
      jenis: 'BPJS Kesehatan (Tagihan Pemberi Kerja)',
      nominal: spp.bpjs_kesehatan_perusahaan ?? 0,
      va: getVaNumberForJenis('BPJS Kesehatan (Tagihan Pemberi Kerja)')
    },
    {
      no: 8,
      jenis: 'BPJS Kesehatan (Tagihan Tenaga Kerja)',
      nominal: spp.bpjs_kesehatan_pekerja ?? 0,
      va: getVaNumberForJenis('BPJS Kesehatan (Tagihan Tenaga Kerja)')
    },
    { no: 9, jenis: 'BPJS Kesehatan (Keluarga)', nominal: spp.bpjs_kesehatan_family ?? 0, va: getVaNumberForJenis('BPJS Kesehatan (Keluarga)') },
    {
      no: 10,
      jenis: 'BPJS Ketenagakerjaan (Pemberi Kerja)',
      nominal: bpjsTkPerusahaan,
      va: getVaNumberForJenis('BPJS Ketenagakerjaan (Pemberi Kerja)')
    },
    { no: 11, jenis: 'BPJS Ketenagakerjaan (Tenaga Kerja)', nominal: bpjsTkTenaga, va: getVaNumberForJenis('BPJS Ketenagakerjaan (Tenaga Kerja)') },
    { no: 12, jenis: 'Piutang', nominal: spp.piutang ?? 0, va: spp.keterangan_piutang || '-' },
    { no: 13, jenis: 'Hutang', nominal: spp.hutang ?? 0, va: spp.keterangan_hutang || '-' },
    { no: 14, jenis: 'Bonus', nominal: spp.bonus ?? 0, va: spp.keterangan_bonus || '-' }
  ]

  // Compute dynamic rowSpan placement: group consecutive identical non-'-' VA values
  const rowVaInfo: Array<{ value: string; span: number } | null> = Array(rows.length).fill(null)
  for (let i = 0; i < rows.length; ) {
    const va = rows[i].va ?? '-'
    if (va !== '-') {
      let span = 1
      let j = i + 1
      while (j < rows.length && (rows[j].va ?? '-') === va) {
        span++
        j++
      }
      rowVaInfo[i] = { value: va, span }
      for (let k = i + 1; k < i + span; k++) {
        rowVaInfo[k] = null
      }
      i = i + span
    } else {
      rowVaInfo[i] = { value: '-', span: 1 }
      i++
    }
  }

  const total = rows.reduce((sum, r) => sum + (r.nominal || 0), 0)

  const blocks = [
    <div key="spp-letter" className="text-[12pt] text-black page-block">
      <style jsx>{`
        @media print {
          .spp-table,
          .spp-table th,
          .spp-table td {
            border: 1px solid #000 !important;
          }
          .spp-table {
            border-collapse: collapse !important;
            table-layout: fixed;
          }
          /* Ensure headers stay centered on print for Nominal & VA */
          .spp-table th:nth-child(3),
          .spp-table th:nth-child(4) {
            text-align: center !important;
          }
          /* Keep VA column cells centered on print */
          .spp-table td:nth-child(4) {
            text-align: center !important;
          }
          /* Tembusan table without borders on print */
          .tembusan-table,
          .tembusan-table th,
          .tembusan-table td {
            border: none !important;
          }
        }
        .spp-table,
        .spp-table th,
        .spp-table td {
          border: 1px solid #000;
        }
        .spp-table {
          border-collapse: collapse;
        }
        /* Also enforce center alignment in screen for consistency */
        .spp-table th:nth-child(3),
        .spp-table th:nth-child(4) {
          text-align: center;
        }
        .spp-table td:nth-child(4) {
          text-align: center;
        }
        /* Borderless tembusan table on screen */
        .tembusan-table,
        .tembusan-table th,
        .tembusan-table td {
          border: none;
        }
        .page-block {
          display: flex;
          flex-direction: column;
          min-height: 100%;
        }
      `}</style>

      <p className="text-center leading-none">
        <span className="font-bold underline m-0">SURAT PERINTAH PEMBAYARAN</span>
        <br />
        <span className="p-0 m-0">Nomor: {suratNumber}</span>
      </p>

      <p className="mt-4 leading-relaxed text-justify">
        Sehubungan dengan kebijakan dan tanggung jawab perusahaan, dengan ini Direktur Utama PT Brawijaya Multi Usaha memberikan perintah kepada
        Divisi Keuangan Unit Bisnis {spp.unit.name} untuk melakukan pembayaran terhadap kewajiban perusahaan yang mencakup rincian beban biaya
        karyawan Bulan {periode} sebagai berikut:
      </p>

      <table className="spp-table w-full mt-4 text-sm">
        <thead>
          <tr>
            <th className="px-2 w-10 text-center">No</th>
            <th className="px-2 w-56 text-center">Jenis Pembayaran</th>
            <th className="px-2 w-20 text-center">Nominal (Rp)</th>
            <th className="px-2 w-32 text-center">Nomor Virtual Account (VA)/Rekening</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={r.no}>
              <td className="px-2 text-center">{r.no}</td>
              <td className="px-2 text-left">{r.jenis}</td>
              <td className="px-2 text-right">Rp. {formatCurrencyTable(r.nominal)}</td>
              {rowVaInfo[idx] && (
                <td className="px-2 text-center" rowSpan={rowVaInfo[idx]!.span}>
                  {rowVaInfo[idx]!.value}
                </td>
              )}
            </tr>
          ))}
          <tr>
            <td className="px-2 text-center py-1 font-semibold" colSpan={2}>
              TOTAL
            </td>
            <td className="px-2 py-1 font-semibold text-right">{formatCurrency(total)}</td>
            <td className="px-2 py-1"></td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4">Demikian Surat Perintah ini dibuat untuk dilaksanakan sebagaimana mestinya.</p>
      <div className="flex justify-between">
        <div className=""></div>
        <div className="mt-8">
          <p className="text-left leading-none">
            <span>Malang, 24 {periode}</span>
            <br />
            <span>Hormat kami,</span>
          </p>
          <div className="h-20" />
          <p className="text-left leading-none">
            <span className="underline font-bold">Dr. EDI PURWANTO, S.TP., M.M.</span>
            <br />
            <span>DIREKTUR UTAMA</span>
          </p>
        </div>
      </div>
      <div className="tembusan-section mt-12">
        <p className="font-semibold">Tembusan:</p>
        <table className="tembusan-table w-full mt-2 text-sm">
          <tbody>
            <tr>
              <td className="text-center">1.</td>
              <td>Direktur Keuangan dan Manajemen Resiko;</td>
            </tr>
            <tr>
              <td className="text-center">2.</td>
              <td>Direktur Operasional;</td>
            </tr>
            <tr>
              <td className="text-center">3.</td>
              <td>General Manager Unit Bisnis Bersangkutan;</td>
            </tr>
            <tr>
              <td className="text-center">4.</td>
              <td>Arsip.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  ]

  const breakBefore = [false, true]

  return (
    <div style={{ fontFamily: 'Times, serif' }}>
      <PrintableDocument
        blocks={blocks}
        headerSrc="/img/KOP_BMU_Header.png"
        headerHeightIn={1.4}
        footerSrc="/img/KOP_BMU_Footer.png"
        footerHeightIn={1.7}
        docName={`Surat_Perintah_Pembayaran_${spp.unit.code}_${spp.year}_${spp.month}`}
        gapPx={3}
        pageWidthIn={8.5}
        pageHeightIn={13}
        contentPaddingTopIn={0.2}
        contentPaddingXIn={1}
        breakBefore={breakBefore}
      />
    </div>
  )
}
