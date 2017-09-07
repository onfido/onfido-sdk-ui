#!/bin/bash

set -ev

chmod ugo+x ./test/scripts/install_chromedriver_travis.sh
sudo ./test/scripts/install_chromedriver_travis.sh

rvm install 2.3.0

chmod 600 ~/.ssh/monster_rsa
gem install bundler
