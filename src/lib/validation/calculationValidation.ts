import { z } from 'zod'

export const basicInformationSchema = z.object({
  business_name: z.string().min(1, 'Nama PU harus diisi'),
  business_number: z.string().min(1, 'Nomor PIC harus diisi'),
  business_scale: z.string().min(1, 'Skala usaha harus dipilih'),
  registration_id: z.string().optional(),
  products_type: z.number().min(1, 'Jenis produk harus dipilih')
})

export const variableCostsSchema = z.object({
  products_total: z.number().min(1, 'Jumlah produk minimal 1').max(300, 'Jumlah produk maksimal 300'),
  facility_total: z.number().min(1, 'Jumlah fasilitas minimal 1').max(200, 'Jumlah fasilitas maksimal 200')
})

export const fasilitasSchema = z.object({
  provinsi: z.string().min(1, 'Provinsi harus dipilih'),
  kota: z.string().min(1, 'Kota harus diisi'),
  uhpd: z.number().min(0),
  transportasi: z.number().min(0),
  akomodasi: z.number().min(0)
})

export const calculationFormSchema = z.object({
  basicInformation: basicInformationSchema,
  variableCosts: variableCostsSchema,
  fasilitas: z.array(fasilitasSchema).min(1, 'Minimal 1 fasilitas'),
  diskon: z.number().min(0).max(100)
})

export type BasicInformationForm = z.infer<typeof basicInformationSchema>
export type VariableCostsForm = z.infer<typeof variableCostsSchema>
export type FasilitasForm = z.infer<typeof fasilitasSchema>
export type CalculationFormData = z.infer<typeof calculationFormSchema>
