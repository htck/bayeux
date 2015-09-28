#!/bin/bash
REPO_URL=http://gitlab.thoretton.com/etic/appel-a-projet.git
REPO_PATH=/vagrant
PROJECT_NAME=htck

# Update
sudo apt-get update -y
sudo apt-get upgrade -y
# Install required packages
sudo apt-get install git nginx -y

# set up nginx
sudo rm -rf /etc/nginx/sites-enabled/*
NGINX=$(cat << EOF
server {
  listen 80;
  listen [::]:80;

  server_name localhost;

  root $REPO_PATH/$PROJECT_NAME;
  index index.html;

  access_log /var/log/nginx/$PROJECT_NAME.access.log;
}
EOF
)
echo "$NGINX" | sudo tee "/etc/nginx/sites-available/$PROJECT_NAME.conf"
sudo ln -sf "/etc/nginx/sites-available/$PROJECT_NAME.conf" "/etc/nginx/sites-enabled/$PROJECT_NAME.conf"
sudo service nginx restart