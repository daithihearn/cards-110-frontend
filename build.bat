@ECHO off

ECHO Building cards-110-frontend

CALL docker build -t localhost:5000/cards-110-frontend:latest .
CALL docker push localhost:5000/cards-110-frontend:latest