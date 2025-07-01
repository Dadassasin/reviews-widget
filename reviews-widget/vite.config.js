import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    // собираем как библиотеку — один ESM-файл
    lib: {
      entry: resolve(__dirname, 'src/reviews-widget.js'),
      name: 'ReviewsWidget',
      formats: ['es']
    },
    rollupOptions: {
      // чтобы всё упаковать в один файл, без разбивки на чанки
      output: {
        inlineDynamicImports: true,
        entryFileNames: 'reviews-widget.js'
      }
      // если есть внешние зависимости, их можно тут указать в external
    }
  }
})
