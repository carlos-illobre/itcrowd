const { expect } = require('chai')

describe('GET rest/movies', function() {

  it('return 200 if get all the movies', async function() {
    const movies = await this.db.Movie.bulkCreate([{
      title: 'Rambo',
      releaseYear: 1982,
    }, {
      title: 'Terminator',
      releaseYear: 1984,
    }])

    const { request, body } = await this.request.get('/rest/movies')
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: movies.map(({ id, title, releaseYear }) => ({
        title,
        releaseYear,
        _links: {
          self: {
            href: `${baseUrl}/movies/${id}`,
          },
          casting: {
            href: `${baseUrl}/movies/${id}/casting`,
          },
          producers: {
            href: `${baseUrl}/movies/${id}/producers`,
          },
          directors: {
            href: `${baseUrl}/movies/${id}/directors`,
          },
        },
      }))
    })
  })

  it('return 200 and the movies as actor', async function() {
    const movies = await this.db.Movie.bulkCreate([{
      title: 'Rambo',
      releaseYear: 1982,
    }, {
      title: 'Terminator',
      releaseYear: 1984,
    }])

    const movie = movies[1]

    const { id: actorId } = await movie.createCasting({
      firstName: 'Arnold',
      lastName: 'Schwarzenegger',
    })

    const { request, body } = await this.request.get(`/rest/movies?actorId=${actorId}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: [movie].map(({ id, title, releaseYear }) => ({
        title,
        releaseYear,
        _links: {
          self: {
            href: `${baseUrl}/movies/${id}`,
          },
          casting: {
            href: `${baseUrl}/movies/${id}/casting`,
          },
          producers: {
            href: `${baseUrl}/movies/${id}/producers`,
          },
          directors: {
            href: `${baseUrl}/movies/${id}/directors`,
          },
        },
      }))
    })
  })

  it('return 200 and the movies as director', async function() {
    const movies = await this.db.Movie.bulkCreate([{
      title: 'Rambo',
      releaseYear: 1982,
    }, {
      title: 'Terminator',
      releaseYear: 1984,
    }])

    const movie = movies[1]

    const { id: directorId } = await movie.createDirector({
      firstName: 'Arnold',
      lastName: 'Schwarzenegger',
    })

    const { request, body } = await this.request.get(`/rest/movies?directorId=${directorId}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: [movie].map(({ id, title, releaseYear }) => ({
        title,
        releaseYear,
        _links: {
          self: {
            href: `${baseUrl}/movies/${id}`,
          },
          casting: {
            href: `${baseUrl}/movies/${id}/casting`,
          },
          producers: {
            href: `${baseUrl}/movies/${id}/producers`,
          },
          directors: {
            href: `${baseUrl}/movies/${id}/directors`,
          },
        },
      }))
    })
  })

  it('return 200 and the movies as producer', async function() {
    const movies = await this.db.Movie.bulkCreate([{
      title: 'Rambo',
      releaseYear: 1982,
    }, {
      title: 'Terminator',
      releaseYear: 1984,
    }])

    const movie = movies[1]

    const { id: producerId } = await movie.createProducer({
      firstName: 'Arnold',
      lastName: 'Schwarzenegger',
    })

    const { request, body } = await this.request.get(`/rest/movies?producerId=${producerId}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: [movie].map(({ id, title, releaseYear }) => ({
        title,
        releaseYear,
        _links: {
          self: {
            href: `${baseUrl}/movies/${id}`,
          },
          casting: {
            href: `${baseUrl}/movies/${id}/casting`,
          },
          producers: {
            href: `${baseUrl}/movies/${id}/producers`,
          },
          directors: {
            href: `${baseUrl}/movies/${id}/directors`,
          },
        },
      }))
    })
  })

})
