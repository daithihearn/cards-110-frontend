#!/bin/sh

echo "
Building image cards-110-frontend"

docker build --platform linux/x86_64 -t localhost:5000/cards-110-frontend:latest .
docker push localhost:5000/cards-110-frontend:latest
