import * as path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  ssr: {
    noExternal: ['three', 'troika-three-text']
  },
  resolve: {
    alias: {
      '@': path.resolve('src'),
    },
  },
  root: path.resolve(process.cwd(), 'src'),
  base: './',
})
