const { expect } = require('chai')

describe('GET rest/movies/{id}', function() {

  it('return 200 and the movie by id', async function() {

    const casting = [{
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }, {
      firstName: 'Richard',
      lastName: 'Crenna',
    }]

    const directors = [{
      firstName: 'Ted',
      lastName: 'Kotcheff',
    }]

    const producers = [{
      firstName: 'Buzz',
      lastName: 'Feitshans',
    }]

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      casting,
      directors,
      producers,
    }, {
      include: [{
        association: 'casting',
      }, {
        association: 'directors',
      }, {
        association: 'producers',
      }],
    })

    const { request, body } = await this.request.get(`/rest/movies/${movie.id}`)
      .expect(200)

    expect(body).to.deep.equal({
      title: movie.title,
      releaseYear: movie.releaseYear,
      casting,
      directors,
      producers,
      _links: {
        self: {
          href: request.url,
        },
        casting: {
          href: `${request.url}/casting`,
        },
        producers: {
          href: `${request.url}/producers`,
        },
        directors: {
          href: `${request.url}/directors`,
        },
      },
    })
  })

  it('return 404 if the person does not exist', async function() {
    const id = 45
    const { body } = await this.request.get(`/rest/movies/${id}`).expect(404)
    expect(body).to.deep.equal({
      error: {
        status: 404,
        message: `Movie ${id} not found`
      }
    })
  })

})
