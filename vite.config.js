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
        injectRegister: 'auto',

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

          navigateFallback: '/index.html',

          navigateFallbackDenylist: [
          /^https:\/\/restaurant-backend5\.onrender\.com\// 
         ],

          runtimeCaching: [
            {
              // Cache product list API
              urlPattern: /^https:\/\/restaurant-backend5\.onrender\.com\/restaurant\/food_items.*$/,
              handler: 'NetworkFirst', 
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60, 
                },
                networkTimeoutSeconds: 3,
                cacheableResponse: {
                  statuses: [0, 200], 
                },
              },
            },

            {
              // Cache orders  API
              urlPattern: ({ url }) => url.pathname.startsWith('/orders/user_orders'),
              handler: 'NetworkFirst', 
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 50, 
                  maxAgeSeconds: 60 * 60, 
                },
                networkTimeoutSeconds: 3,
                cacheableResponse: {
                  statuses: [0, 200], 
                },
              },
            },
            
            {
              // Cache tables  API
              urlPattern: ({ url }) => url.pathname.startsWith('/tables/tables'),
              handler: 'NetworkFirst', 
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 50, 
                  maxAgeSeconds: 60 * 60, 
                },
                networkTimeoutSeconds: 3,
                cacheableResponse: {
                  statuses: [0, 200], 
                },
              },
            },

            {
              // Cache reservations  API
              urlPattern: ({ url }) => url.pathname.startsWith('/reservations/all_resrvations'),
              handler: 'NetworkFirst', 
              options: {
                cacheName: 'smookies-cache',
                expiration: {
                  maxEntries: 50, 
                  maxAgeSeconds: 60 * 60, 
                },
                networkTimeoutSeconds: 3,
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
