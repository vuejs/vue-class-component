#!/bin/bash
set -e
read -p "Введите версию выпуска: " VERSION

read -p "Версия $VERSION - вы уверены? (y/N) " -n 1 -r
echo    # (optional) переход на новую строку
if [[ $REPLY =~ ^[Yy]$ ]]
then
  echo "Версия $VERSION ..."
  npm test
  npm run clean
  VERSION=$VERSION npm run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  npm version $VERSION --message "[release] $VERSION"

  # publish
  git push origin refs/tags/v$VERSION
  git push
  npm publish
fi