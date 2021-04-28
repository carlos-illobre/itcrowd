const { expect } = require('chai')

describe('PATCH rest/movies/{id}', function() {

  it('updates the release year', async function() {
    const data = {
      title: 'Rambo',
      releaseYear: '1992',
    }
    const movie = await this.db.Movie.create(data)
    await this.request
      .patch(`/rest/movies/${movie.id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ releaseYear: 1982 })
      .expect(204)
    await movie.reload()
    expect(movie.releaseYear).to.equals('MCMLXXXII')
    expect(movie.title).to.equals(data.title)
  })

  it('return 401 if not authenticated', async function() {
    const data = {
      title: 'Rambo',
      releaseYear: '1992',
    }
    const movie = await this.db.Movie.create(data)
    await this.request
      .patch(`/rest/movies/${movie.id}`)
      .send({ releaseYear: 1982 })
      .expect(401, {})
    await movie.reload()
    expect(movie.title).to.equals(data.title)
    expect(movie.releaseYear).to.equals('MCMXCII')
  })

  it('return 404 if the movie does not exist', async function() {
    const id = 45
    const { body } = await this.request
      .patch(`/rest/movies/${id}`)
      .set('Authorization', `Bearer ${this.jwt}`)
      .send({ releaseYear: 1982 })
      .expect(404)
    expect(body).to.deep.equal({
      error: {
        status: 404,
        message: `Movie ${id} not found`
      }
    })
  })

})
