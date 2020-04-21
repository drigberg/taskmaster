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
- UI has logic for creating new tasks [done]
- API update route [done]
- API create route [done]
- UI can send update and create data to API [done]
- UI can handle responses from POST requests [done]
- API route for completing tasks
- UI posts task completion
- UI only shows archived tasks in edit mode, lists at bottom, allows un-archiving [done]

## Stage 3: CloudFormation setup
- set up EC2
- run hello-world server on EC2
- server restarts on error
- storage with DynamoDB
- authentication with Cognito

## Stage 4: Auth
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
