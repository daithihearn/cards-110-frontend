#!/bin/sh

echo "
Building image cards-110-frontend"

docker build -t localhost:5000/cards-110-frontend:latest .
docker push localhost:5000/cards-110-frontend:latest