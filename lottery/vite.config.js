import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
// vite.config.ts
import autoImportPlugin from '@opentiny/unplugin-tiny-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    autoImportPlugin('vite'),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  define: {
    'process.env': process.env 
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:33001', // Express后端地址
        changeOrigin: true
      }
    }
  }
})


