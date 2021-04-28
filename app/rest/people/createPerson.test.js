const { expect } = require('chai')

describe('POST rest/people', function() {

  it('return 201 if the person was created by an authenticated user', async function() {

    const data = {
      firstName: 'Sylvester',
      lastName: 'Stallone',
    }

    const { request, body, header } = await this.request
      .post('/rest/people')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send(data)
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    expect(header.location).to.equal(`${request.url}/${id}`)

    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(body).to.deep.equal({
      _links: {
        self: {
          href: header.location,
        },
        aliases: {
          href: `${header.location}/aliases`,
        },
        moviesAsActor: {
          href: `${baseUrl}/movies?actorId=${id}`,
        },
        moviesAsProducer: {
          href: `${baseUrl}/movies?producerId=${id}`,
        },
        moviesAsDirector: {
          href: `${baseUrl}/movies?directorId=${id}`,
        },
      },
    })

    const person = await this.db.Person.findByPk(id)
    expect(person).to.include(data)
  })

  it('return 401 if not authenticated', async function() {
    await this.request
      .post('/rest/people')
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
      .post('/rest/people')
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
      .post('/rest/people')
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({
        firstName: '',
        lastName: 'Stallone',
      })
      .expect(400)
    expect(body).to.matchSnapshot()
    expect(await this.db.Person.count()).to.equal(0)
  })

})
