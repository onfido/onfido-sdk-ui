module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'preact',
    'plugin:flowtype/recommended',
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
  plugins: ['react', 'flowtype', 'mocha', 'prettier'],
  globals: {
    expect: false,
  },
  rules: {
    'prefer-const': 'error',
    /* Temporary disabled rules for React development */
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    /**
     * @TODO decide a better way for props validation: PropTypes or typing system?
     * See more: https://wiki.onfido.net/display/SDK/Development+guideline+for+Web+SDK#DevelopmentguidelineforWebSDK-c.Readability&Maintainability
     */
    'react/prop-types': 'off',
    /* Disabled rules to use Mocha APIs */
    'jest/expect-expect': 'off',
    'jest/no-commented-out-tests': 'off',
    'jest/no-export': 'off',
    'jest/valid-describe': 'off',
    'jest/valid-expect': 'off',
  },
}
