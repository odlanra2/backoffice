import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin' // 1. Importa Quasar


// https://vite.dev/config/
export default defineConfig({
  plugins: [   vue({
      template: { transformAssetUrls }
    }),
    
    // 2. Configura el plugin de Quasar indicando el formato de estilos
    quasar({
      sassVariables: 'quasar/src/css/variables.sass'
    })],
})
