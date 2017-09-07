#!/bin/bash

set -e

if [[ ${NODE_ENV} = "production" && ${TRAVIS_PULL_REQUEST} != "false" ]]; then
  # set path for test directory
  TESTS_PATH=./test

  # setup to run browser GUI
  export DISPLAY=:99.0
  sh -e /etc/init.d/xvfb start &
  sleep 3 # give xvfb some time to start

  # run local server in the background and wait until it starts
  # ref: https://stackoverflow.com/a/21002153
  echo "Running local server..."
  exec 3< <(npm run travis)
  sed '/webpack: Compiled successfully.$/q' <&3 ; cat <&3 &

  # go to test directory
  cd $TESTS_PATH

  # install gem dependencies using monster_rsa private key to fetch the monster gem
  GIT_SSH_COMMAND="ssh -i ~/.ssh/monster_rsa" bundle install

  # run cucumber tests against deployed domain
  SDK_URL="https://localhost:8080/?async=false"
  echo "Running Cucumber tests on ${SDK_URL}"
  bundle exec cucumber BROWSER=chrome SDK_URL=${SDK_URL} USE_SECRETS=false DEBUG=false --retry 2
fi
