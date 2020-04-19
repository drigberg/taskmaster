#!/bin/bash

echo "Building container..."
docker build -t taskmaster .
echo "Built container!"