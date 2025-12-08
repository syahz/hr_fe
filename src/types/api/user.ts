export type UserResponse = {
  id: string
  name: string
  email: string
}

export type UpdateAccountRequest = {
  name?: string
  email?: string
}

export type UpdateAccountPasswordRequest = {
  current_password: string
  new_password: string
  confirm_password: string
}

export type UpdateAccountAuditorRequest = {
  registration_number?: string
  phone_number?: string
  jenis_kelamin?: string
  pendidikan?: string
}

export type UpdateAccountResponse = {
  message: string
}
