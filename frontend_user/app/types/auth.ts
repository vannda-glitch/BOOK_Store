export interface User {
  id: number
  email: string
  username: string
  full_name: string | null
  phone: string | null
  profile_picture: string | null
  is_active: boolean
  is_verified: boolean
  role: 'USER' | 'ADMIN'
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  full_name?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface ChangePasswordData {
  current_password: string
  new_password: string
}