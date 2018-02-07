#!/bin/bash
branch=${1:-"master"}
remote=${2:-"https://github.com/htck/bayeux.git"}
echo "Deploying $branch to gh-pages $remote"
git checkout $branch
cd htck
# Update all dependencies
npm cache clean
npm install
bower install
# Build app
grunt build --force
cd ..

# Create dist zip file
cd htck
cp -R dist htck-Bayeux
zip -r htck-Bayeux.zip htck-Bayeux/
mv htck-Bayeux.zip dist/
rm -rf htck-Bayeux
cd ..

######

echo "Creating temporary deployment folder"
rm -rf /tmp/bayeux-ghost
mkdir /tmp/bayeux-ghost
cp -R htck/dist/* /tmp/bayeux-ghost/
cp -R htck/app/images /tmp/bayeux-ghost/
cd /tmp/bayeux-ghost
echo "Initing ghost git"
git init
echo "Add remote $remote"
git remote add origin $remote
git checkout -b gh-pages
rm .gitignore
git add .
git commit -am "Deploying $branch to gh-pages"
git push --force origin gh-pages

######
