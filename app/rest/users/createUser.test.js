const { expect } = require('chai')

describe('POST rest/users', function () {

  it('return 201 if the user was created', async function() {

    const data = {
      email: 'some@email',
      password: 'secret',
    }

    const { request, body } = await this.request
      .post('/rest/users')
      .send(data)
      .expect(201)

    expect(body).to.deep.equal({
      _links: {
        login: {
          href: `${request.url}/login`,
        },
      },
    })

    const user = await this.db.User.findByEmailAndPassword(data)
    expect(user).to.exist
    expect(user.password).to.not.equals(data.password)
  })

  it('return 400 if the email already exist', async function() {

    const data = {
      email: 'some@email',
      password: 'secret',
    }

    await this.db.User.create(data)

    const { body } = await this.request
      .post('/rest/users')
      .send(data)
      .expect(400)

    expect(body.error.errors[0].message).to.equals('email must be unique')
  })

})
