const { expect } = require('chai')
const { verify } = require('jsonwebtoken')

describe('POST rest/users/login', function () {

  it('return 201 if the login was successful', async function() {
    const data = { email: 'some@email.com', password: 'secret' }
    const { id } = await this.db.User.create(data)
    const { body, request } = await this.request
      .post('/rest/users/login')
      .send(data)
      .expect(201)

    const baseUrl = `${request.protocol}//${request.host}/rest`
    
    const { sub } = verify(body.accessToken, process.env.JWT_SEED)
    expect(sub).to.equal(id)
    
    expect(body).to.deep.equal({
      accessToken: body.accessToken,
      _links: {
        movies: {
          href: `${baseUrl}/movies`,
        },
        people: {
          href: `${baseUrl}/people`,
        },
      },
    })
  })

  it('return 401 if the user does not exist', async function() {
    await this.request
      .post('/rest/users/login')
      .send({ email: 'some@email.com', password: 'secret' })
      .expect(401)
  })

  it('return 401 if the password is wrong', async function() {
    const data = { email: 'some@email.com', password: 'secret' }
    await this.db.User.create(data)
    await this.request
      .post('/rest/users/login')
      .send({ ...data, password: 'wrong'})
      .expect(401)
  })
})
