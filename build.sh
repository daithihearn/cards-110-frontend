#!/bin/sh

echo "
Building cards-110-frontend"

npm install
REACT_APP_API_URL="" npm run build
rm -R ./dist
mv ./build ./dist
./gradlew webjar install
cp ./build/libs/*.jar ../cards-110-api/libs/