import { createRouter, defaultFinalHandler, defaultRootHandler, jsonParser } from 'ackee-node-api-core';
import httpErrorResponder from 'app/controllers/httpErrorResponder';
import { Application } from 'express';
import healthz from '../app/controllers/healthz';
import apiRoutes from '../app/routes/apiRoutes';

export default (app: Application) => {
    const router = createRouter();
    router.all('/', defaultRootHandler);
    router.use(healthz);

    router.use('/api', jsonParser(), apiRoutes);

    router.use(httpErrorResponder);
    router.use(defaultFinalHandler);
    app.use(router);
};
