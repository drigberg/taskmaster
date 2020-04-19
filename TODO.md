# TASKMASTER TO-DO LIST

## Stage 1: build basic app that works [done]
- setup boilerplate app [done]
- dummy store wraps methods where db will be inserted [done]
- API exposes data [done]
- UI shows data [done]

## Stage 2: interactivity
- Use hooks [done]
- UI has buttons for doing things [done]
- UI buttons actually do things [done]
- UI has logic for creating new tasks
- API update route
- API create route
- UI can send update and create data to API
- UI can handle responses from POST requests
- UI only shows archived tasks in edit mode, lists at bottom, allows un-archiving

## Stage 3: CloudFormation setup
- set up EC2
- run hello-world server on EC2
- server restarts on error
- storage with DynamoDB
- authentication with Cognito

## Stage 4: Auth
- login flow
- logout flow
- UI manages auth using JWT or sessions
- API only exposes data for current user

# Stretch goals
- task categories: group tasks by root and custom namespaces (household, work, etc)
- offline mode
- PWA
