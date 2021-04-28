const { expect } = require('chai')

describe('POST rest/movies', function() {

  it('return 201 if the movie was created by an authenticated user', async function() {

    const data = {
      title: 'Rambo',
      releaseYear: 1982,
    }

    const { request, body, header } = await this.request
      .post('/rest/movies')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    expect(header.location).to.equal(`${request.url}/${id}`)
    expect(body).to.deep.equal({
      _links: {
        self: {
          href: header.location,
        },
        casting: {
          href: `${header.location}/casting`,
        },
        producers: {
          href: `${header.location}/producers`,
        },
        directors: {
          href: `${header.location}/directors`,
        },
      },
    })

    const movie = await this.db.Movie.findByPk(id)
    expect(movie).to.include({
      ...data,
      releaseYear: 'MCMLXXXII',
    })
  })

  it('return 401 if not authenticated', async function() {
    await this.request
      .post('/rest/movies')
      .send({
        title: 'Rambo',
        releaseYear: 1982,
      })
      .expect(401, {})
    
    const count = await this.db.Movie.count()
    expect(count).to.equals(0)
  })

  it('return 401 if JWT expired', async function() {
    await this.request
      .post('/rest/movies')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk')
      .send({
        title: 'Rambo',
        releaseYear: 1982,
      })
      .expect(401, {})
    
    const count = await this.db.Movie.count()
    expect(count).to.equals(0)
  })

  it('return 400 if the title is empty', async function() {
    const { body } = await this.request
      .post('/rest/movies')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        title: '',
        releaseYear: 1982,
      })
      .expect(400)
    expect(body).to.matchSnapshot()
    expect(await this.db.Movie.count()).to.equal(0)
  })

  it('return 400 if no release year', async function() {
    const { body } = await this.request
      .post('/rest/movies')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        title: 'Rambo',
      })
      .expect(400)
    expect(body).to.matchSnapshot()
    expect(await this.db.Movie.count()).to.equal(0)
  })

  it('return 400 if the release year is not a number', async function() {
    const { body } = await this.request
      .post('/rest/movies')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        title: 'Rambo',
        releaseYear: 'some text',
      })
      .expect(400)
    expect(body).to.matchSnapshot()
    expect(await this.db.Movie.count()).to.equal(0)
  })

})
