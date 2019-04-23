#!/bin/bash

set -e

# run only on pull requests and when NODE_ENV=test
if [[ ${CI} != "true" || (${NODE_ENV} = "test" && ${TRAVIS_PULL_REQUEST} != "false") ]]; then
  # set path for test directory
  TESTS_PATH=./test

  # setup to run browser GUI
  if [[ ${CI} = "true" ]]; then
    export DISPLAY=:99.0
    sh -e /etc/init.d/xvfb start &
    sleep 3 # give xvfb some time to start
  fi

  # go to test directory
  cd $TESTS_PATH

  # install gem dependencies using monster_rsa private key to fetch the monster gem
  if [[ ${CI} = "true" ]]; then
    GIT_SSH_COMMAND="ssh -i ~/.ssh/monster_rsa" bundle install
  else
    bundle install
  fi

  npm run test:ui-js
fi
