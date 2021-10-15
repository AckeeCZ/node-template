import config from '../config'

describe('Template', () => {
  test('Config is loaded', () => {
    expect(config.node.env).toBeString()
  })
})
