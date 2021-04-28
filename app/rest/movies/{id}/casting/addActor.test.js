const { expect } = require('chai')
const { omit } = require('lodash')

describe('POST rest/movies/{id}/casting', function() {

  beforeEach(async function() {
    this.movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
    })
  })

  it('return 201 if the person was created and added as actor to the casting by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const { request, body, header } = await this.request
      .post(`/rest/movies/${this.movie.id}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(header.location).to.equal(`${baseUrl}/people/${id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: `${baseUrl}/people/${id}`,
        },
        movie: {
          href: `${baseUrl}/movies/${this.movie.id}`,
        },
        remove: {
          href: `${baseUrl}/movies/${this.movie.id}/casting/${id}`,
        },
      },
    })

    const [actor] = await this.movie.getCasting()
    expect(actor).to.include(data)
    expect(parseInt(id)).to.equals(actor.id)

    const otherMovie = await this.db.Movie.create({
      title: 'Rambo II',
      releaseYear: 1985,
    })

    await this.request
      .post(`/rest/movies/${otherMovie.id}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    const [otherActor] = await otherMovie.getCasting()
    expect(otherActor).to.include(data)
    expect(otherActor.id).to.equals(actor.id)
  })

  it('return 201 if an existent person was added as actor to the casting by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const person = await this.db.Person.create(data)

    const { request, body, header } = await this.request
      .post(`/rest/movies/${this.movie.id}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(header.location).to.equal(`${baseUrl}/people/${id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: `${baseUrl}/people/${id}`,
        },
        movie: {
          href: `${baseUrl}/movies/${this.movie.id}`,
        },
        remove: {
          href: `${baseUrl}/movies/${this.movie.id}/casting/${id}`,
        },
      },
    })

    const [actor] = await this.movie.getCasting()
    expect(actor).to.include(data)
    expect(parseInt(id)).to.equals(actor.id)
    expect(actor.id).to.equals(person.id)
  })

  it('do not add the same actor twice by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      casting: [data, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'casting',
      }],
    })

    const { request, body, header } = await this.request
      .post(`/rest/movies/${movie.id}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(header.location).to.equal(`${baseUrl}/people/${id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: `${baseUrl}/people/${id}`,
        },
        movie: {
          href: `${baseUrl}/movies/${movie.id}`,
        },
        remove: {
          href: `${baseUrl}/movies/${movie.id}/casting/${id}`,
        },
      },
    })

    const casting = await movie.getCasting()
    const actors = casting.filter(actor => actor.firstName == data.firstName)
    expect(actors.length).to.equals(1)
    const [actor] = actors
    expect(actor).to.include(data)
    expect(parseInt(id)).to.equals(actor.id)
  })

  it('return 401 if not authenticated', async function() {
    await this.request
      .post(`/rest/movies/${this.movie.id}/casting`)
      .send({
        firstName: 'Sylvester',
        lastName: 'Stallone',
      })
      .expect(401, {})
    
    const count = await this.db.Person.count()
    expect(count).to.equals(0)
  })

  it('return 401 if JWT expired', async function() {
    await this.request
      .post(`/rest/movies/${this.movie.id}/casting`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk')
      .send({
        firstName: 'Sylvester',
        lastName: 'Stallone',
      })
      .expect(401, {})
    
    const count = await this.db.Person.count()
    expect(count).to.equals(0)
  })

  it('return 400 if the firstName is empty', async function() {
    const { body } = await this.request
      .post(`/rest/movies/${this.movie.id}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        firstName: '',
        lastName: 'Stallone',
      })
      .expect(400)
    expect(body.message).to.equals(`Request schema validation failed for POST/rest/movies/${this.movie.id}/casting`)
    expect(omit({ ...body }, 'message')).to.matchSnapshot()
    expect(await this.db.Person.count()).to.equal(0)
  })

  it('returns 404 if the movie does not exists', async function() {
    const unexistentMovieId = 9348
    await this.request
      .post(`/rest/movies/${unexistentMovieId}/casting`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        firstName: 'Sylvester',
        lastName: 'Stallone',
      })
      .expect(404, {
        error: {
          message: `Movie ${unexistentMovieId} not found.`,
          status: 404,
        }
      })
    const count = await this.db.Person.count()
    expect(count).to.equals(0)
  })
})
