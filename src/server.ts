import * as apiCore from 'ackee-node-api-core';
import logger from 'app/logger';
import bindRoutes from './config/routes';

const server = apiCore.createServer();
server.use(logger.express);
bindRoutes(server);

export default server;
