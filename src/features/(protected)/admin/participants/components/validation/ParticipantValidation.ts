import * as z from 'zod'

export const CreateParticipantValidation = z
  .object({
    name: z.string().min(1, 'Nama wajib diisi'),
    email: z.email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password harus memiliki minimal 8 karakter')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
      .refine((value) => !/\s/.test(value), {
        message: 'Password tidak boleh mengandung spasi'
      }),
    confirmPassword: z.string(),
    unitId: z.uuid('Unit Id tidak valid'),
    roleId: z.uuid('Role Id tidak valid'),
    divisionId: z.uuid('Division Id tidak valid')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Konfirmasi password harus sesuai dengan password',
    path: ['confirmPassword']
  })

export type CreateParticipantFormValues = z.infer<typeof CreateParticipantValidation>

const PasswordSchema = z
  .string()
  .min(8, 'Password harus memiliki minimal 8 karakter')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
  .refine((value) => !/\s/.test(value), {
    message: 'Password tidak boleh mengandung spasi'
  })

export const UpdateParticipantValidation = z
  .object({
    name: z.string().min(2, 'Nama minimal harus 2 karakter.'),
    email: z.email('Mohon masukkan alamat email yang valid.'),
    roleId: z.uuid('Mohon pilih role yang valid.'),
    unitId: z.uuid('Mohon pilih unit yang valid.'),
    divisionId: z.uuid('Mohon pilih divisi yang valid.'),
    password: z.union([z.literal(''), PasswordSchema]).optional(),
    confirmPassword: z.string().optional()
  })
  .refine(
    (data) => {
      if (data.password && data.password.length > 0) {
        return data.password === data.confirmPassword
      }
      return true
    },
    {
      path: ['confirmPassword'],
      message: 'Password dan konfirmasi password tidak cocok.'
    }
  )

export type UpdateParticipantFormValues = z.infer<typeof UpdateParticipantValidation>
