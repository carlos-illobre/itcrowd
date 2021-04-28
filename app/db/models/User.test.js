const { expect } = require('chai')

describe('User', function() {

  it('saves a user with a hashed password', async function() {
    const data = {
      password: 'secret',
      email: 'some@email.com',
    }
    await this.db.User.create(data)
    const user = await this.db.User.findByEmailAndPassword(data)
    expect(user.password).to.not.equals(data.password)
  })

})
