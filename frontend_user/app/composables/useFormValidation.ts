import { ref, reactive } from 'vue'

export const useFormValidation = <T extends Record<string, any>>(initialData: T) => {
  const form = reactive<T>({ ...initialData })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})

  const validateField = (field: keyof T, value: any) => {
    // Basic validation rules
    if (!value || value === '') {
      errors.value[field] = `${String(field)} is required`
      return false
    }

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors.value[field] = 'Invalid email address'
      return false
    }

    if (field === 'password' && value.length < 8) {
      errors.value[field] = 'Password must be at least 8 characters'
      return false
    }

    delete errors.value[field]
    return true
  }

  const markTouched = (field: keyof T) => {
    touched.value[field] = true
  }

  const validateAll = () => {
    let isValid = true
    Object.keys(form).forEach((key) => {
      const field = key as keyof T
      const isFieldValid = validateField(field, form[field])
      if (!isFieldValid) isValid = false
      markTouched(field)
    })
    return isValid
  }

  const resetForm = () => {
    Object.assign(form, initialData)
    errors.value = {}
    touched.value = {}
  }

  return {
    form,
    errors,
    touched,
    validateField,
    markTouched,
    validateAll,
    resetForm
  }
}