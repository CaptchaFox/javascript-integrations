module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'turbo', 'prettier'],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es2017: true,
    node: true
  }
};
