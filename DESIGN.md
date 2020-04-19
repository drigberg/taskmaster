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

### User page (/dashboard/:userId)
Lists tasks for user.

Contains:
- "Activate edit mode to create your first task!" text, if no tasks yet
- "edit mode" button
- "show archived" checkbox
