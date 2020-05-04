#!/bin/bash

docker-compose start; docker-compose exec app npm run setup-db:test; docker-compose exec app npm test; docker-compose stop
