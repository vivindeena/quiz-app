#!/bin/bash

# Build Docker image for auth service
docker build -t plotlinebilling/auth-service ../auth

# Build Docker image for Nginx
docker build -t plotlinebilling/nginx ../nginx