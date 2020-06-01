import { createServer } from 'unicore'
import logger from './app/logger'
import bindRoutes from './config/routes'

const server = createServer()
server.use(logger.express)
bindRoutes(server)

export default server
