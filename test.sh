#!/bin/bash

set -e

# set path for test directory
TESTS_PATH=./test

# setup to run browser GUI
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start &
sleep 3 # give xvfb some time to start

# run local server in the background and wait until it starts
# ref: https://stackoverflow.com/a/21002153
echo "Running local server..."
exec 3< <(npm run dev)
sed '/webpack: Compiled successfully.$/q' <&3 ; cat <&3 &
sleep 2

# go to test directory
cd $TESTS_PATH

# install gem dependencies using monster_rsa private key to fetch the monster gem
GIT_SSH_COMMAND="ssh -i ~/.ssh/monster_rsa" bundle install

# run cucumber tests against deployed domain
SDK_URL="https://localhost:8080/?async=false"
echo "Running Cucumber tests on ${SDK_URL}"
bundle exec cucumber SDK_URL=${SDK_URL} USE_SECRETS=false DEBUG=false --retry 2
