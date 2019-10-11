import logger from './app/logger';
import config, { safeConfig } from './config';
import server from './server.app';
export * from './server.cf';

logger.info(safeConfig, 'Loaded config');

// Application. Start only if port is set.
if (config.server.port) {
    server
        .listen(config.server.port)
        .then(() => logger.info(`Server listening. port=${config.server.port}`))
        .catch(error => logger.error({ error }, `Server failed to start. ${error}`));
}

export default server;
