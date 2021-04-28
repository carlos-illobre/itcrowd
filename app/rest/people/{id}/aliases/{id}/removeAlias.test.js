const { expect } = require('chai')

describe('DELETE rest/people/{id}/aliases/{id}', function() {

  it('return 201 if the alias was removed from the person by an authenticated user', async function() {

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
      aliases: [{
        name: 'The Rock',
      }],
    }, {
      include: [{
        association: 'aliases'
      }],
    })

    await this.request
      .delete(`/rest/people/${person.id}/aliases/${person.aliases[0].id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(204)

    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(0)
  })

  it('return 404 if the alias does not exist by an authenticated user', async function() {
    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
    })
    await this.request
      .delete(`/rest/people/${person.id}/aliases/343424`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(404)
  })

  it('return 401 if not authenticated', async function() {

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
      aliases: [{
        name: 'The Rock',
      }],
    }, {
      include: [{
        association: 'aliases'
      }],
    })
    
    await this.request
      .delete(`/rest/people/${person.id}/aliases/${person.aliases[0].id}`)
      .expect(401, {})

    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(1)
  })

  it('return 401 if JWT expired', async function() {

    const person = await this.db.Person.create({
      firstName: 'Dwayne',
      lastName: 'Johnson',
      aliases: [{
        name: 'The Rock',
      }],
    }, {
      include: [{
        association: 'aliases'
      }],
    })
    
    await this.request
      .delete(`/rest/people/${person.id}/aliases/${person.aliases[0].id}`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOnsiaWQiOjF9LCJpYXQiOjE1MTAxNTI2MDEsImV4cCI6MTUxMDIzOTAwMX0.5JmvBOkG3jkhQfZwB61o650P0XDqIijuRv41m6Sn6Qk')
      .expect(401, {})
    
    const aliases = await person.getAliases()
    expect(aliases.length).to.equals(1)
  })

  it('returns 404 if the person does not exists', async function() {
    const unexistentPersonId = 9348
    await this.request
      .delete(`/rest/people/${unexistentPersonId}/aliases/${unexistentPersonId}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(404)
    const count = await this.db.Person.count()
    expect(count).to.equals(0)
  })
})
