#!/bin/bash

set -e

# run only on pull requests and when NODE_ENV=test
if [[ ${CI} != "true" || (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  # set path for test directory

  bash --login #see https://stackoverflow.com/a/27415518
  rvm use 2.4.1
  bundler --version

  npm run test:ui-js
fi
