#!/bin/bash

docker build . -t taskmaster --build-arg ENV=PROD
