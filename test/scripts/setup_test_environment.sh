#!/bin/bash

set -ev

# run only on CI, pull requests and when NODE_ENV=test
if [[ ${CI} == "true" && (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  chmod ugo+x ./test/scripts/install_chromedriver_travis.sh
  sudo ./test/scripts/install_chromedriver_travis.sh

  chmod 600 ~/.ssh/monster_rsa

  # Install rvm
  sudo gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
  curl -sSL https://get.rvm.io | sudo bash -s stable
  source ~/.rvm/scripts/rvm

  # Install Ruby
  rvm install ruby
  rvm --default use ruby

  # Install bundler
  gem install bundler
fi
