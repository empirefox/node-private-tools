import 'reflect-metadata';
import { Arukas } from '../src/node-private-tools'

/**
 * Arukas test
 */
describe('Arukas test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Arukas is instantiable', () => {
    expect(new Arukas(null)).toBeInstanceOf(Arukas)
  })
})
