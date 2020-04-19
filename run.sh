#!/bin/bash

echo "Starting app..."
docker run -p 3000:3000 -v "$(pwd)/:/app" taskmaster:latest