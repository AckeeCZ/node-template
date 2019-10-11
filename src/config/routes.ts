import { createRouter, defaultFinalHandler, defaultRootHandler, jsonParser } from 'unicore';
import healthz from '../app/controllers/healthz';
import httpErrorResponder from '../app/controllers/httpErrorResponder';
import { pipeMiddleware } from '../app/controllers/utils/controllerUtils';
import apiRoutes from '../app/routes/apiRoutes';

export const api = pipeMiddleware(jsonParser(), apiRoutes);
export { healthz, httpErrorResponder, defaultFinalHandler, defaultRootHandler };

const all = createRouter();
all.all('/', defaultRootHandler);
all.use(healthz);
all.use('/api', api);
all.use(httpErrorResponder);
all.use(defaultFinalHandler);

export default all;
