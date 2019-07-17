#!/bin/bash

set -e

# run only on pull requests and when NODE_ENV=test
if [[ ${CI} != "true" || (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  # set path for test directory
  bundler --version

  npm run test:ui-js
fi
