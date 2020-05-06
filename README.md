## Summary
This app is for tracking recurring chores!

### Local Development
First, create a file called `.env` in this directory using the contents found in the `.env.sample` file. No access keys are needed for local development.

To run locally, you'll need to install docker and docker-compose. These tools allow us to spin up a local instance of DynamoDB, as well as to mimic the production environment as closely as possible while developing.

Commands:
- `docker-compose build`: build docker container (you should only need to do this once, unless you change the Dockerfile, docker-compose.yml, or package.json)
- `docker-compose up`: run the app
- `docker-compose stop`: stop the app
- `docker-compose exec app npm run setup-db:dev`: create and fill database tables
    - You'll need to run this every time you restart the app, as the local database does not persist after being shut down.
    - NOTE: This command must be run from a separate tab while the app is running!

#### Testing
To run automated tests, run `bash tests/run_tests.sh`.
NOTE: be sure that the app is not already running with docker-compose.


### Deployment
#### Infrastructure
1. Create an ECR repository (ours is named taskmaster-server)
2. Create a task definition for the container
3. Create an ECS cluster with a t2.micro EC2 instance
4. Create a new service for the task definition, using the new cluster

#### Deploying new versions

1. Build the Docker image: `bash docker-build.sh`
2. Get the ecr login command: `aws ecr get-login --no-include-email --region [region]`
3. Run the returned login command
4. Fetch the ECR repository URI from the AWS console 
5. Tag the Docker image: `docker tag taskmaster:latest [REPOSITORY_URI]:latest`
6. Push the image to ecr with `docker push [REPOSITORY_URI]:latest`

## Notes
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
