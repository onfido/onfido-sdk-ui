#!/bin/bash

set -ev

chmod ugo+x ./test/scripts/install_chromedriver_travis.sh
sudo ./test/scripts/install_chromedriver_travis.sh
openssl aes-256-cbc -K $encrypted_1688a3f2e0a8_key -iv $encrypted_1688a3f2e0a8_iv -in test/monster_rsa.enc -out ~/.ssh/monster_rsa -d
chmod 600 ~/.ssh/monster_rsa
ls -la ~/.ssh
gem install bundler
