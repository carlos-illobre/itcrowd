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

# How to create a new endpoint

To create a new endpoint you just need to create a new file into `scheduler-api/app/api` or in any subfolder.
If the file exports an express Router then the Router will be automatically injected into the express application:

```
// scheduler-api/app/api/v1/my/url/helloworld.js
const express = require('express')

module.exports = express
  .Router({mergeParams: true})
  .get('/my/url', (req, res, next) => {
    res.send('Hello')
  })  

```

Now just save it and if the server was started with `npm run dev` or `npm run dev:build` then the endpoint will be there: http://localhost:8080/api/my/url
(The urls of all the automatic injected Routers will always start with `/api`).
The folder structure should be like the url path, so if the endpoint is `GET /my/url/helloword` then the file should be in `scheduler-api/app/api/my/url/helloworld.js`,


# How to create a sequelizer entity (and a Migration)

Go to the `models` folder and create file like this to define the sequelize entity:
```
// scheduler-api/models/Sport.js
module.exports = (sequelize, DataTypes) => {

    const Sport = sequelize.define('Sport', {
        name: DataTypes.STRING,
    }, {
        tableName: 'sports',
    });
    
    return Sport;
    
};
```
Now go to the `migrations` folder and create a file like this:
```
// scheduler-api/migrations/20171101181703-create-sport.js
module.exports = {
    
    up(queryInterface, Sequelize) {
        return queryInterface.createTable('sports', {
            id: {
                allowNull: false,
                autoIncrement: true,    
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                allowNull: false,
                type: Sequelize.STRING(100),
            },
            created: {
                allowNull: false,
                type: Sequelize.DATE,   
            },
            modified: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted: {
                type: Sequelize.DATE,
            },
        })
    },

    down(queryInterface, Sequelize) {
        return queryInterface.dropTable('sports')
    }

};
```
The filename must start with a timestamp to be recognized and executed. All the new migrations will be automatically executed every time the node server is up.

# How to execute Queries from the endpoint

Every endpoint will have all the sequelize models injected into the `req.db` parameter, so we can do this:

```
// scheduler-api/app/api/v1/sports/getSports.js
const express = require('express');
    
module.exports = express       
.Router({mergeParams: true})   
.get('/v1/sports', async (req, res, next) => {
  
    const sports = await req.db.Sport.findAll({
        raw: true,
    });
    res.send({ sports });

});  
```
You should never return the entity, you can use `raw: true` to return the raw data.

# How to create the Swagger documentation:

Just create a file into the endpoint's folder with the extension `.swagger.yaml` like this:
```
/v1/sports:
    get:
        tags:                  
            - sports           
        summary: Get all the sports     
        description: Get all the sports. This is a public endpoint.
        operationId: getSports.js       
        produces:
            - application/json 
        responses:             
            200:
                description: OK
                schema:        
                    type: object                    
                    required:  
                        - sports                        
                    properties:
                        sports:
                            type: array                     
                            items:                          
                                type: object                    
                                required:                       
                                    - id                            
                                    - name                          
                                properties:                     
                                    id:                             
                                        type: number                    
                                        example: 1                      
                                    name:                           
                                        type: string                    
                                        example: Soccer                 
            500:               
                description: Internal server error
```
You should put an example value to each property.
The file must use the Swagger 2.0 format.


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
