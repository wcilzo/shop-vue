module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard'
  ],

  parserOptions: {
    parser: '@babel/eslint-parser'
  },

  rules: {
    'camelcase': 'off',
    'vue/multi-word-component-names': 'off',
    'no-console': 'off',
    'no-debugger': 'off'
  },

  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ]
}
