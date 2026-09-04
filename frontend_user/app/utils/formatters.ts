export const formatters = {
  currency: (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  },
  
  date: (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date))
  },
  
  shortDate: (date: string | Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date))
  },
  
  orderStatus: (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
    return statusMap[status] || status
  },
  
  orderStatusColor: (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'badge-warning',
      processing: 'badge-primary',
      shipped: 'badge-info',
      delivered: 'badge-success',
      cancelled: 'badge-danger'
    }
    return colorMap[status] || 'badge-secondary'
  },
  
  truncate: (text: string, length: number = 50) => {
    if (text.length <= length) return text
    return text.substring(0, length) + '...'
  }
}