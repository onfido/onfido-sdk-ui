#!/bin/bash

set -ev

# run only on CI, pull requests and when NODE_ENV=test
if [[ ${CI} == "true" && (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  chmod ugo+x ./test/scripts/install_chromedriver_travis.sh
  sudo ./test/scripts/install_chromedriver_travis.sh

  chmod 600 ~/.ssh/monster_rsa
  sudo apt-get install ruby-full
  gem install bundler
fi
