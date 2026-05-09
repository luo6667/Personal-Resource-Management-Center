import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/', // Vercel 必须用绝对路径
  plugins: [vue()]
})