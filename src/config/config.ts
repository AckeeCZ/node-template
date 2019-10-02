import { createLoader, safeValues, values } from 'configuru';
import { Level } from 'pino';

const loader = createLoader();

const configSchema = {
    logger: {
        defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
        pretty: loader.bool('LOGGER_PRETTY'),
    },
    enableTests: loader.bool('ENABLE_TESTS'),
    node: {
        env: loader.string('NODE_ENV'),
    },
    server: {
        port: loader.number('SERVER_PORT'),
    },
};

export default values(configSchema);
export const safeConfig = safeValues(configSchema);
