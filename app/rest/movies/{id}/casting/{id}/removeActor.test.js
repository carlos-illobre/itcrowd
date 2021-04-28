const { expect } = require('chai')

describe('DELETE rest/movies/{id}/casting/{id}', function() {

  it('return 201 if the actor was removed from the movie by an authenticated user', async function() {

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      casting: [{
        firstName: 'Sylvester',
        lastName: 'Stallone',
      }, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'casting',
      }],
    })

    await this.request
      .delete(`/rest/movies/${movie.id}/casting/${movie.casting[0].id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(204)

    const casting = await movie.getCasting()
    expect(casting.length).to.equals(1)
  })

  it('return 404 if the actor does not belong to the movie by an authenticated user', async function() {
    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })
    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
    })
    await this.request
      .delete(`/rest/movies/${movie.id}/casting/${person.id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(404)
  })

  it('return 401 if not authenticated', async function() {

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      casting: [{
        firstName: 'Sylvester',
        lastName: 'Stallone',
      }, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'casting',
      }],
    })
    
    await this.request
      .delete(`/rest/movies/${movie.id}/casting/${movie.casting[0].id}`)
      .expect(401, {})

    const casting = await movie.getCasting()
    expect(casting.length).to.equals(2)
  })

  it('return 401 if JWT expired', async function() {

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      casting: [{
        firstName: 'Sylvester',
        lastName: 'Stallone',
      }, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'casting',
      }],
    })
    
    await this.request
      .delete(`/rest/movies/${movie.id}/casting/${movie.casting[0].id}`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk')
      .expect(401, {})
    
    const casting = await movie.getCasting()
    expect(casting.length).to.equals(2)
  })

  it('returns 404 if the movie does not exists', async function() {
    const unexistentMovieId = 9348
    await this.request
      .delete(`/rest/movies/${unexistentMovieId}/casting/${unexistentMovieId}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(404)
  })
})
