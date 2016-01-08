#!/bin/bash
REPO_PATH=/vagrant
PROJECT_NAME=htck

# Update
sudo apt-get update -y
sudo apt-get upgrade -y
# Install required packages
sudo apt-get install git build-essential rubygems1.9 ruby-compass zip -y
curl --silent --location https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install --yes nodejs
sudo gem install compass
sudo npm install npm -g
sudo npm install -g bower
sudo npm install -g grunt-cli

su vagrant <<EOF
cd "$REPO_PATH"/"$PROJECT_NAME"
mkdir -p /home/vagrant/node_modules
rm -rf $REPO_PATH/$PROJECT_NAME/node_modules
ln -s /home/vagrant/node_modules $REPO_PATH/$PROJECT_NAME/node_modules
npm install
bower install
EOF
sudo ln -s /vagrant/deploy.sh /usr/bin/deploy
chmod 400 /home/vagrant/.ssh/id_rsa
#grunt serve