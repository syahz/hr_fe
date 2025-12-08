import * as z from 'zod'

export const CreateRoleValidation = z.object({
  name: z.string().min(1, 'Nama role wajib diisi')
})

export type CreateRoleFormValues = z.infer<typeof CreateRoleValidation>

export const UpdateRoleValidation = z.object({
  name: z.string().min(2, 'Nama minimal harus 2 karakter.').optional()
})

export type UpdateRoleFormValues = z.infer<typeof UpdateRoleValidation>
