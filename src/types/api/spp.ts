// Types and mappers for Surat Perintah Pembayaran (SPP)

export interface CreateSppRequest {
  upah: number
  bantuan_dana: number
  lembur: number
  tagihan_kjpri: number
  pph_21_pekerja: number
  pph_21_perusahaan: number
  premi_bpjs_kesehatan: number
  bpjs_kesehatan_perusahaan: number
  bpjs_kesehatan_pekerja: number
  bpjs_kesehatan_family: number
  iuran_jkk: number
  iuran_jkm: number
  iuran_jht_tenaga_kerja: number
  iuran_jp_tenaga_kerja: number
  total_tagihan_tenaga_kerja: number
  iuran_jht_perusahaan: number
  iuran_jp_perusahaan: number
  total_tagihan_perusahaan: number
  total_tagihan_bpjs_ketenagakerjaan: number
  piutang: number
  hutang: number
  unit_id: string
  month: number
  year: number
}

export type UpdateSppRequest = Partial<CreateSppRequest>

export type SppResponse = {
  id: string
  unit: { id: string; name: string; code: string }
  upah: number
  bantuan_dana: number
  lembur: number
  tagihan_kjpri: number
  pph_21_pekerja: number
  pph_21_perusahaan: number
  premi_bpjs_kesehatan: number
  bpjs_kesehatan_perusahaan: number
  bpjs_kesehatan_pekerja: number
  bpjs_kesehatan_family: number
  iuran_jkk: number
  iuran_jkm: number
  iuran_jht_tenaga_kerja: number
  iuran_jp_tenaga_kerja: number
  total_tagihan_tenaga_kerja: number
  iuran_jht_perusahaan: number
  iuran_jp_perusahaan: number
  total_tagihan_perusahaan: number
  total_tagihan_bpjs_ketenagakerjaan: number
  piutang: number
  hutang: number
  month: number
  year: number
}

export type GetAllSppResponse = {
  spp: SppResponse[]
  pagination: {
    totalData: number
    page: number
    limit: number
    totalPage: number
  }
}
