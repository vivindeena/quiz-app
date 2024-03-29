#!/bin/bash
ls
# Call the image-builder script
./image-builder.sh

# Check the exit status of the image-builder script
if [ $? -eq 0 ]; then
  echo "Image build successful. Starting Docker Compose..."
  cd ../../
  docker-compose up
else
  echo "Image build failed. Exiting..."
fi