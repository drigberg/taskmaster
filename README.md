## Usage

### Local Development
To run locally, you'll need to install docker and docker-compose.

Commands:
- `docker-compose build`: build docker container (you should only need to do this once, unless you change the Dockerfile, docker-compose.yml, or package.json)
- `docker-compose up`: run the app
- `docker-compose stop`: stop the app
- `docker-compose exec app npm run db-setup-dev`: create and fill database tables


## Summary
This app is for tracking recurring chores!

## Notes
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
