import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),

  VitePWA({
    registerType: 'autoUpdate',
    includeAssets: ['favicon.svg', 'robots.txt', '*.png'],
    manifest: {
      name: 'Seetha Rama Kalyana',
      short_name: 'Seetha Rama',
      description: 'Seetha Rama Kalyana Matrimony',
      theme_color: '#0d6efd',
      background_color: '#ffffff',
      display: 'standalone',
      start_url: '/',
      icons: [
        {
          src: 'logo.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: 'logo.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  }),
  ],
})
