# TO-DO

## Stage #1: app setup
- setup this TODO list (done)
- init react quick-start (done)
- configure eslint (done)
- set up basic directory structure for UI (done)

## Stage #2: backend setup
- set up docker-compose (done)
- set up node server (done)
- add node server startup to start script (done)
- set up methods for querying arxiv.org (done)
- set up backend tests (done)
- set up store (done)

## Stage #3: API endpoints
- basic READ (done)
- basic LIST (done)
- tests (done)

## Stage #4: UI
- make homepage with navigation (done)
- make author list (done)
- make article list (done)
- make author page (done)
- make article page (done)
- fetch data successfully (done)

## Stage #5: cleanup
- fetch articles for correct categories (done)
- add number of articles per author (done)
- sort authors by most articles (done)
- add logger (done)

## Further steps
- Store data in App state so that it doesn't have to refresh when you go back and forth
- Only keep items that are less than 6 months old
- Schedule task to remove old items over time
- Move fetch methods to src/lib
- Add websocket which alerts when new data is added
- Add "db up to date" property to list responses, and keep querying until done
- Allow up to 4 fetchBulk calls in parallel with promise queue
- Schedule store update task, and remove/update items accordingly
- Ensure that items can be appended without reformatting entire screen
