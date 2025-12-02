import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['@mediapipe/hands', '@mediapipe/camera_utils'],
    include: ['@mediapipe/hands', '@mediapipe/camera_utils'],
  },
  build: {
    commonjsOptions: {
      include: [/@mediapipe/, /node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'mediapipe-hands': ['@mediapipe/hands'],
          'mediapipe-camera': ['@mediapipe/camera_utils'],
        },
      },
    },
    minify: 'terser',
    terserOptions: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
})

