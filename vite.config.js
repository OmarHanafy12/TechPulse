import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: (requestPath) => {
            const query = requestPath.includes('?')
              ? requestPath.split('?')[1]
              : 'category=technology&language=en&pageSize=100';
            const apiKey = env.VITE_NEWSAPI_KEY || '';
            return `/v2/top-headlines?${query}&apiKey=${encodeURIComponent(apiKey)}`;
          },
        },
      },
    },
  };
});
