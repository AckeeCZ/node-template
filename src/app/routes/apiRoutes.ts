import { createRouter } from 'ackee-node-api-core';

import * as helloController from '../controllers/api/helloController';

const router = createRouter();

router.all('/hello', helloController.anyHello);

export default router;
