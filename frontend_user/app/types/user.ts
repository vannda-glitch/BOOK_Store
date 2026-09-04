export interface UserProfile {
  id: number
  email: string
  username: string
  full_name: string | null
  phone: string | null
  profile_picture: string | null
  bio: string | null
  role: 'USER' | 'ADMIN'
}

export interface UpdateProfileData {
  email?: string
  username?: string
  full_name?: string
  phone?: string
  bio?: string
}

export interface Address {
  id: number
  address_line1: string
  address_line2: string | null
  city: string
  province: string
  country: string
  postal_code: string | null
  phone: string | null
  is_default: boolean
  address_type: string | null
}

export interface CreateAddressData {
  address_line1: string
  address_line2?: string
  city: string
  province: string
  country?: string
  postal_code?: string
  phone?: string
  is_default?: boolean
  address_type?: string
}