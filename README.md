This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Usage

Run `bash build.sh` to build the docker container (you should only need to do this once).
Run `bash run.sh` to run the project with docker-compose.

...or run `npm i` and `npm start`!

Run `npm test` to run tests.

## Summary
This application queries the arxiv.org API from a Node.js Express server. Data is stored using an in-memory store.
The UI is written with React, bootstrapped with react-quick-start.

My git history shows that I started working at 1pm and finished at 7pm, but I promise that I took a long Tetris break and only actually worked for 4 hours :)

## Unmet Criteria From Prompt
- The authors are not sorted by most recent post because I simply didn't have time to build that in. It would have been easy to add with this API, but I stopped at the four-hour-mark.
- The app fetches all data per category, not just the last six months. With more time, I would have added this filtering, and I would have scheduled a task which periodically removes old items and adds new ones.
- The UI is not any more friendly than arxiv.org's :/
- The UI code is not structured very nicely -- I spent 80% of my time on the API, so I was unable to separate concerns.
- The app does a terrible job searching by category! I clearly shouldn't have used the 'all' keyword -- I found once case where an article in the Therapy category was titled "High-power liquid-lithium jet target for neutron production".

## Design choices, hurdles, and notes

### UI, react, and react-quick-start
The UI is very limited because I spent so much time building the backend. But it works! I chose to use React because I greatly prefer it to Vue or Angular.

Limitations:
- The retry mechanism that I built in is very much a proof-of-concept, as it is unaware of when the store is only partially loaded. In a perfect world, I would have integrated socket.io to notify the app whenever new data is obtained by the server.
- I had to spend quite a bit of time debugging my setup because the latest version of react-scripts (3.4.1) fails to start in Docker containers, which was solved by downgrading to 3.4.0 (https://github.com/facebook/create-react-app/issues/8688).

### Node.js
I chose to use Node.js simply because I'm most familiar with Express as a web framework.

Limitations:
- Due to time constraints, I use a lot of objects where I would rather have used classes, such as when handling Articles and Authors. Normally, I prefer to have classes with `toJSON()` method to allow for easy serialization and clear schemas.
- I would have liked to use one paginated query for the multiple categories, but I couldn't get arxiv.org to work well with the `OR` operator that's described in their API docs. I'm sure it works, but I couldn't get it in the brief time I set aside for it.

### Tests
The API tests uses mocha and chai and focus on minimal integration tests for the sake of time. Ideally, I would have more tests to cover edge cases and other status codes besides 200 and 404.

Limitations:
- This project does not include UI tests, as I have found them to be too time-consuming to set up for small projects.

### Store
I initially wanted to use a database like Postgres, but I decided that it would be faster to make an in-memory store instead.

Limitations:
- The store is populated only once, which will clearly fall out of date over time. In a production environment, I would schedule a task to run periodically to update the store.

### Docker
I always use Docker so that global dependencies and operating systems are never an issue :)

### Logger
I copied this from one of my ongoing side projects (https://github.com/drigberg/neuralNet), because it gives insight into how much data I'm actually loading into memory.