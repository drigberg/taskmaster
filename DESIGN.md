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
- link to Github 

### Dashboard (/dashboard/)
Lists tasks for user.

Features:
- Tasks are listed, and are differentiated by lateness
- "Edit mode" button
    - Edit mode allows creation of new tasks
    - Edit mode allows updates to task properties
    - Can save or discard all changes
- "Show archived" checkbox, in both view and edit mode
- "Activate edit mode to create your first task!" text, if no tasks yet
