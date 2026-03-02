import { defineConfig } from 'tsup';
import { version } from './package.json';

export default defineConfig({
  entry: {
    index: 'src/index.ts'
  },
  env: {
    VERSION: version
  }
});
