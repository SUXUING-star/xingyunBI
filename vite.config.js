import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 10240
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库
          'react-core': ['react', 'react-dom', 'react-router-dom'],
          
          // Radix UI 组件库
          'radix-ui': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast',
            '@radix-ui/react-tabs',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-scroll-area',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-select',
            '@radix-ui/react-switch'
          ],
          
          // 样式相关
          'styling': ['styled-components', 'tailwind-merge'],
          
          // 图表相关库
          'charts': [
            'echarts',
            'echarts-for-react',
            'recharts'
          ],
          
          // 拖拽相关
          'dnd': [
            'react-dnd',
            'react-dnd-html5-backend',
            'react-grid-layout'
          ],
          
          // ML/数据处理
          'ml-libs': [
            'ml-regression'
          ],
          
          // 动画相关
          'animations': [
            'framer-motion', 
            'animejs'
          ],
          
          // 工具库
          'utils': [
            'date-fns',
            'html2canvas',
            'jspdf',
            'mermaid'
          ]
        }
      }
    },
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    },
    sourcemap: process.env.NODE_ENV !== 'production',
    chunkSizeWarningLimit: 1500,
    assetsInlineLimit: 4096
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'styled-components',
      'echarts',
      'echarts-for-react'
    ]
  }
});