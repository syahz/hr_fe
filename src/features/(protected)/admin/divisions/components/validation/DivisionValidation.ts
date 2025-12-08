import * as z from 'zod'

export const CreateDivisionValidation = z.object({
  name: z.string().min(1, 'Nama divisi wajib diisi')
})

export type CreateDivisionFormValues = z.infer<typeof CreateDivisionValidation>

export const UpdateDivisionValidation = z.object({
  name: z.string().min(2, 'Nama minimal harus 2 karakter.').optional()
})

export type UpdateDivisionFormValues = z.infer<typeof UpdateDivisionValidation>
