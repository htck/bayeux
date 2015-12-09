#!/bin/bash
branch=${1:-"master"}
echo "Deploying $branch to gh-pages"
git checkout $branch
cd htck
# Update all dependencies
npm cache clean
npm install
bower install
# Build app
grunt build
rm -f dist/content/dist_README.md
ls
cd ..
ls htck

# Create dist zip file
cd htck
cp -R dist htck-Bayeux
zip -r htck-Bayeux.zip htck-Bayeux/
mv htck-Bayeux.zip dist/
rm -rf htck-Bayeux
cd ..

git branch -D gh-pages 
# Save built app to tmp folder
cp -R htck/dist/ /tmp/
ls /tmp
git checkout --orphan gh-pages
# Remove all git tracked files (keeps libs and node_modules)
git ls-files -z | xargs -0 rm -f
rm .gitignore
# Move back built app
mv /tmp/dist/* .
ls
# Deploy
git add content/ images/ index.html  scripts/ styles/ views/ lib/ *.zip
git commit -am "Deploying $branch to gh-pages"
git push --delete origin gh-pages
git push --set-upstream origin gh-pages
git checkout master