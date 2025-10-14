// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-auth-utils', '@nuxt/eslint'],
  devtools: { enabled: true },

  runtimeConfig: { public: { API_URL: process.env.API_URL || 'http://localhost:8000' } },

  compatibilityDate: '2025-07-15',
});
