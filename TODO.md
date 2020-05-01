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

## Stage 3: Local DB setup [done]
- Dynamodb container is built with docker-compose [done]
- Can create tables [done]
- Can populate tables [done]
- Can query users [done]
- Can query tasks [done]
- Can update tasks [done]
- Existing API endpoints interact with DynamoDB [done]
- UI is revised to call new endpoints [done]
- Dynamodb is used for tests [done]
- DB and Model logic is separated [done]

## Stage 4: Environment cleanup [done]
- switch to dotenv CLI [done]
- use environment variables for AWS instead of config.update() [done]

## Stage 5: Infrastructure
- Bash script to build Docker image for production and push to ecs
- Task definition is set up, with documentation on how to access it
- Cluster is setup, with documentation on how to access it
- DynamoDB is setup, with documentation on how to access it
- EC2 has permissions and environment variables for accessing dynamodb
- logs are pushed to Cloudwatch
- If/Else in Dockerfile based on ENV variable:
    - in development/testing, runs UI in development mode
    - in production, builds UI and runs from static files
- All entities have meaningful permissions, which ideally are saved in repo as policy documents

## Stage 6: Auth
- Google authentication using AWS Cognito or Amplify
- registration flow
- login flow
- logout flow
- API only exposes data for current user

# Stretch goals
## Features
- app has domain name
- app has SSL certificate
- Minimal API doc generator (markdown)
- UI tests
- task categories: group tasks by root and custom namespaces (household, work, etc)
- offline mode
- PWA
- GraphQL

## Best practices
- use schemas in populate-db script
- use AWS dynamodb converter in schemas (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/Converter.html)
- error handling with nice error class
- API test coverage
- use middleware for request context
- DB field names use constants
