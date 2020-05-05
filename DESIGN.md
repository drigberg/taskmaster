# App design

## UI

### Landing page (/)
Describes app.

Contains:
- login button
- register button
- link to dashboard for logged-in users
- link to source code on Github 

### Dashboard (/dashboard/)
Lists tasks for user.

Features:
- Tasks are listed, and are differentiated by lateness
- "Create" button allows the user to create a new task
- "Edit mode" button
    - Edit mode allows updates to task properties
    - Can save or discard all changes
    - Shows archived tasks

## Infrastracture

### Complete

- Docker containers are managed with an ECS repository in the us-east-1 region
- Cluster, task definition, and service are defined in ECS
- DynamoDB container is managed with docker-compose for local development and testing
- DynamoDB tables are defined in AWS console

### Incomplete
- App builds and deploys with AWS CodePipeline
- Database: DynamoDB, with backup enabled
- Authentication with AWS Cognito + Google (https://docs.aws.amazon.com/cognito/latest/developerguide/google.html)
