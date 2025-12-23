// Types and mappers for Surat Perintah Pembayaran (SPP)

export interface SppParams {
  page?: number
  limit?: number
  search?: string
}

export interface CreateSppRequest {
  spp_letter?: string
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
  keterangan_piutang?: string
  hutang: number
  keterangan_hutang?: string
  bonus: number
  keterangan_bonus?: string
  unit_id: string
  month: number
  year: number
}

export type UpdateSppRequest = Partial<CreateSppRequest>

export type SppResponse = {
  id: string
  spp_letter?: string
  unit: { id: string; name: string; code: string }
  gaji_basic_salary: number
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
  keterangan_piutang?: string
  hutang: number
  keterangan_hutang?: string
  bonus: number
  keterangan_bonus?: string
  month: number
  year: number
}
