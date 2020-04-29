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

## Infrastracture (not implemented yet)

- Infrastructure managed with AWS Cloudformation
- App builds and deploys with AWS CodePipeline
- Database: DynamoDB, with backup enabled
- DynamoDB container is managed with docker-compose for local development and testing
- Authentication with AWS Cognito + Google (https://docs.aws.amazon.com/cognito/latest/developerguide/google.html)
