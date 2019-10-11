import { createServer } from 'unicore';
import logger from './app/logger';
import routes from './config/routes';

const server = createServer();
server.use(logger.express);
server.use(routes);

export default server;
