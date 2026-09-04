export const helpers = {
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout | null = null
    
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean = false
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  generateId: (): string => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  },

  getInitials: (name: string): string => {
    if (!name) return ''
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  },

  truncateText: (text: string, length: number = 100): string => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  },

  slugify: (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  getFileExtension: (filename: string): string => {
    return filename.split('.').pop() || ''
  },

  getFileName: (path: string): string => {
    return path.split('/').pop() || ''
  },

  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  },

  scrollToTop: (behavior: ScrollBehavior = 'smooth') => {
    window.scrollTo({ top: 0, behavior })
  },

  isMobile: (): boolean => {
    return window.innerWidth < 768
  },

  isTablet: (): boolean => {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  },

  isDesktop: (): boolean => {
    return window.innerWidth >= 1024
  },

  getDeviceType: (): 'mobile' | 'tablet' | 'desktop' => {
    if (helpers.isMobile()) return 'mobile'
    if (helpers.isTablet()) return 'tablet'
    return 'desktop'
  },

  formatBytes: (bytes: number, decimals: number = 2): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  },

  getStatusColor: (status: string): string => {
    const colors: Record<string, string> = {
      pending: 'yellow',
      processing: 'blue',
      shipped: 'indigo',
      delivered: 'green',
      cancelled: 'red',
      failed: 'red',
      paid: 'green',
      active: 'green',
      inactive: 'gray'
    }
    return colors[status] || 'gray'
  }
}