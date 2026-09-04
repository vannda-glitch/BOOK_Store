import { defineStore } from 'pinia'

export const useRootStore = defineStore('root', {
  state: () => ({
    appName: 'BookStore',
    version: '1.0.0',
    isDarkMode: false,
    isLoading: false
  }),

  getters: {
    appInfo: (state) => ({
      name: state.appName,
      version: state.version
    })
  },

  actions: {
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },

    setLoading(status: boolean) {
      this.isLoading = status
    }
  }
})