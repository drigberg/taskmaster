# App design

## API
### GET/users/:id
Exposes all data for user

Request url: GET /api/users/lukeskywalker
Response:
``` json
{
    "id": "lukeskywalker",
    "name": "Luke Skywalker",
    "created": "2020-03-01",
    "tasks": [
        {
            "name": "clean R2D2",
            "frequency": 7,
            "completionDates": [
                "2020-04-02",
                "2020-04-05",
                "2020-04-10"
            ],
            "archived": false
        }
    ]
}
```

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
- "Edit mode" button
    - Edit mode allows creation of new tasks
    - Edit mode allows updates to task properties
    - Can save or discard all changes
    - Also shows archived tasks

## Infrastracture (not implemented yet)

- Infrastructure managed with AWS Cloudformation
- App builds and deploys with AWS CodePipeline
- Database: DynamoDB, with backup enabled
- DynamoDB container is managed with docker-compose for local development and testing
- Authentication with AWS Cognito + Google (https://docs.aws.amazon.com/cognito/latest/developerguide/google.html)
