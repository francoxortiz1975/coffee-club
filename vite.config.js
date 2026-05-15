import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-1024.png', 'logo.png'],
      manifest: {
        name: 'Sumay Coffee Club',
        short_name: 'Sumay',
        description: 'Las mejores cafeterías del Ecuador',
        theme_color: '#2a1510',
        background_color: '#2a1510',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'icons/icon-1024.png',
            sizes: '1024x1024',
            type: 'image/png',
          },
          {
            src: 'icons/icon-1024.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-1024.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
})
