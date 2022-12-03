import * as path from 'path'
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import typescript from '@rollup/plugin-typescript'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: autoPreprocess()
    }), 
   
  ],
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
