# TASKMASTER TO-DO LIST

## Stage 1: build basic app that works [done]
- setup boilerplate app [done]
- dummy store wraps methods where db will be inserted [done]
- API exposes data [done]
- UI shows data [done]

## Stage 2: interactivity [done]
- Use hooks [done]
- UI has buttons for doing things [done]
- UI buttons actually do things [done]
- UI has logic for creating new tasks [done]
- API update route [done]
- API create route [done]
- UI can send update and create data to API [done]
- UI can handle responses from POST requests [done]
- API route for completing tasks [done]
- UI posts task completion [done]
- UI only shows archived tasks in edit mode, lists at bottom, allows un-archiving [done]

## Stage 3: Local DB setup
- Dynamodb container is built with docker-compose [done]
- Can create tables [done]
- Can populate tables
- Can query users
- Can query tasks
- Existing API endpoints get data from DynamoDB
- UI is revised to call new endpoints
- Dynamodb is used for tests

## Stage 4: Infrastructure
- EC2 is defined with infrastructure-as-code template
- app can be deployed and runs Docker container in EC2
- server definitely restarts on error
- DynamoDB works in production
- logs are pushed to Cloudwatch
- app has domain name
- app has SSL certificate

## Stage 5: Auth
- authentication with AWS Cognito + Google
- registration flow
- login flow
- logout flow
- API only exposes data for current user

# Stretch goals
- UI tests
- task categories: group tasks by root and custom namespaces (household, work, etc)
- offline mode
- PWA
- GraphQL
