import * as supertest from 'supertest'
import server from '../server'

export const request = () => supertest(server)

export const t = {
  request,
}
