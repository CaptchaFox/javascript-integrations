import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts'
  },
  external: ['react'],
  format: ['esm', 'cjs'],
  dts: {
    resolve: ['@captchafox/internal']
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";'
    };
  }
});
