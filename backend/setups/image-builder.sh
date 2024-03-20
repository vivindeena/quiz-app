#!/bin/bash

# Build Docker image for auth service
docker build -t quiz-app/auth-service ../auth

# Build Docker image for Nginx
docker build -t quiz-app/nginx ../nginx