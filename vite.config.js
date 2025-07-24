import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),

    VitePWA(
      {
        registerType: 'autoUpdate',

        manifest: {
          includeAssets: [
          "assets/*", 
          'assets/**/*',
          'assets/*.js',
          'assets/*.css',
          'assets/*.png',
          'assets/*.jpg',
          'assets/*.svg',
          'staff/dashboard/images/*.jpg',
          'staff/dashboard/items/images/*.jpg',
          'vite.svg',
          'cutlery.png',

        ],

          name: 'Smookies',
          short_name: 'PWA',
          description: 'work in offline model with code splited routes',
          theme_color: '#1976d2',
          background_color: '#ffffff',
          display: 'standalone',
          start_url: '/home',
          scope: '/',
          icons: [
            {
              src: '/cutlery.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],

          runtimeCaching: [
            {
              // Cache product list API
              urlPattern: ({ url }) => url.pathname.startsWith('/restaurant/food_items'),
              handler: 'StaleWhileRevalidate', // Use cache if available, else network
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 10, // Limit cache size
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200], // Cache successful responses and opaque (offline)
                },
              },
            },

            {
              // Cache orders  API
              urlPattern: ({ url }) => url.pathname.startsWith('/orders/user_orders'),
              handler: 'StaleWhileRevalidate', // Use cache if available, else network
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 10, // Limit cache size
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200], // Cache successful responses and opaque (offline)
                },
              },
            },
            
            {
              // Cache tables  API
              urlPattern: ({ url }) => url.pathname.startsWith('/tables/tables'),
              handler: 'StaleWhileRevalidate', // Use cache if available, else network
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 10, // Limit cache size
                  maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
                },
                cacheableResponse: {
                  statuses: [0, 200], // Cache successful responses and opaque (offline)
                },
              },
            },

            {
              // Cache reservations  API
              urlPattern: ({ url }) => url.pathname.startsWith('/reservations/all_resrvations'),
              handler: 'StaleWhileRevalidate', 
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 10, 
                  maxAgeSeconds: 7 * 24 * 60 * 60, 
                },
                cacheableResponse: {
                  statuses: [0, 200], 
                },
              },
            },

            // firebase scripts cache
            {
              urlPattern: /^https:\/\/www\.gstatic\.com\/firebasejs/,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'firebase-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ]
        }
      }
    )
  ],

  resolve: {
    dedupe: ['react', 'react-dom'], // Prevent multiple React instances
  },
  
})
