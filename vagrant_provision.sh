#!/bin/bash
REPO_URL=http://gitlab.thoretton.com/etic/appel-a-projet.git
REPO_PATH=/vagrant
PROJECT_NAME=htck

# Update
sudo apt-get update -y
sudo apt-get upgrade -y
# Install required packages
sudo apt-get install git build-essential ruby-compass -y

#sudo ln -sf /usr/bin/nodejs /usr/bin/node

#sudo npm install -g bower
#sudo npm install -g grunt-cli

#cd "$REPO_PATH"/"$PROJECT_NAME"
#sudo npm install
#bower install
#grunt serve
# set up 

curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs
sudo npm install npm -g
sudo npm install -g bower
sudo npm install -g grunt-cli

cd "$REPO_PATH"/"$PROJECT_NAME"
su vagrant -c "npm install"
su vagrant -c "bower install"
#grunt serve