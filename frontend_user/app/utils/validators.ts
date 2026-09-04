export const validators = {
  email: (value: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return pattern.test(value) || 'Invalid email address'
  },
  
  required: (value: any) => {
    return !!value || 'This field is required'
  },
  
  minLength: (min: number) => (value: string) => {
    return value.length >= min || `Must be at least ${min} characters`
  },
  
  maxLength: (max: number) => (value: string) => {
    return value.length <= max || `Must be at most ${max} characters`
  },
  
  password: (value: string) => {
    const hasUpper = /[A-Z]/.test(value)
    const hasLower = /[a-z]/.test(value)
    const hasNumber = /[0-9]/.test(value)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value)
    
    if (value.length < 8) return 'Password must be at least 8 characters'
    if (!hasUpper) return 'Password must contain at least one uppercase letter'
    if (!hasLower) return 'Password must contain at least one lowercase letter'
    if (!hasNumber) return 'Password must contain at least one number'
    if (!hasSpecial) return 'Password must contain at least one special character'
    return true
  },
  
  phone: (value: string) => {
    const pattern = /^\+?[0-9]{8,15}$/
    return pattern.test(value) || 'Invalid phone number'
  }
}