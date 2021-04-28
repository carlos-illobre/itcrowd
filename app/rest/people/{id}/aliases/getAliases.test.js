const { expect } = require('chai')

describe('GET rest/people/{id}/aliases', function() {

  it('return 200 and the person by id', async function() {

    const alias = 'The Rock'

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
      aliases: [{
        name: alias,
      }],
    }, {
      include: [{
        association: 'aliases'
      }],
    })

    const { request, body } = await this.request.get(`/rest/people/${person.id}/aliases`)
      .expect(200)

    expect(body).to.deep.equal({
      items: [{
        alias,
        _links: {
          self: {
            href: `${request.url}/${person.aliases[0].id}`,
          },
        },
      }],
    })
  })

  it('return 404 if the person does not exist', async function() {
    const id = 45
    const { body } = await this.request.get(`/rest/people/${id}/aliases`).expect(404)
    expect(body).to.deep.equal({
      error: {
        status: 404,
        message: `Person ${id} not found`
      }
    })
  })

})
