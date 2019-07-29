#!/bin/bash

set -ev

# run only on CI, pull requests and when NODE_ENV=test
if [[ ${CI} == "true" && (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  chmod ugo+x ./test/scripts/install_chromedriver_travis.sh
  sudo ./test/scripts/install_chromedriver_travis.sh

  gem install bundler -v '< 2'
fi
