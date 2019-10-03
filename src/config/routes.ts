import httpErrorResponder from 'app/controllers/httpErrorResponder';
import { createRouter, createServer, defaultFinalHandler, defaultRootHandler, jsonParser } from 'unicore';
import healthz from '../app/controllers/healthz';
import apiRoutes from '../app/routes/apiRoutes';

export default (app: ReturnType<typeof createServer>) => {
    const router = createRouter();
    router.all('/', defaultRootHandler);
    router.use(healthz);

    router.use('/api', jsonParser(), apiRoutes);

    router.use(httpErrorResponder);
    router.use(defaultFinalHandler);
    app.use(router);
};
