const { expect } = require('chai')
const { omit } = require('lodash')

describe('POST rest/people/{id}/aliases', function() {

  it('return 201 if the alias was added to the person by an authenticated user', async function() {

    const alias = 'The Rock'

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })

    const { request, body, header } = await this.request
      .post(`/rest/people/${person.id}/aliases`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ alias })
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(header.location).to.equal(`${baseUrl}/people/${person.id}/aliases/${id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: header.location,
        },
      },
    })

    const aliases = await person.getAliases()
    expect(aliases[0].name).to.equals(alias)
    expect(parseInt(id)).to.equals(aliases[0].id)
  })

  it('return 200 if alias is repeated by an authenticated user', async function() {

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

    const { request, body, header } = await this.request
      .post(`/rest/people/${person.id}/aliases`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ alias })
      .expect(201)

    expect(header.location).to.exist
    const id = header.location.split('/').pop()
    const baseUrl = `${request.protocol}//${request.host}/rest`
    expect(header.location).to.equal(`${baseUrl}/people/${person.id}/aliases/${person.aliases[0].id}`)

    expect(body).to.deep.equal({
      _links: {
        self: {
          href: header.location,
        },
      },
    })

    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(1)
    expect(aliases[0].name).to.equals(alias)
    expect(parseInt(id)).to.equals(aliases[0].id)
  })

  it('return 401 if not authenticated', async function() {

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })
    
    await this.request
      .post(`/rest/people/${person.id}/aliases`)
      .send({ alias: 'The Rock' })
      .expect(401, {})

    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(0)
  })

  it('return 401 if JWT expired', async function() {

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })
    
    await this.request
      .post(`/rest/people/${person.id}/aliases`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk')
      .send({ alias: 'The Rock' })
      .expect(401, {})
    
    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(0)
  })

  it('return 400 if the alias is empty', async function() {
    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })
    const { body } = await this.request
      .post(`/rest/people/${person.id}/aliases`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ alias: '' })
      .expect(400)
    expect(omit(body, ['error.errors[0].instance', 'message'])).to.matchSnapshot()
    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(0)
  })

  it('returns 404 if the person does not exists', async function() {
    const unexistentPersonId = 9348
    await this.request
      .post(`/rest/people/${unexistentPersonId}/aliases`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ alias: 'The Rock' })
      .expect(404, {
        error: {
          message: `Person ${unexistentPersonId} not found.`,
          status: 404,
        }
      })
    const count = await this.db.Person.count()
    expect(count).to.equals(0)
  })
})
