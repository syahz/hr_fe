import * as z from 'zod'

// ---------------------
// Validation untuk update user account
// ---------------------
export const UpdateAccountUserValidation = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.')
})
export type UpdateAccountUserFormValues = z.infer<typeof UpdateAccountUserValidation>

// ---------------------
// Validation untuk update user account password
// ---------------------
export const UpdateAccountPasswordValidation = z
  .object({
    current_password: z
      .string()
      .min(8, 'Password harus memiliki minimal 8 karakter')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
      .refine((value) => !/\s/.test(value), {
        message: 'Password tidak boleh mengandung spasi'
      }),
    new_password: z
      .string()
      .min(8, 'Password harus memiliki minimal 8 karakter')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d,.\?\/;'[\]\$%^&*()!@#]+$/, 'Password harus mengandung huruf kecil, huruf besar, dan angka')
      .refine((value) => !/\s/.test(value), {
        message: 'Password tidak boleh mengandung spasi'
      }),

    confirm_password: z.string()
  })
  .refine(
    (data) => {
      if (data.new_password) {
        return data.new_password === data.confirm_password
      }
      return true
    },
    {
      message: 'Konfirmasi password harus sesuai dengan password',
      path: ['confirm_password']
    }
  )

export type UpdateAccountPasswordFormValues = z.infer<typeof UpdateAccountPasswordValidation>

// ---------------------
// Validation untuk update auditor
// ---------------------
export const UpdateAccountAuditorValidation = z.object({
  registration_number: z.string(),
  phone_number: z
    .string()
    .regex(/^08\d+$/, 'Phone number must start with 08 and contain only digits')
    .max(13, 'Phone number cannot exceed 13 digits'),
  jenis_kelamin: z.enum(['L', 'P']).refine((value) => value !== undefined, {
    message: 'Please select a gender.'
  }),
  pendidikan: z.string().min(1, 'Education is required.')
})

export type UpdateAccountAuditorFormValues = z.infer<typeof UpdateAccountAuditorValidation>
