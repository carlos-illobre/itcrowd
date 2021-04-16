# itcrowd
## REST API Challenge

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
