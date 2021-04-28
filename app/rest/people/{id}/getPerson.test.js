const { expect } = require('chai')

describe('GET rest/people/{id}', function() {

  it('return 200 and the person by id', async function() {

    const person = await this.db.Person.create({
      firstName: 'Sylvester',
      lastName: 'Stallone',
    })

    const { request, body } = await this.request.get(`/rest/people/${person.id}`)
      .expect(200)

    const baseUrl = `${request.protocol}//${request.host}/rest`
    
    expect(body).to.deep.equal({
      firstName: person.firstName,
      lastName: person.lastName,
      _links: {
        self: {
          href: request.url,
        },
        aliases: {
          href: `${request.url}/aliases`,
        },
        moviesAsActor: {
          href: `${baseUrl}/movies?actorId=${person.id}`,
        },
        moviesAsProducer: {
          href: `${baseUrl}/movies?producerId=${person.id}`,
        },
        moviesAsDirector: {
          href: `${baseUrl}/movies?directorId=${person.id}`,
        },
      },
    })
  })

  it('return 404 if the person does not exist', async function() {
    const id = 45
    const { body } = await this.request.get(`/rest/people/${id}`).expect(404)
    expect(body).to.deep.equal({
      error: {
        status: 404,
        message: `Person ${id} not found`
      }
    })
  })

})
