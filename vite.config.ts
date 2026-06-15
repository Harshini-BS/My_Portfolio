// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react({
//       include: [/\.[tj]sx?$/],
//     }),
//   ],
//   esbuild: {
//     loader: {
//       '.js': 'jsx',
//       '.jsx': 'jsx',
//       '.ts': 'ts',
//       '.tsx': 'tsx',
//     },
//   },
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
})


