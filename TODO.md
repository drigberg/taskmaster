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

## Stage 5: Basic Infrastructure [done]
- Bash script to build Docker image for production and push to ecs [done]
- Task definition is set up, with documentation on how to access it [done]
- Cluster is setup, with documentation on how to access it [done]
- DynamoDB is setup, with documentation on how to access it [done]
- ECS has permissions and environment variables for accessing dynamodb [done]
- logs are pushed to Cloudwatch [done]
- If/Else in Dockerfile based on ENV variable:
    - in development/testing, runs UI in development mode [done]
    - in production, builds UI and runs from static files [done]
- All entities have meaningful permissions, which ideally are saved in repo as policy documents [done]

## Stage 6: Auth [done]
- Google authentication using AWS Cognito or Amplify [done]
- can register / login [done]
- id token is reused if found in local storage [done]
- sensible auth flow in frontend and backend [done]
- all routes use authentication and authorization [done]
- All new secrets are stored in .env [done]
- can logout with sensible flow [done]

## Stage 7: Post-Auth Cleanup [done]
- frequency string/number bug is solved [done]
- allow hardcoded jwt in testing [done]
- fix API tests [done]
- minimal UI revisions for logged-in vs logged-out [done]
- smooth login redirect [done]
- smooth logout redirect [done]
- remove authorization code from url after authenticating [done]
- figure out correct cors policy [done]
- figure out SameSite attribute for cookies [done]

## Stage 8: Deployment with Auth [done]
- domain name is purchased [done]
- app is deployed with Elastic Beanstalk [done]
- app uses domain name [done]
- application load balancer redirects http to https [done]
- latest version is deployed [done]
    - final step: deploy latest version with correct redirect uri [done]
- auth works in production [done]

## Stage 9: Post-Deployment Cleanup
- pass redirect URI correctly to UI in dev and production
- decent navbar
- user can change nickname
- user can change password
- user can change email

# Stretch goals
## Large Features
- federated identity with Google
- caching
- end-to-end encryption
- serverless (important long-term for pricing with more projects)
- CI/CD
- task categories: group tasks by root and custom namespaces (household, work, etc)
- offline mode
- PWA
- GraphQL

## Small features
- Sort by warning status by default
- Loading animation (collaborators)
- Decent logo (collaborators)
- Rename taskmaster to taskmove everywhere
- Allow sorting by name, frequency, last-completed, or warning status

## Best practices
- UI tests
- minimal API doc generator (markdown)
- use schemas in populate-db script
- use AWS dynamodb converter in schemas (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/Converter.html)
- error handling with nice error class
- API test coverage
- DB field names use constants
- use request context in all logs
- use middleware for request context [done]
