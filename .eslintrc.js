module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'preact',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier/standard',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaFeatures: {
      modules: true,
      jsx: true,
    },
  },
  plugins: ['react', '@typescript-eslint', 'mocha', 'prettier'],
  globals: {
    expect: false,
  },
  rules: {
    eqeqeq: ['error', 'always', { null: 'ignore' }],
    'prefer-const': 'error',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/ban-ts-comment': 'warn',
    /* Temporary disabled rules for React development */
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    /* @TODO decide a better way for props validation: PropTypes or typing system? */
    'react/prop-types': 'off',
    /* Disabled rules to use Mocha APIs */
    'jest/expect-expect': 'off',
    'jest/no-commented-out-tests': 'off',
    'jest/no-export': 'off',
    'jest/valid-describe': 'off',
    'jest/valid-expect': 'off',
  },
}
