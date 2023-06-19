module.exports = {
  root: true,
  extends: ['captchafox', 'plugin:vue/vue3-recommended', 'plugin:testing-library/vue'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  }
};
