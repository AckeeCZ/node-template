import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as request from 'supertest-as-promised'
import {
  bindContext,
  meTranslate,
  omitOrder,
  omitPagination,
  pipeMiddleware,
  respond,
} from '../../app/controllers/utils/controllerUtils'

let app: express.Express
const resetExpress = () => {
  app = express()
  app.use(bodyParser.json())
}
describe('Controller utils', () => {
  beforeEach(() => {
    resetExpress()
  })
  describe('respond', () => {
    const goodAction = jest.fn().mockResolvedValue({ good: true })
    const error = { good: false }
    const badAction = jest.fn().mockRejectedValue(error)
    beforeEach(() => {
      resetExpress()
    })
    test('Calls handler and default writer saves result to response', async () => {
      app.all('/', respond(goodAction))
      await request(app)
        .get('/')
        .expect(({ body }) => expect(body).toMatchSnapshot())
      expect(goodAction).toHaveBeenCalledTimes(1)
    })
    test('Saves desired status code', async () => {
      const code = 422
      app.all('/', respond(goodAction, code))
      await request(app).get('/')
    })
    test('Passes on error, sets 500', async () => {
      let thrown: any
      app.all('/', respond(badAction))
      const errHandler: express.ErrorRequestHandler = (
        err,
        _req,
        _res,
        next
      ) => {
        thrown = err
        next(error)
      }
      app.use(errHandler)
      await request(app).get('/').expect(500)
      expect(thrown).toEqual(error)
    })
    test('Custom writer', async () => {
      const writer = (
        _: express.Request,
        res: express.Response,
        data?: any
      ) => {
        res.json({ data })
      }
      app.all('/good', respond(goodAction, 200, writer))
      await request(app)
        .get('/good')
        .expect(({ body }) => expect(body).toMatchSnapshot())
    })
  })
  describe('pipeMiddleware', () => {
    test('Pipes array of middlewares in ltr composition', async () => {
      const newWriteHandler = (str: string): express.Handler => (
        _,
        res,
        next
      ) => {
        res.write(str)
        next()
      }
      const endHandler: express.Handler = (_, res, next) => {
        res.end()
        next()
      }
      app.all(
        '/',
        pipeMiddleware(
          newWriteHandler('a'),
          newWriteHandler('b'),
          newWriteHandler('c'),
          endHandler
        )
      )
      await request(app)
        .get('/')
        .expect(({ text }) => {
          expect(text).toBe('abc')
        })
    })
  })
  describe('bindContext', () => {
    test('Sets context', async () => {
      let context: any
      const captureMdw: express.Handler = (req, _, next) => {
        context = req.context
        next()
      }
      app.use(bindContext)
      app.use(captureMdw)
      await request(app).get('/')
      expect(context).toBeDefined()
    })
  })
  describe('omit', () => {
    const data = { foo: true, order: 'asc', limit: 0, offset: 0 }
    test('omitOrder', () => {
      expect(omitOrder(data)).toMatchSnapshot()
    })
    test('omitPagination', () => {
      expect(omitPagination(data)).toMatchSnapshot()
    })
  })
  describe('meTranslate', () => {
    test('Translates params and query, including arrays', async () => {
      const received: any = {}
      const id = 123
      const bindUser: express.Handler = (req, _, next) => {
        req.context = {
          user: { id },
        }
        next()
      }
      const handler = jest.fn((req, _, next) => {
        received.params = req.params
        received.query = req.query
        next()
      })
      app.get('/users/:id', bindUser, meTranslate, handler)
      await request(app).get(
        '/users/me?foo=me&bar=he&baz=metoo&arr%5B0%5D=me&arr%5B1%5D=they'
      )
      expect(received).toMatchSnapshot()
    })
    test('Does not fail without context', async () => {
      const handler = jest.fn((_, res, next) => {
        res.json({ cool: true })
        next()
      })
      app.get('/foo', meTranslate, handler)
      await request(app).get('/foo').expect(200)
    })
  })
})
