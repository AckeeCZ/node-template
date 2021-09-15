import config from '../config'
import { E_CODE, ServerError } from '../app/errors'
import { t } from './testing'

describe('Template (System)', () => {
  test('Configuration is loaded', () => {
    expect(typeof config)
      .toBeTruthy()
      .toBe('object')
  })
  describe('Errors', () => {
    test('Throws', () => {
      expect(() => {
        throw new ServerError(E_CODE.UNKNOWN)
      }).toThrow(ServerError)
    })
    test('Throws with correct name', () => {
      let name = ''
      try {
        throw new ServerError(E_CODE.UNKNOWN)
      } catch (e) {
        if (e instanceof ServerError) {
          name = e.name
        }
      }
      expect(name).toBe('ServerError')
    })
    test('Responds to toJson as expected', () => {
      expect(
        new ServerError(E_CODE.UNKNOWN, { data: true }).toJSON()
      ).toMatchSnapshot({
        stack: expect.stringContaining('at'),
      })
    })
    test('Works without error code', () => {
      expect(new ServerError().toJSON()).toMatchSnapshot({
        stack: expect.stringContaining('at'),
      })
    })
  })
  describe('Server', () => {
    it('Server does respond', () => {
      return t.request().get('/').expect(200)
    })
    it('Healthz', () => {
      return (
        t
          .request()
          .get('/healthz')
          // Default healthz fails deliberately to remind replacement with real impl.
          .expect(500)
          .then(({ body }: any) => {
            expect(body.tldr).toMatchSnapshot()
          })
      )
    })
  })
  describe('Hello', () => {
    test('Hello', () => {
      const input = {
        a: 1,
      }
      return t
        .request()
        .post('/hello')
        .send(input)
        .expect(200)
        .then(({ body }: any) => {
          const { payload, ...rest } = body
          expect(payload).toEqual(input)
          expect(rest).toMatchInlineSnapshot(`
            Object {
              "hello": "World",
            }
          `)
        })
    })
  })
})
