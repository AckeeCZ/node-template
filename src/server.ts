import logger from 'app/logger';
import { createServer } from 'unicore';
import bindRoutes from './config/routes';

const server = createServer();
server.use(logger.express);
bindRoutes(server);

export default server;
