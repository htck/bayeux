#!/bin/bash
REPO_PATH=/vagrant
PROJECT_NAME=htck

# Update
sudo apt-get update -y
sudo apt-get upgrade -y
# Install required packages
sudo apt-get install git build-essential ruby-compass -y
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs
sudo npm install npm -g
sudo npm install -g bower
sudo npm install -g grunt-cli

cd "$REPO_PATH"/"$PROJECT_NAME"
su vagrant -c "npm install"
su vagrant -c "bower install"
sudo ln -s /vagrant/deploy.sh /usr/bin/deploy
#grunt serve