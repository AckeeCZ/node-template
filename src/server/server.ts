import { createServer } from 'unicore';
import logger from '../components/logger';
import bindRoutes from './routes';

const server = createServer();
server.use(logger.express);
bindRoutes(server);

export default server;
