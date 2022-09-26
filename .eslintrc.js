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
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'warn',
    /* Temporary disabled rules for React development */
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/require-render-return': 'off',
    '@typescript-eslint/no-unnecessary-type-constraint': 'off', // See issue: https://github.com/typescript-eslint/typescript-eslint/issues/4062
    /* @TODO decide a better way for props validation: PropTypes or typing system? */
    'react/prop-types': 'off',
    /* Disabled rules to use Mocha APIs */
    'jest/expect-expect': 'off',
    'jest/no-commented-out-tests': 'off',
    'jest/no-export': 'off',
    'jest/valid-describe': 'off',
    'jest/valid-expect': 'off',

    'jest/no-done-callback': 'off',
    /**  NOTE: This rule is disabled for these integration tests as onfidoApi.js were implemented using callbacks.
          Hence it is necessary to use Jest' done() callback function as per Jest's documentation for
          testing asynchronous code written with the callback pattern https://jestjs.io/docs/en/asynchronous
          Work to address this will be done in a separate ticket (CX-6016)
    */
  },
}
