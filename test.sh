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

  # run local server in the background and wait until it starts
  # ref: https://stackoverflow.com/a/21002153
  server=$([[ ${CI} = "true" ]] && echo "travis" || echo "dev")
  echo "Running local server..."
  exec 3< <(npm run $server)
  if [[ ${CI} != "true" ]]; then
    sed '/webpack: Compiled successfully.$/q' <&3 ; cat <&3 &
  fi

  # go to test directory
  cd $TESTS_PATH

  # install gem dependencies using monster_rsa private key to fetch the monster gem
  if [[ ${CI} = "true" ]]; then
    GIT_SSH_COMMAND="ssh -i ~/.ssh/monster_rsa" bundle install
  else
    bundle install
  fi

  # run cucumber tests against localhost
  SDK_URL="https://localhost:8080/?async=false"
  echo "Running Cucumber tests on ${SDK_URL}"
  bundle exec rake CI=${CI} BS_USERNAME=${BS_USERNAME} BROWSERSTACK_ACCESS_KEY=${BROWSERSTACK_ACCESS_KEY} SDK_URL=${SDK_URL} USE_SECRETS=${USE_SECRETS} DEBUG=${DEBUG}nodes=3
fi
