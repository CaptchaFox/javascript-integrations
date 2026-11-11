import { defineConfig } from 'tsup';
import { version } from './package.json';

// Runs after `svelte-package` and overwrites dist/internal.{js,d.ts} with a bundle that
// inlines the private `@captchafox/internal` package, so the published package has no
// dependency on it.
export default defineConfig({
  entry: {
    internal: 'src/lib/internal.ts'
  },
  outDir: 'dist',
  format: ['esm'],
  clean: false,
  noExternal: ['@captchafox/internal'],
  dts: {
    resolve: ['@captchafox/internal']
  },
  env: {
    VERSION: version
  }
});
