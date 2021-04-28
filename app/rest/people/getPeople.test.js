const { expect } = require('chai')

describe('GET rest/people', function() {

  it('return 200 if get all the people', async function() {
    const people = await this.db.Person.bulkCreate([{
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }, {
      firstName: 'Richard',
      lastName: 'Crenna',
    }])

    const { request, body } = await this.request.get('/rest/people')
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`

    expect(body).to.deep.equal({
      items: people.map(({ id, firstName, lastName }) => ({
        firstName,
        lastName,
        _links: {
          self: {
            href: `${baseUrl}/people/${id}`,
          },
          aliases: {
            href: `${baseUrl}/people/${id}/aliases`,
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
