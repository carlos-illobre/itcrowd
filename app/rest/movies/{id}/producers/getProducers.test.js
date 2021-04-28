const { expect } = require('chai')

describe('GET rest/movies/{id}/producers', function() {

  it('return 200 if get the producers', async function() {

    await this.db.Person.create({
      firstName: 'Arnold',
      lastName: 'Schwarzenegger',
    })

    const movie = await this.db.Movie.create({
      title: 'Rambo',
      releaseYear: 1982,
      producers: [{
        firstName: 'Sylvester',
        lastName: 'Stallone',
      }, {
        firstName: 'Richard',
        lastName: 'Crenna',
      }],
    }, {
      include: [{
        association: 'producers',
      }],
    })

    const { request, body } = await this.request.get(`/rest/movies/${movie.id}/producers`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: movie.producers.map(({ id, firstName, lastName }) => ({
        firstName,
        lastName,
        _links: {
          self: {
            href: `${baseUrl}/people/${id}`,
          },
          moviesAsActor: {
            href: `${baseUrl}/movies?actorId=${id}`,
          },
          moviesAsDirector: {
            href: `${baseUrl}/movies?directorId=${id}`,
          },
          moviesAsProducer: {
            href: `${baseUrl}/movies?producerId=${id}`,
          },
        },
      }))
    })
  })

})
