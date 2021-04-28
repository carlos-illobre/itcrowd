const { expect } = require('chai')

describe('Movie', function() {

  it('transform the movie released year into a roman number', function() {
    const movie = this.db.Movie.build({
      title: 'Rambo',
      releaseYear: 1982,
    })
    expect(movie.releaseYear).to.equal('MCMLXXXII')
  })

})
