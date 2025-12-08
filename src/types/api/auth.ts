export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: {
    id: string
    email: string
    role: string
    unit: string
    division: string
  }
}

export interface LogoutResponse {
  ok: boolean
}
