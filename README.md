# itcrowd - REST API Challenge

Deployed in Heroku

https://itcrowd-rest-api-challenge.herokuapp.com/rest/docs

## Install

For a in memory database withour extra cofiguration:
```
npm install
npm run start:demo
go to localhost:8080/rest/doc
```

If you have docker-compose installed:
```
npm install
npm run dev
go to localhost:8080/rest/doc
```

100% test coverage
```
npm run test
```

## Use
Create one user:
```
curl -X 'POST' \
  'http://localhost:8080/rest/users' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "some@email.com",
  "password": "secret"
}'
```

Login:
```
curl -X 'POST' \
  'http://localhost:8080/rest/users/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "some@email.com",
  "password": "secret"
}'

{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxOTU4NDM5MiwiZXhwIjoxNjE5NTkzMDMyfQ.Ya27uTa2WjPLJ6quXqy4ypKBQ6bUFxKP19GjkUo9c8M",
  "_links": {
    "movies": {
      "href": "http://localhost:8080/rest/movies"
    },
    "people": {
      "href": "http://localhost:8080/rest/people"
    }
  }
}
```

Use the accessToken for unsafe methods:
```
curl -X 'POST' \
  'http://localhost:8080/rest/movies' \
  -H 'accept: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYxOTU4NDM5MiwiZXhwIjoxNjE5NTkzMDMyfQ.Ya27uTa2WjPLJ6quXqy4ypKBQ6bUFxKP19GjkUo9c8M' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "Rambo",
  "releaseYear": 1982
}'
```

All of that can be done from Swagger, just press the button [Try it out] on each endpoint `localhost:8080/rest/doc`


## Libraries

bcryptjs: To store a hashed password in the database. The defacto standard
body-parser: To parse the json body in express
cr-numeral: To create the Roman numbers. The first library that I found to do this.
express: To create the endpoints. Fast, simple and the defacto standard.
glob: To read files. Is the best way to avoid ugly `require`s
halson: To implement HATEOAS
jsonwebtoken: To generate autentication tokens
lodash: To have utility functions
passport: Defacto standard to implement authentication
passport-jwt: Strategy to use JWT in the authentication process
pg: postgres driver
sequelize: Most complete ORM in nodejs
swagger-express-validator: Uses the rules defined in the swagger documentation as endpoint input validators
swagger-jsdoc: Generates swagger documentation from several yml files
swagger-ui-express: Generates an interactive web page with the documentation
umzug: Reads and executes database migration files to generate the database schema
chai: assertion library for the tests
chai-jest-snapshot: integrates the Jest snapshots into chai to be used with mocha
eslint: Find syntax errors
mocha: Executes the test, simpler than jest
nyc: Generates the coverage
sqlite3: In memory database to run the tests
supertest: Emulates ajax calls and provides some test asserts

But all of that is deprecated, a graphql implementation fits much better to solve this problem.


## Goal
Ensure that you, the developer, has a great grasp on how REST APIs work and can quickly implement a solution. 

## Problem
A company that has a website about movies wants to provide its customers and users an API to query their database, as well as provide the trusted company users the ability to update or create new records.

In order to complete this, you must create a RESTful interface that will provide access to the company’s database.

## Models
Here’s a description of the company database models.
You can add any extra field/relationship but the ones described here are mandatory.

Person
Id
Last Name
First Name
Aliases
Movies as Actor/Actress
Movies as Director
Movies as Producer

Movie
Id
Title
Release Year
Casting (Actors + Actresses)
Directors
Producers

## Requirements
Provide a REST API to access movies and persons models.
Safe methods are publicly available, no authentication is required.
Unsafe methods are only available to authenticated users.
Movie documents must include references or full documents to persons in their different roles.
Person documents must include references or full documents to movies in the different roles the Person has.
Movie documents must include the Release Year in roman numerals. This field should not be stored in the DB, just calculated on the fly.

## Deliverables
The source code submitted to a shared Github repository.
The list of available endpoints and supported methods documented (could be in the same Github repo).
List of used libraries/frameworks.

## Extra Credit
Project is deployed and running online (AWS, Heroku, cloud servers, own servers…)
User interface to browse items.
User interface to create/edit/delete items.
Justification of chosen libraries/frameworks against other popular choices.
