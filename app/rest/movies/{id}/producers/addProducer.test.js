const { expect } = require('chai')
const { omit } = require('lodash')

describe('POST rest/movies/{id}/producers', function() {

  beforeEach(async function() {
    this.movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
    })
  })

  it('return 201 if the person was created and added as producer to the movie by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const { request, body, header } = await this.request
      .post(`/rest/movies/${this.movie.id}/producers`)
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
          href: `${baseUrl}/movies/${this.movie.id}/producers/${id}`,
        },
      },
    })

    const [producer] = await this.movie.getProducers()
    expect(producer).to.include(data)
    expect(parseInt(id)).to.equals(producer.id)

    const otherMovie = await this.db.Movie.create({
      title: 'Rambo II',
      releaseYear: 1985,
    })

    await this.request
      .post(`/rest/movies/${otherMovie.id}/producers`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    const [otherProducer] = await otherMovie.getProducers()
    expect(otherProducer).to.include(data)
    expect(otherProducer.id).to.equals(producer.id)
  })

  it('return 201 if an existent person was added as producer to the movie by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const person = await this.db.Person.create(data)

    const { request, body, header } = await this.request
      .post(`/rest/movies/${this.movie.id}/producers`)
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
          href: `${baseUrl}/movies/${this.movie.id}/producers/${id}`,
        },
      },
    })

    const [producer] = await this.movie.getProducers()
    expect(producer).to.include(data)
    expect(parseInt(id)).to.equals(producer.id)
    expect(producer.id).to.equals(person.id)
  })

  it('do not add the same producer twice by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      producers: [data, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'producers',
      }],
    })

    const { request, body, header } = await this.request
      .post(`/rest/movies/${movie.id}/producers`)
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
          href: `${baseUrl}/movies/${movie.id}/producers/${id}`,
        },
      },
    })

    const producers = await movie.getProducers()
    const people = producers.filter(producer => producer.firstName == data.firstName)
    expect(people.length).to.equals(1)
    const [producer] = people
    expect(producer).to.include(data)
    expect(parseInt(id)).to.equals(producer.id)
  })

  it('return 401 if not authenticated', async function() {
    await this.request
      .post(`/rest/movies/${this.movie.id}/producers`)
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
      .post(`/rest/movies/${this.movie.id}/producers`)
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
      .post(`/rest/movies/${this.movie.id}/producers`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        firstName: '',
        lastName: 'Stallone',
      })
      .expect(400)
    expect(body.message).to.equals(`Request schema validation failed for POST/rest/movies/${this.movie.id}/producers`)
    expect(omit({ ...body }, 'message')).to.matchSnapshot()
    expect(await this.db.Person.count()).to.equal(0)
  })

  it('returns 404 if the movie does not exists', async function() {
    const unexistentMovieId = 9348
    await this.request
      .post(`/rest/movies/${unexistentMovieId}/producers`)
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
