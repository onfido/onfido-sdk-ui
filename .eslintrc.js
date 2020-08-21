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
    'react/display-name': 'off',
    'react/no-did-mount-set-state': 'off',
    'react/no-did-update-set-state': 'off',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'jest/expect-expect': 'off',
    'jest/no-commented-out-tests': 'off',
    'jest/no-export': 'off',
    'jest/valid-describe': 'off',
    'jest/valid-expect': 'off',
  },
}
