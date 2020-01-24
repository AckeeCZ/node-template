import { createRouter, createServer, defaultFinalHandler, defaultRootHandler, jsonParser } from 'unicore';
import { baseController } from '../controllers/api/genericControllers';
import healthz from '../controllers/healthz';
import httpErrorResponder from '../controllers/httpErrorResponder';
import { hello } from '../services/helloService';

export default (app: ReturnType<typeof createServer>) => {
    const router = createRouter();
    router.all('/', defaultRootHandler);
    router.use(healthz);

    router.use(jsonParser());
    router.all('/api/hello', baseController(hello));

    router.use(httpErrorResponder);
    router.use(defaultFinalHandler);
    app.use(router);
};
