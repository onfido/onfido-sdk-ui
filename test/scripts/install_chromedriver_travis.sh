#!/bin/bash

set -ev

# take the latest chromedriver version from https://chromedriver.storage.googleapis.com/LATEST_RELEASE
CHROME_DRIVER_VERSION=$(wget -qO- https://chromedriver.storage.googleapis.com/LATEST_RELEASE)
CHROME_VERSION="google-chrome-stable"

echo "Uninstalling current Chromium from `which chromium-browser`..."
sudo apt-get purge chromium-browser
rm ~/.config/chromium/ -rf

echo "Uninstalling current Google Chrome from `which google-chrome`..."
sudo apt-get purge google-chrome-stable
rm ~/.config/google-chrome/ -rf

echo "Installing $CHROME_VERSION..."
sudo wget --no-verbose -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -
echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list
sudo apt-get update -qqy
sudo apt-get -qqy install ${CHROME_VERSION}
echo "Using `google-chrome --version` from `which google-chrome`"

echo "Installing chromedriver $CHROME_DRIVER_VERSION..."
sudo wget --no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/$CHROME_DRIVER_VERSION/chromedriver_linux64.zip
sudo unzip /tmp/chromedriver_linux64.zip -d /opt
chmod 755 /opt/chromedriver
sudo ln -fs /opt/chromedriver /usr/bin/chromedriver
