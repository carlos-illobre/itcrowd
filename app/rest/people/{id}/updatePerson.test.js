const { expect } = require('chai')

describe('PATCH rest/people/{id}', function() {

  it('updates the first name', async function() {
    const data = {
      firstName: 'Arnold',
      lastName: 'Stallone',
    }
    const firstName = 'Sylvester'
    const person = await this.db.Person.create(data)
    await this.request
      .patch(`/rest/people/${person.id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ firstName })
      .expect(204)
    await person.reload()
    expect(person.firstName).to.equals(firstName)
    expect(person.lastName).to.equals(data.lastName)
  })

  it('return 401 if not authenticated', async function() {
    const data = {
      firstName: 'Arnold',
      lastName: 'Stallone',
    }
    const person = await this.db.Person.create(data)
    await this.request
      .patch(`/rest/people/${person.id}`)
      .send({ firstName: 'Sylvester' })
      .expect(401, {})
    await person.reload()
    expect(person.firstName).to.equals(data.firstName)
    expect(person.lastName).to.equals(data.lastName)
  })

  it('return 404 if the person does not exist', async function() {
    const id = 45
    const { body } = await this.request
      .patch(`/rest/people/${id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .expect(404)
    expect(body).to.deep.equal({
      error: {
        status: 404,
        message: `Person ${id} not found`
      }
    })
  })

})
