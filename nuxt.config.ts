// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  vite: {
    server: {
      watch: {
        ignored: ['**/app/api/db.json'],
      },
    },
    plugins: [
      tailwindcss(),
    ],
  },
  routeRules: {
    '/admin': { ssr: false },
    '/admin/**': { ssr: false },
  },
})
