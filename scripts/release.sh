#!/bin/bash
set -e
read -p "Enter release version: " VERSION

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Releasing $VERSION ..."
  npm test
  npm run clean
  VERSION=$VERSION npm run build

  # generate change log and tag it
  npm version $VERSION --git-tag-version=false
  npm run changelog
  read -p "Please check the git history and the changelog and press enter"
  git add -A
  git commit -m "release: v$VERSION"
  git tag "v$VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish --tag next
fi