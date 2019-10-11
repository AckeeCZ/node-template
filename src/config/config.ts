import { createLoader, safeValues, values } from 'configuru';
import { SUPPORTED_REGIONS } from 'firebase-functions';
import * as fs from 'fs';
import * as path from 'path';
import { Level } from 'pino';

const PROJECT_ROOT = path.join(__dirname, '..', '..');
const loaderOptions = {
    // All options must be specified, including defaults
    // See https://github.com/AckeeCZ/configuru/issues/10
    defaultConfigPath: path.join(PROJECT_ROOT, '.env.json'),
    userConfigPath: fs.existsSync(path.join(PROJECT_ROOT, 'credentials.json'))
        ? path.join(PROJECT_ROOT, 'credentials.json')
        : process.env.CFG_JSON_PATH || path.join(PROJECT_ROOT, '.env.json'),
    envMode: 'all' as const,
};

const loader = createLoader(loaderOptions);

export type CfRegion = typeof SUPPORTED_REGIONS[number];

const cfRegionLoader = loader.custom((x: CfRegion) => x);

const configSchema = {
    logger: {
        defaultLevel: loader.custom(x => x as Level)('LOGGER_DEFAULT_LEVEL'),
        pretty: loader.bool('LOGGER_PRETTY'),
    },
    enableTests: loader.bool('ENABLE_TESTS'),
    node: {
        env: loader.string('NODE_ENV'),
    },
    functions: {
        region: cfRegionLoader('CF_REGION'),
    },
    server: {
        port: loader.number.nullable('SERVER_PORT'),
    },
};

export default values(configSchema);
export const safeConfig = safeValues(configSchema);
