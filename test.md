THIS FILE GUIDE HOW TO TEST THE FULL STACK APPLICATION

# DATABASE
- a docker database service running in local (localhost:4532)
- `docker-compose up` to run the database service
  - this docker is not have volumn, just use **seed** for testing. When deploy, use volumn for maintain the data and backup 
  - see the docker file for configuration
## CONNECTION CHECK
- `npm run test-db-connection`
- `npm start` for testing api
  - access `localhost:3000/api/posts` for test api
# FRONT END (pending)
- add to docker-compose.yml later 

# BACK END (pending)
- add to docker-compose.yml later
