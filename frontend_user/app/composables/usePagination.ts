export const usePagination = (totalItems: Ref<number>, itemsPerPage: number = 20) => {
  const currentPage = ref(1)
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage))

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const getVisiblePages = (maxVisible: number = 5) => {
    const pages: (number | string)[] = []
    const total = totalPages.value
    
    if (total <= maxVisible) {
      return Array.from({ length: total }, (_, i) => i + 1)
    }
    
    const half = Math.floor(maxVisible / 2)
    let start = Math.max(1, currentPage.value - half)
    let end = Math.min(total, start + maxVisible - 1)
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    if (start > 1) {
      pages.push(1)
      if (start > 2) pages.push('...')
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (end < total) {
      if (end < total - 1) pages.push('...')
      pages.push(total)
    }
    
    return pages
  }

  return {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    getVisiblePages
  }
}